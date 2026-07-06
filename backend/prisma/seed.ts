// Seeds the same 3 fixture tokens the frontend's in-memory mock used this
// session (frontend/src/data/mockData.ts, now deleted), so local dev/demo
// continuity isn't lost when swapping to real persistence. Risk scores are
// computed here via the same shared risk engine the backend uses at
// runtime — seed data and live data go through one scoring path.
import { computeRiskScore } from "@trustfun/shared/risk-engine";
import type { DistributionSlice } from "@trustfun/shared/types";
import { PrismaClient } from "@prisma/client";
import { toJson } from "../src/utils/prismaJson";

const prisma = new PrismaClient();

interface SeedToken {
  id: string;
  name: string;
  symbol: string;
  description: string;
  createdAt: string;
  totalSupply: bigint;
  creator: {
    id: string;
    displayName: string;
    walletAddress: string;
    verified: boolean;
    isAnonymous: boolean;
  };
  liquidityLocked: boolean;
  liquidityLockedPercent: number | null;
  liquidityUnlockDate: string | null;
  liquidityLockContractUrl: string | null;
  tokenomicsSource: "creator_authored" | "ai_assisted";
  tokenomicsSummary: string;
  tokenomicsDistribution: DistributionSlice[];
  tokenomicsVestingDescription: string | null;
  tokenomicsComplianceStatus: "not_applicable" | "pending_review" | "approved" | "rejected";
  tokenomicsGeneratedAt: string | null;
  tokenomicsReviewedAt: string | null;
}

const seedTokens: SeedToken[] = [
  {
    id: "tok-solpup",
    name: "Solana Puppy",
    symbol: "SPUP",
    description:
      "A community-first dog-themed token on Solana with a locked liquidity pool and quarterly treasury reports.",
    createdAt: "2026-06-01T00:00:00Z",
    totalSupply: 1_000_000_000n,
    creator: {
      id: "creator-1",
      displayName: "orbit.sol",
      walletAddress: "7xKX...9pQ2",
      verified: true,
      isAnonymous: false,
    },
    liquidityLocked: true,
    liquidityLockedPercent: 90,
    liquidityUnlockDate: "2027-06-01T00:00:00Z",
    liquidityLockContractUrl: "https://explorer.solana.com/address/lock-spup-example",
    tokenomicsSource: "creator_authored",
    tokenomicsSummary:
      "60% public sale, 20% liquidity, 10% team (12-month cliff, 24-month linear vest), 10% community treasury.",
    tokenomicsDistribution: [
      { label: "Public sale", percent: 60 },
      { label: "Liquidity", percent: 20 },
      { label: "Team", percent: 10 },
      { label: "Community treasury", percent: 10 },
    ],
    tokenomicsVestingDescription: "Team allocation: 12-month cliff, then 24-month linear vest.",
    tokenomicsComplianceStatus: "not_applicable",
    tokenomicsGeneratedAt: null,
    tokenomicsReviewedAt: null,
  },
  {
    id: "tok-moonjuice",
    name: "MoonJuice",
    symbol: "MJU",
    description:
      "High-energy meme token launched anonymously with no locked liquidity yet — early-stage, unverified.",
    createdAt: "2026-07-01T00:00:00Z",
    totalSupply: 100_000_000_000n,
    creator: {
      id: "creator-2",
      displayName: "anon_launcher",
      walletAddress: "3nF8...tR4m",
      verified: false,
      isAnonymous: true,
    },
    liquidityLocked: false,
    liquidityLockedPercent: null,
    liquidityUnlockDate: null,
    liquidityLockContractUrl: null,
    tokenomicsSource: "ai_assisted",
    tokenomicsSummary:
      "AI-drafted allocation: 50% public sale, 15% liquidity, 35% team — pending compliance review, not yet confirmed by a human reviewer.",
    tokenomicsDistribution: [
      { label: "Public sale", percent: 50 },
      { label: "Liquidity", percent: 15 },
      { label: "Team", percent: 35 },
    ],
    tokenomicsVestingDescription: null,
    tokenomicsComplianceStatus: "pending_review",
    tokenomicsGeneratedAt: "2026-07-01T00:00:00Z",
    tokenomicsReviewedAt: null,
  },
  {
    id: "tok-driftcoin",
    name: "Drift Coin",
    symbol: "DRFT",
    description:
      "Governance-focused community token backing an open-source Solana tooling collective.",
    createdAt: "2026-05-10T00:00:00Z",
    totalSupply: 500_000_000n,
    creator: {
      id: "creator-3",
      displayName: "driftlabs",
      walletAddress: "9pLq...2xVz",
      verified: true,
      isAnonymous: false,
    },
    liquidityLocked: true,
    liquidityLockedPercent: 100,
    liquidityUnlockDate: "2028-05-10T00:00:00Z",
    liquidityLockContractUrl: "https://explorer.solana.com/address/lock-drft-example",
    tokenomicsSource: "ai_assisted",
    tokenomicsSummary:
      "70% public sale, 20% liquidity, 10% team (18-month cliff) — AI draft reviewed and approved by compliance on 2026-05-09.",
    tokenomicsDistribution: [
      { label: "Public sale", percent: 70 },
      { label: "Liquidity", percent: 20 },
      { label: "Team", percent: 10 },
    ],
    tokenomicsVestingDescription: "Team allocation: 18-month cliff, no linear vest.",
    tokenomicsComplianceStatus: "approved",
    tokenomicsGeneratedAt: "2026-05-08T00:00:00Z",
    tokenomicsReviewedAt: "2026-05-09T00:00:00Z",
  },
];

