import { computeRiskScore } from "@trustfun/shared/risk-engine";
import type {
  ComplianceStatus,
  DistributionSlice,
  TokenomicsSource,
  TrustFunToken,
} from "@trustfun/shared/types";
import { prisma } from "../database/prisma";
import { TOKEN_INCLUDE, toToken, type TokenWithCreator } from "../database/mappers";
import { HttpError } from "../utils/httpError";
import { toJson } from "../utils/prismaJson";

// AI draft copy is intentionally identical to the one the mock service used
// this session, so existing UI copy in LaunchPage.tsx stays accurate.
const AI_DRAFT_DISTRIBUTION: DistributionSlice[] = [
  { label: "Public sale", percent: 55 },
  { label: "Liquidity", percent: 20 },
  { label: "Team", percent: 15 },
  { label: "Community treasury", percent: 10 },
];
const AI_DRAFT_SUMMARY =
  "AI-drafted starting point: 55% public sale, 20% liquidity, 15% team, 10% community treasury. Edit before submitting — this has not been reviewed.";
const AI_DRAFT_VESTING = "Suggested: 12-month cliff, 24-month linear vest for team allocation.";

function assertDistributionSumsTo100(distribution: DistributionSlice[]) {
  const total = distribution.reduce((sum, d) => sum + (Number(d.percent) || 0), 0);
  if (total !== 100) {
    throw new HttpError(400, `Distribution must total 100% (got ${total}%)`);
  }
}

async function loadTokenOrThrow(tokenId: string): Promise<TokenWithCreator> {
  const token = await prisma.token.findUnique({ where: { id: tokenId }, include: TOKEN_INCLUDE });
  if (!token) throw new HttpError(404, `Token ${tokenId} not found`);
  return token;
}

interface RiskInputSource {
  liquidityLocked: boolean;
  liquidityLockedPercent: number | null;
  liquidityUnlockDate: Date | null;
  liquidityLockContractUrl: string | null;
  tokenomicsSource: TokenomicsSource;
  tokenomicsSummary: string;
  tokenomicsDistribution: DistributionSlice[];
  tokenomicsVestingDescription: string | null;
  tokenomicsComplianceStatus: ComplianceStatus;
  tokenomicsGeneratedAt: Date | null;
  tokenomicsReviewedAt: Date | null;
  creator: { isAnonymous: boolean; verified: boolean; tokensLaunched: number };
}

function riskInputFromRow(row: RiskInputSource) {
  return {
    liquidityLock: {
      locked: row.liquidityLocked,
      lockedPercent: row.liquidityLockedPercent,
      unlockDate: row.liquidityUnlockDate?.toISOString() ?? null,
      lockContractUrl: row.liquidityLockContractUrl,
    },
    tokenomics: {
      source: row.tokenomicsSource,
      summary: row.tokenomicsSummary,
      distribution: row.tokenomicsDistribution,
      vestingDescription: row.tokenomicsVestingDescription,
      complianceStatus: row.tokenomicsComplianceStatus,
      generatedAt: row.tokenomicsGeneratedAt?.toISOString() ?? null,
      reviewedAt: row.tokenomicsReviewedAt?.toISOString() ?? null,
    },
    distribution: row.tokenomicsDistribution,
    creatorIsAnonymous: row.creator.isAnonymous,
    creatorVerified: row.creator.verified,
    creatorTokensLaunched: row.creator.tokensLaunched,
  };
}

