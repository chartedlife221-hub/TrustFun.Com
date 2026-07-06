import type {
  Creator as PrismaCreator,
  DiscussionPost as PrismaDiscussionPost,
  GovernanceProposal as PrismaGovernanceProposal,
  Prisma,
  Token as PrismaToken,
} from "@prisma/client";
import type {
  Creator,
  DiscussionPost,
  DistributionSlice,
  GovernanceProposal,
  RiskFactor,
  TrustFunToken,
} from "@trustfun/shared/types";

export type TokenWithCreator = PrismaToken & {
  creator: PrismaCreator & { _count: { tokens: number } };
};

export function toCreator(row: PrismaCreator & { _count: { tokens: number } }): Creator {
  return {
    id: row.id,
    displayName: row.displayName,
    walletAddress: row.walletAddress,
    verified: row.verified,
    isAnonymous: row.isAnonymous,
    tokensLaunched: row._count.tokens,
    createdAt: row.createdAt.toISOString(),
  };
}

export function toToken(row: TokenWithCreator): TrustFunToken {
  return {
    id: row.id,
    name: row.name,
    symbol: row.symbol,
    description: row.description,
    chain: "solana",
    createdAt: row.createdAt.toISOString(),
    creator: toCreator(row.creator),
    stage: row.stage,
    // Safe: totalSupply is bounded well under Number.MAX_SAFE_INTEGER for
    // every realistic token supply; Prisma returns BigInt for this column
    // because Postgres INTEGER can't hold e.g. 100_000_000_000.
    totalSupply: Number(row.totalSupply),
    disclosureComplete: row.disclosureComplete,
    liquidityLock: {
      locked: row.liquidityLocked,
      lockedPercent: row.liquidityLockedPercent,
      unlockDate: row.liquidityUnlockDate ? row.liquidityUnlockDate.toISOString() : null,
      lockContractUrl: row.liquidityLockContractUrl,
    },
    tokenomics: {
      source: row.tokenomicsSource,
      summary: row.tokenomicsSummary,
      distribution: row.tokenomicsDistribution as unknown as DistributionSlice[],
      vestingDescription: row.tokenomicsVestingDescription,
      complianceStatus: row.tokenomicsComplianceStatus,
      generatedAt: row.tokenomicsGeneratedAt ? row.tokenomicsGeneratedAt.toISOString() : null,
      reviewedAt: row.tokenomicsReviewedAt ? row.tokenomicsReviewedAt.toISOString() : null,
    },
    riskScore: {
      score: row.riskScore,
      factors: row.riskFactors as unknown as RiskFactor[],
      computedAt: row.riskComputedAt.toISOString(),
      methodologyVersion: row.riskMethodologyVersion,
    },
  };
}

export function toProposal(row: PrismaGovernanceProposal): GovernanceProposal {
  return {
    id: row.id,
    tokenId: row.tokenId,
    title: row.title,
    description: row.description,
    status: row.status,
    votesFor: row.votesFor,
    votesAgainst: row.votesAgainst,
    createdAt: row.createdAt.toISOString(),
  };
}

export function toDiscussionPost(row: PrismaDiscussionPost): DiscussionPost {
  return {
    id: row.id,
    tokenId: row.tokenId,
    author: row.author,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
  };
}

export const CREATOR_INCLUDE = {
  _count: { select: { tokens: true } },
} satisfies Prisma.CreatorInclude;

export const TOKEN_INCLUDE = {
  creator: { include: CREATOR_INCLUDE },
} satisfies Prisma.TokenInclude;