const seedProposals = [
  {
    id: "prop-1",
    tokenId: "tok-solpup",
    title: "Allocate 5% of treasury to a community marketing pool",
    description:
      "Proposal to move 5% of the community treasury into a dedicated, multisig-controlled marketing pool with quarterly spend reports.",
    status: "open" as const,
    votesFor: 128,
    votesAgainst: 14,
    createdAt: "2026-06-20T00:00:00Z",
  },
  {
    id: "prop-2",
    tokenId: "tok-driftcoin",
    title: "Extend liquidity lock by 12 months",
    description:
      "Proposal to voluntarily extend the existing liquidity lock from May 2028 to May 2029 to reinforce long-term commitment.",
    status: "open" as const,
    votesFor: 342,
    votesAgainst: 9,
    createdAt: "2026-06-28T00:00:00Z",
  },
];

const seedDiscussion = [
  {
    id: "post-1",
    tokenId: "tok-solpup",
    author: "0xLumen",
    body: "Appreciate the quarterly treasury reports — more launches should do this.",
    createdAt: "2026-06-15T00:00:00Z",
  },
  {
    id: "post-2",
    tokenId: "tok-solpup",
    author: "sat_stacker",
    body: "Voted yes on the marketing pool proposal, multisig requirement is the right call.",
    createdAt: "2026-06-21T00:00:00Z",
  },
];

async function main() {
  for (const t of seedTokens) {
    const creator = await prisma.creator.upsert({
      where: { id: t.creator.id },
      update: {},
      create: t.creator,
    });

    const risk = computeRiskScore({
      liquidityLock: {
        locked: t.liquidityLocked,
        lockedPercent: t.liquidityLockedPercent,
        unlockDate: t.liquidityUnlockDate,
        lockContractUrl: t.liquidityLockContractUrl,
      },
      tokenomics: {
        source: t.tokenomicsSource,
        summary: t.tokenomicsSummary,
        distribution: t.tokenomicsDistribution,
        vestingDescription: t.tokenomicsVestingDescription,
        complianceStatus: t.tokenomicsComplianceStatus,
        generatedAt: t.tokenomicsGeneratedAt,
        reviewedAt: t.tokenomicsReviewedAt,
      },
      distribution: t.tokenomicsDistribution,
      creatorIsAnonymous: creator.isAnonymous,
      creatorVerified: creator.verified,
      creatorTokensLaunched: 0,
    });

    const disclosureComplete =
      t.tokenomicsSummary.length > 0 && t.tokenomicsComplianceStatus !== "pending_review";

    await prisma.token.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        name: t.name,
        symbol: t.symbol,
        description: t.description,
        createdAt: new Date(t.createdAt),
        creatorId: creator.id,
        stage: "published",
        totalSupply: t.totalSupply,
        disclosureComplete,
        liquidityLocked: t.liquidityLocked,
        liquidityLockedPercent: t.liquidityLockedPercent,
        liquidityUnlockDate: t.liquidityUnlockDate ? new Date(t.liquidityUnlockDate) : null,
        liquidityLockContractUrl: t.liquidityLockContractUrl,
        tokenomicsSource: t.tokenomicsSource,
        tokenomicsSummary: t.tokenomicsSummary,
        tokenomicsDistribution: toJson(t.tokenomicsDistribution),
        tokenomicsVestingDescription: t.tokenomicsVestingDescription,
        tokenomicsComplianceStatus: t.tokenomicsComplianceStatus,
        tokenomicsGeneratedAt: t.tokenomicsGeneratedAt ? new Date(t.tokenomicsGeneratedAt) : null,
        tokenomicsReviewedAt: t.tokenomicsReviewedAt ? new Date(t.tokenomicsReviewedAt) : null,
        riskScore: risk.score,
        riskFactors: toJson(risk.factors),
        riskComputedAt: new Date(risk.computedAt),
        riskMethodologyVersion: risk.methodologyVersion,
      },
    });
  }

  for (const p of seedProposals) {
    await prisma.governanceProposal.upsert({
      where: { id: p.id },
      update: {},
      create: { ...p, createdAt: new Date(p.createdAt) },
    });
  }

  for (const d of seedDiscussion) {
    await prisma.discussionPost.upsert({
      where: { id: d.id },
      update: {},
      create: { ...d, createdAt: new Date(d.createdAt) },
    });
  }

  console.log(`Seeded ${seedTokens.length} tokens, ${seedProposals.length} proposals, ${seedDiscussion.length} discussion posts.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