export async function listTokens(): Promise<TrustFunToken[]> {
  const rows = await prisma.token.findMany({
    where: { stage: "published" },
    include: TOKEN_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toToken);
}

export async function getToken(tokenId: string): Promise<TrustFunToken | undefined> {
  const row = await prisma.token.findUnique({ where: { id: tokenId }, include: TOKEN_INCLUDE });
  return row ? toToken(row) : undefined;
}

export interface CreateTokenDraftInput {
  name: string;
  symbol: string;
  description: string;
  totalSupply: number;
  creator: { displayName: string; walletAddress: string; isAnonymous: boolean };
}

export async function createTokenDraft(input: CreateTokenDraftInput): Promise<TrustFunToken> {
  if (
    !input.name?.trim() ||
    !input.symbol?.trim() ||
    !input.description?.trim() ||
    !input.creator?.walletAddress?.trim() ||
    !input.creator?.displayName?.trim()
  ) {
    throw new HttpError(400, "name, symbol, description, and creator info are required");
  }
  if (!Number.isFinite(input.totalSupply) || input.totalSupply <= 0) {
    throw new HttpError(400, "totalSupply must be a positive number");
  }

  // Never trust client-supplied `verified` — a wallet's verification status
  // is only ever set by TrustFun (a future admin/compliance tool), never by
  // the creator themself.
  const creator = await prisma.creator.upsert({
    where: { walletAddress: input.creator.walletAddress },
    update: {
      displayName: input.creator.displayName,
      isAnonymous: input.creator.isAnonymous,
    },
    create: {
      displayName: input.creator.displayName,
      walletAddress: input.creator.walletAddress,
      isAnonymous: input.creator.isAnonymous,
      verified: false,
    },
  });

  const priorLaunchCount = await prisma.token.count({ where: { creatorId: creator.id } });

  const riskScore = computeRiskScore({
    liquidityLock: { locked: false, lockedPercent: null, unlockDate: null, lockContractUrl: null },
    tokenomics: {
      source: "creator_authored",
      summary: "",
      distribution: [],
      vestingDescription: null,
      complianceStatus: "not_applicable",
      generatedAt: null,
      reviewedAt: null,
    },
    distribution: [],
    creatorIsAnonymous: creator.isAnonymous,
    creatorVerified: creator.verified,
    creatorTokensLaunched: priorLaunchCount,
  });

  const row = await prisma.token.create({
    data: {
      name: input.name.trim(),
      symbol: input.symbol.trim().toUpperCase(),
      description: input.description.trim(),
      totalSupply: BigInt(Math.trunc(input.totalSupply)),
      creatorId: creator.id,
      stage: "draft",
      disclosureComplete: false,
      tokenomicsDistribution: toJson([]),
      riskScore: riskScore.score,
      riskFactors: toJson(riskScore.factors),
      riskComputedAt: new Date(riskScore.computedAt),
      riskMethodologyVersion: riskScore.methodologyVersion,
    },
    include: TOKEN_INCLUDE,
  });

  return toToken(row);
}

export interface ManualTokenomicsInput {
  distribution: DistributionSlice[];
  vestingDescription: string | null;
  summary: string;
}

export async function setManualTokenomics(
  tokenId: string,
  input: ManualTokenomicsInput
): Promise<TrustFunToken> {
  assertDistributionSumsTo100(input.distribution);
  const existing = await loadTokenOrThrow(tokenId);

  const riskScore = computeRiskScore(
    riskInputFromRow({
      liquidityLocked: existing.liquidityLocked,
      liquidityLockedPercent: existing.liquidityLockedPercent,
      liquidityUnlockDate: existing.liquidityUnlockDate,
      liquidityLockContractUrl: existing.liquidityLockContractUrl,
      tokenomicsDistribution: input.distribution,
      tokenomicsSource: "creator_authored",
      tokenomicsSummary: input.summary,
      tokenomicsVestingDescription: input.vestingDescription,
      tokenomicsComplianceStatus: "not_applicable",
      tokenomicsGeneratedAt: null,
      tokenomicsReviewedAt: null,
      creator: {
        isAnonymous: existing.creator.isAnonymous,
        verified: existing.creator.verified,
        tokensLaunched: existing.creator._count.tokens,
      },
    })
  );

  const row = await prisma.token.update({
    where: { id: tokenId },
    data: {
      tokenomicsSource: "creator_authored",
      tokenomicsSummary: input.summary,
      tokenomicsDistribution: toJson(input.distribution),
      tokenomicsVestingDescription: input.vestingDescription,
      tokenomicsComplianceStatus: "not_applicable",
      tokenomicsGeneratedAt: null,
      tokenomicsReviewedAt: null,
      riskScore: riskScore.score,
      riskFactors: toJson(riskScore.factors),
      riskComputedAt: new Date(riskScore.computedAt),
      riskMethodologyVersion: riskScore.methodologyVersion,
    },
    include: TOKEN_INCLUDE,
  });

  return toToken(row);
}

export async function generateAiTokenomicsDraft(tokenId: string): Promise<TrustFunToken> {
  const existing = await loadTokenOrThrow(tokenId);
  const generatedAt = new Date();

  const riskScore = computeRiskScore(
    riskInputFromRow({
      liquidityLocked: existing.liquidityLocked,
      liquidityLockedPercent: existing.liquidityLockedPercent,
      liquidityUnlockDate: existing.liquidityUnlockDate,
      liquidityLockContractUrl: existing.liquidityLockContractUrl,
      tokenomicsDistribution: AI_DRAFT_DISTRIBUTION,
      tokenomicsSource: "ai_assisted",
      tokenomicsSummary: AI_DRAFT_SUMMARY,
      tokenomicsVestingDescription: AI_DRAFT_VESTING,
      tokenomicsComplianceStatus: "pending_review",
      tokenomicsGeneratedAt: generatedAt,
      tokenomicsReviewedAt: null,
      creator: {
        isAnonymous: existing.creator.isAnonymous,
        verified: existing.creator.verified,
        tokensLaunched: existing.creator._count.tokens,
      },
    })
  );

  const row = await prisma.token.update({
    where: { id: tokenId },
    data: {
      tokenomicsSource: "ai_assisted",
      tokenomicsSummary: AI_DRAFT_SUMMARY,
      tokenomicsDistribution: toJson(AI_DRAFT_DISTRIBUTION),
      tokenomicsVestingDescription: AI_DRAFT_VESTING,
      // Hard gate (Blueprint 5.3/5.4): this status can only ever be set to
      // pending_review here. No route in this codebase sets it to
      // "approved" — that transition belongs to a human compliance
      // reviewer + AI Risk Engine, neither of which exist yet.
      tokenomicsComplianceStatus: "pending_review",
      tokenomicsGeneratedAt: generatedAt,
      tokenomicsReviewedAt: null,
      riskScore: riskScore.score,
      riskFactors: toJson(riskScore.factors),
      riskComputedAt: new Date(riskScore.computedAt),
      riskMethodologyVersion: riskScore.methodologyVersion,
    },
    include: TOKEN_INCLUDE,
  });

  return toToken(row);
}

export async function publishToken(tokenId: string): Promise<TrustFunToken> {
  const existing = await loadTokenOrThrow(tokenId);

  // "Complete" means a backer can rely on what's shown: tokenomics must be
  // disclosed AND, if AI-assisted, cleared compliance review.
  const disclosureComplete =
    existing.tokenomicsSummary.length > 0 &&
    existing.tokenomicsComplianceStatus !== "pending_review";

  const row = await prisma.token.update({
    where: { id: tokenId },
    data: { stage: "published", disclosureComplete },
    include: TOKEN_INCLUDE,
  });

  return toToken(row);
}
