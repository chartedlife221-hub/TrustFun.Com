// Service layer — the seam where a real backend replaces mock data.
// Decision: for this MVP pass the app runs against in-memory mock data
// (below) rather than the backend/ Express scaffold, because a real
// implementation needs a persistence layer and auth that Blueprint Part 6
// scopes as its own NOW-tier of work, not something to improvise here.
// Swapping this file's internals for `fetch("/api/...")` calls should not
// require any page/component changes, since callers only depend on the
// function signatures and types below.

import { mockDiscussion, mockProposals, mockTokens } from "../data/mockData";
import type {
  Creator,
  DiscussionPost,
  DistributionSlice,
  GovernanceProposal,
  Tokenomics,
  TrustFunToken,
} from "../types/token";
import { computeRiskScore } from "../utils/riskEngine";

const LATENCY_MS = 350;

function delay<T>(value: T, ms = LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// Mutable in-memory store standing in for a database.
let tokens: TrustFunToken[] = [...mockTokens];
let proposals: GovernanceProposal[] = [...mockProposals];
let discussion: DiscussionPost[] = [...mockDiscussion];

export async function listTokens(): Promise<TrustFunToken[]> {
  return delay(tokens.filter((t) => t.stage === "published"));
}

export async function getToken(id: string): Promise<TrustFunToken | undefined> {
  return delay(tokens.find((t) => t.id === id));
}

export interface CreateTokenDraftInput {
  name: string;
  symbol: string;
  description: string;
  totalSupply: number;
  creator: Creator;
}

export async function createTokenDraft(
  input: CreateTokenDraftInput
): Promise<TrustFunToken> {
  const emptyTokenomics: Tokenomics = {
    source: "creator_authored",
    summary: "",
    distribution: [],
    vestingDescription: null,
    complianceStatus: "not_applicable",
    generatedAt: null,
    reviewedAt: null,
  };

  const draft: TrustFunToken = {
    id: `tok-draft-${Date.now()}`,
    name: input.name,
    symbol: input.symbol,
    description: input.description,
    chain: "solana",
    createdAt: new Date().toISOString(),
    creator: input.creator,
    stage: "draft",
    totalSupply: input.totalSupply,
    liquidityLock: {
      locked: false,
      lockedPercent: null,
      unlockDate: null,
      lockContractUrl: null,
    },
    tokenomics: emptyTokenomics,
    riskScore: computeRiskScore({
      liquidityLock: { locked: false, lockedPercent: null, unlockDate: null, lockContractUrl: null },
      tokenomics: emptyTokenomics,
      distribution: [],
      creatorIsAnonymous: input.creator.isAnonymous,
      creatorVerified: input.creator.verified,
      creatorTokensLaunched: input.creator.tokensLaunched,
    }),
    disclosureComplete: false,
  };

  tokens = [...tokens, draft];
  return delay(draft);
}

export interface ManualTokenomicsInput {
  distribution: DistributionSlice[];
  vestingDescription: string | null;
  summary: string;
}

/**
 * Creator-authored tokenomics ship immediately (no AI-generation gate
 * applies per Blueprint 5.3 — the gate is specifically for AI-generated
 * content, not creator disclosures).
 */
export async function setManualTokenomics(
  tokenId: string,
  input: ManualTokenomicsInput
): Promise<TrustFunToken> {
  const token = tokens.find((t) => t.id === tokenId);
  if (!token) throw new Error(`Token ${tokenId} not found`);

  token.tokenomics = {
    source: "creator_authored",
    summary: input.summary,
    distribution: input.distribution,
    vestingDescription: input.vestingDescription,
    complianceStatus: "not_applicable",
    generatedAt: null,
    reviewedAt: null,
  };
  token.riskScore = computeRiskScore({
    liquidityLock: token.liquidityLock,
    tokenomics: token.tokenomics,
    distribution: token.tokenomics.distribution,
    creatorIsAnonymous: token.creator.isAnonymous,
    creatorVerified: token.creator.verified,
    creatorTokensLaunched: token.creator.tokensLaunched,
  });

  return delay(token);
}

/**
 * AI-assisted draft — hard-gated per Blueprint 5.3/5.4. This always lands in
 * `pending_review`; nothing in this codebase auto-approves it. There is
 * deliberately no client-side path to `approved` — that transition belongs
 * to a real AI Risk Engine + human compliance reviewer, neither of which
 * exist yet (see CHANGELOG note in LaunchPage).
 */
export async function generateAiTokenomicsDraft(
  tokenId: string
): Promise<TrustFunToken> {
  const token = tokens.find((t) => t.id === tokenId);
  if (!token) throw new Error(`Token ${tokenId} not found`);

  const draftDistribution: DistributionSlice[] = [
    { label: "Public sale", percent: 55 },
    { label: "Liquidity", percent: 20 },
    { label: "Team", percent: 15 },
    { label: "Community treasury", percent: 10 },
  ];

  token.tokenomics = {
    source: "ai_assisted",
    summary:
      "AI-drafted starting point: 55% public sale, 20% liquidity, 15% team, 10% community treasury. Edit before submitting — this has not been reviewed.",
    distribution: draftDistribution,
    vestingDescription: "Suggested: 12-month cliff, 24-month linear vest for team allocation.",
    complianceStatus: "pending_review",
    generatedAt: new Date().toISOString(),
    reviewedAt: null,
  };
  token.riskScore = computeRiskScore({
    liquidityLock: token.liquidityLock,
    tokenomics: token.tokenomics,
    distribution: token.tokenomics.distribution,
    creatorIsAnonymous: token.creator.isAnonymous,
    creatorVerified: token.creator.verified,
    creatorTokensLaunched: token.creator.tokensLaunched,
  });

  return delay(token, 900); // slightly longer, simulates generation time
}

export async function publishToken(tokenId: string): Promise<TrustFunToken> {
  const token = tokens.find((t) => t.id === tokenId);
  if (!token) throw new Error(`Token ${tokenId} not found`);
  token.stage = "published";
  // "Complete" means a backer can actually rely on what's shown: tokenomics
  // must be disclosed AND, if AI-assisted, cleared compliance review. A
  // pending-review draft is real disclosure of intent to disclose, not a
  // completed disclosure — see Blueprint 5.3.
  token.disclosureComplete =
    token.tokenomics.summary.length > 0 &&
    token.tokenomics.complianceStatus !== "pending_review";
  return delay(token);
}

export async function listProposals(tokenId: string): Promise<GovernanceProposal[]> {
  return delay(proposals.filter((p) => p.tokenId === tokenId));
}

export async function voteOnProposal(
  proposalId: string,
  direction: "for" | "against"
): Promise<GovernanceProposal> {
  const proposal = proposals.find((p) => p.id === proposalId);
  if (!proposal) throw new Error(`Proposal ${proposalId} not found`);
  if (direction === "for") proposal.votesFor += 1;
  else proposal.votesAgainst += 1;
  return delay(proposal);
}

export async function listDiscussion(tokenId: string): Promise<DiscussionPost[]> {
  return delay(discussion.filter((d) => d.tokenId === tokenId));
}

export async function postDiscussion(
  tokenId: string,
  author: string,
  body: string
): Promise<DiscussionPost> {
  const post: DiscussionPost = {
    id: `post-${Date.now()}`,
    tokenId,
    author,
    body,
    createdAt: new Date().toISOString(),
  };
  discussion = [...discussion, post];
  return delay(post);
}
