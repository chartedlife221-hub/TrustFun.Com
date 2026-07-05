// Core domain types for the TrustFun MVP journeys (Blueprint Part 3.2).
// Mirrored in backend/src/types/token.ts — see shared/types/README.md for why
// these aren't a shared package yet.

export type ComplianceStatus =
  | "not_applicable" // creator-authored content, no AI-generation gate applies
  | "pending_review" // AI-generated, awaiting AI Risk Engine + human compliance sign-off (Blueprint 5.3/5.4)
  | "approved"
  | "rejected";

export type TokenomicsSource = "creator_authored" | "ai_assisted";

export interface DistributionSlice {
  label: string; // e.g. "Public sale", "Team", "Liquidity", "Treasury"
  percent: number;
}

export interface Tokenomics {
  source: TokenomicsSource;
  summary: string;
  distribution: DistributionSlice[];
  vestingDescription: string | null;
  complianceStatus: ComplianceStatus;
  generatedAt: string | null;
  reviewedAt: string | null;
}

export interface RiskFactor {
  id: string;
  label: string;
  severity: "info" | "caution" | "high";
  detail: string;
}

export interface RiskScore {
  score: number; // 0-100, higher = lower perceived risk
  factors: RiskFactor[];
  computedAt: string;
  methodologyVersion: string; // baseline rules engine version, see utils/riskEngine.ts
}

export interface Creator {
  id: string;
  displayName: string;
  walletAddress: string;
  verified: boolean;
  isAnonymous: boolean;
  tokensLaunched: number;
  createdAt: string;
}

export type LaunchStage = "draft" | "published";

export interface LiquidityLock {
  locked: boolean;
  lockedPercent: number | null;
  unlockDate: string | null;
  lockContractUrl: string | null;
}

export interface TrustFunToken {
  id: string;
  name: string;
  symbol: string;
  description: string;
  chain: "solana";
  createdAt: string;
  creator: Creator;
  stage: LaunchStage;
  totalSupply: number;
  liquidityLock: LiquidityLock;
  tokenomics: Tokenomics;
  riskScore: RiskScore;
  disclosureComplete: boolean;
}

export interface GovernanceProposal {
  id: string;
  tokenId: string;
  title: string;
  description: string;
  status: "open" | "closed";
  votesFor: number;
  votesAgainst: number;
  createdAt: string;
}

export interface DiscussionPost {
  id: string;
  tokenId: string;
  author: string;
  body: string;
  createdAt: string;
}
