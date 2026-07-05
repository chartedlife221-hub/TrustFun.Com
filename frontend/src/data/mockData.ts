import type { Creator, DiscussionPost, GovernanceProposal, TrustFunToken } from "../types/token";
import { computeRiskScore } from "../utils/riskEngine";

const creators: Creator[] = [
  {
    id: "creator-1",
    displayName: "orbit.sol",
    walletAddress: "7xKX...9pQ2",
    verified: true,
    isAnonymous: false,
    tokensLaunched: 3,
    createdAt: "2026-02-11T00:00:00Z",
  },
  {
    id: "creator-2",
    displayName: "anon_launcher",
    walletAddress: "3nF8...tR4m",
    verified: false,
    isAnonymous: true,
    tokensLaunched: 0,
    createdAt: "2026-06-30T00:00:00Z",
  },
  {
    id: "creator-3",
    displayName: "driftlabs",
    walletAddress: "9pLq...2xVz",
    verified: true,
    isAnonymous: false,
    tokensLaunched: 1,
    createdAt: "2026-05-02T00:00:00Z",
  },
];

function buildToken(
  partial: Pick<
    TrustFunToken,
    "id" | "name" | "symbol" | "description" | "createdAt" | "totalSupply" | "disclosureComplete"
  > & {
    creator: Creator;
    liquidityLock: TrustFunToken["liquidityLock"];
    tokenomics: TrustFunToken["tokenomics"];
  }
): TrustFunToken {
  return {
    ...partial,
    chain: "solana",
    stage: "published",
    riskScore: computeRiskScore({
      liquidityLock: partial.liquidityLock,
      tokenomics: partial.tokenomics,
      distribution: partial.tokenomics.distribution,
      creatorIsAnonymous: partial.creator.isAnonymous,
      creatorVerified: partial.creator.verified,
      creatorTokensLaunched: partial.creator.tokensLaunched,
    }),
  };
}

export const mockTokens: TrustFunToken[] = [
  buildToken({
    id: "tok-solpup",
    name: "Solana Puppy",
    symbol: "SPUP",
    description:
      "A community-first dog-themed token on Solana with a locked liquidity pool and quarterly treasury reports.",
    createdAt: "2026-06-01T00:00:00Z",
    totalSupply: 1_000_000_000,
    disclosureComplete: true,
    creator: creators[0],
    liquidityLock: {
      locked: true,
      lockedPercent: 90,
      unlockDate: "2027-06-01T00:00:00Z",
      lockContractUrl: "https://explorer.solana.com/address/lock-spup-example",
    },
    tokenomics: {
      source: "creator_authored",
      summary:
        "60% public sale, 20% liquidity, 10% team (12-month cliff, 24-month linear vest), 10% community treasury.",
      distribution: [
        { label: "Public sale", percent: 60 },
        { label: "Liquidity", percent: 20 },
        { label: "Team", percent: 10 },
        { label: "Community treasury", percent: 10 },
      ],
      vestingDescription: "Team allocation: 12-month cliff, then 24-month linear vest.",
      complianceStatus: "not_applicable",
      generatedAt: null,
      reviewedAt: null,
    },
  }),
  buildToken({
    id: "tok-moonjuice",
    name: "MoonJuice",
    symbol: "MJU",
    description:
      "High-energy meme token launched anonymously with no locked liquidity yet — early-stage, unverified.",
    createdAt: "2026-07-01T00:00:00Z",
    totalSupply: 100_000_000_000,
    disclosureComplete: false,
    creator: creators[1],
    liquidityLock: {
      locked: false,
      lockedPercent: null,
      unlockDate: null,
      lockContractUrl: null,
    },
    tokenomics: {
      source: "ai_assisted",
      summary:
        "AI-drafted allocation: 50% public sale, 15% liquidity, 35% team — pending compliance review, not yet confirmed by a human reviewer.",
      distribution: [
        { label: "Public sale", percent: 50 },
        { label: "Liquidity", percent: 15 },
        { label: "Team", percent: 35 },
      ],
      vestingDescription: null,
      complianceStatus: "pending_review",
      generatedAt: "2026-07-01T00:00:00Z",
      reviewedAt: null,
    },
  }),
  buildToken({
    id: "tok-driftcoin",
    name: "Drift Coin",
    symbol: "DRFT",
    description:
      "Governance-focused community token backing an open-source Solana tooling collective.",
    createdAt: "2026-05-10T00:00:00Z",
    totalSupply: 500_000_000,
    disclosureComplete: true,
    creator: creators[2],
    liquidityLock: {
      locked: true,
      lockedPercent: 100,
      unlockDate: "2028-05-10T00:00:00Z",
      lockContractUrl: "https://explorer.solana.com/address/lock-drft-example",
    },
    tokenomics: {
      source: "ai_assisted",
      summary:
        "70% public sale, 20% liquidity, 10% team (18-month cliff) — AI draft reviewed and approved by compliance on 2026-05-09.",
      distribution: [
        { label: "Public sale", percent: 70 },
        { label: "Liquidity", percent: 20 },
        { label: "Team", percent: 10 },
      ],
      vestingDescription: "Team allocation: 18-month cliff, no linear vest.",
      complianceStatus: "approved",
      generatedAt: "2026-05-08T00:00:00Z",
      reviewedAt: "2026-05-09T00:00:00Z",
    },
  }),
];

export const mockProposals: GovernanceProposal[] = [
  {
    id: "prop-1",
    tokenId: "tok-solpup",
    title: "Allocate 5% of treasury to a community marketing pool",
    description:
      "Proposal to move 5% of the community treasury into a dedicated, multisig-controlled marketing pool with quarterly spend reports.",
    status: "open",
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
    status: "open",
    votesFor: 342,
    votesAgainst: 9,
    createdAt: "2026-06-28T00:00:00Z",
  },
];

export const mockDiscussion: DiscussionPost[] = [
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
