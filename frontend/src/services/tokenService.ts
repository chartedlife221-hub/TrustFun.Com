// Service layer — the seam between the UI and the real backend/.
// The backend is authoritative for anything that touches trust: risk
// scores, compliance status, and creator verification are always computed
// server-side and are never accepted as request input from here.

import type {
  DiscussionPost,
  DistributionSlice,
  GovernanceProposal,
  TrustFunToken,
} from "../types/token";

// Falls back to the relative "/api" path, which Vite's dev proxy rewrites
// (stripping "/api") and forwards to the backend on localhost:3001 —
// same-origin from the browser's perspective, no CORS needed. Setting
// VITE_API_URL points straight at the backend's origin instead (needs
// CORS_ORIGIN configured server-side, see backend/.env.example).
const BASE = import.meta.env.VITE_API_URL ?? "/api";

class ApiError extends Error {}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}) as { error?: string });
    throw new ApiError(body.error ?? `Request failed (${res.status})`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function listTokens(): Promise<TrustFunToken[]> {
  return request<TrustFunToken[]>("/tokens");
}

export async function getToken(id: string): Promise<TrustFunToken | undefined> {
  const res = await fetch(`${BASE}/tokens/${id}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (res.status === 404) return undefined;
  if (!res.ok) {
    const body = await res.json().catch(() => ({}) as { error?: string });
    throw new ApiError(body.error ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<TrustFunToken>;
}

export interface CreateTokenDraftInput {
  name: string;
  symbol: string;
  description: string;
  totalSupply: number;
  creator: {
    displayName: string;
    walletAddress: string;
    isAnonymous: boolean;
  };
}

export async function createTokenDraft(input: CreateTokenDraftInput): Promise<TrustFunToken> {
  return request<TrustFunToken>("/tokens", {
    method: "POST",
    body: JSON.stringify(input),
  });
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
  return request<TrustFunToken>(`/tokens/${tokenId}/tokenomics/manual`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

/**
 * AI-assisted draft — hard-gated per Blueprint 5.3/5.4. This always lands in
 * `pending_review`; there is no route that flips it to `approved` — that
 * transition belongs to a real AI Risk Engine + human compliance reviewer,
 * neither of which exist yet.
 */
export async function generateAiTokenomicsDraft(tokenId: string): Promise<TrustFunToken> {
  return request<TrustFunToken>(`/tokens/${tokenId}/tokenomics/ai-draft`, {
    method: "POST",
  });
}

export async function publishToken(tokenId: string): Promise<TrustFunToken> {
  return request<TrustFunToken>(`/tokens/${tokenId}/publish`, { method: "POST" });
}

export async function listProposals(tokenId: string): Promise<GovernanceProposal[]> {
  return request<GovernanceProposal[]>(`/tokens/${tokenId}/proposals`);
}

export async function voteOnProposal(
  proposalId: string,
  direction: "for" | "against"
): Promise<GovernanceProposal> {
  return request<GovernanceProposal>(`/proposals/${proposalId}/vote`, {
    method: "POST",
    body: JSON.stringify({ direction }),
  });
}

export async function listDiscussion(tokenId: string): Promise<DiscussionPost[]> {
  return request<DiscussionPost[]>(`/tokens/${tokenId}/discussion`);
}

export async function postDiscussion(
  tokenId: string,
  author: string,
  body: string
): Promise<DiscussionPost> {
  return request<DiscussionPost>(`/tokens/${tokenId}/discussion`, {
    method: "POST",
    body: JSON.stringify({ author, body }),
  });
}
