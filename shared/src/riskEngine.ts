// Baseline rules-based risk scoring — Blueprint 4.4 "baseline anomaly detection
// required at launch." This is NOT the AI Risk Engine (5.4); it is the
// MVP-tier deterministic placeholder that 5.4 is required to supersede before
// any AI-generated tokenomics/whitepaper (5.3) can be gated by it.
// Innovation tier: MVP (this file) / Research (ML-based scam detection, later).

import type {
  DistributionSlice,
  LiquidityLock,
  RiskFactor,
  RiskScore,
  Tokenomics,
} from "./types/token";

const METHODOLOGY_VERSION = "baseline-rules-v0.1";

export interface RiskInput {
  liquidityLock: LiquidityLock;
  tokenomics: Tokenomics;
  distribution: DistributionSlice[];
  creatorIsAnonymous: boolean;
  creatorVerified: boolean;
  creatorTokensLaunched: number;
}

export function computeRiskScore(input: RiskInput): RiskScore {
  const factors: RiskFactor[] = [];
  let score = 100;

  if (!input.liquidityLock.locked) {
    score -= 30;
    factors.push({
      id: "no-liquidity-lock",
      label: "No liquidity lock",
      severity: "high",
      detail:
        "Creator has not locked liquidity. This is one of the most common rug-pull mechanics.",
    });
  } else if ((input.liquidityLock.lockedPercent ?? 0) < 50) {
    score -= 10;
    factors.push({
      id: "partial-liquidity-lock",
      label: "Partial liquidity lock",
      severity: "caution",
      detail: `Only ${input.liquidityLock.lockedPercent}% of liquidity is locked.`,
    });
  }

  const teamSlice = input.distribution.find((d) =>
    /team|creator|founder/i.test(d.label)
  );
  if (teamSlice && teamSlice.percent > 30) {
    score -= 20;
    factors.push({
      id: "high-team-allocation",
      label: "High team/creator allocation",
      severity: "high",
      detail: `${teamSlice.percent}% of supply is allocated to the team/creator, well above the ~10-20% norm.`,
    });
  } else if (teamSlice && teamSlice.percent > 15) {
    score -= 8;
    factors.push({
      id: "elevated-team-allocation",
      label: "Elevated team/creator allocation",
      severity: "caution",
      detail: `${teamSlice.percent}% of supply is allocated to the team/creator.`,
    });
  }

  if (!input.tokenomics.vestingDescription) {
    score -= 10;
    factors.push({
      id: "no-vesting",
      label: "No vesting schedule disclosed",
      severity: "caution",
      detail:
        "No vesting/cliff schedule was disclosed for team or insider allocations.",
    });
  }

  if (input.creatorIsAnonymous && !input.creatorVerified) {
    score -= 15;
    factors.push({
      id: "anonymous-unverified-creator",
      label: "Anonymous, unverified creator",
      severity: "high",
      detail:
        "The creator has not completed identity verification and is publishing anonymously.",
    });
  } else if (input.creatorIsAnonymous) {
    score -= 5;
    factors.push({
      id: "anonymous-verified-creator",
      label: "Anonymous but verified creator",
      severity: "info",
      detail:
        "The creator publishes anonymously but has completed platform identity verification.",
    });
  }

  if (input.creatorTokensLaunched === 0) {
    factors.push({
      id: "first-launch",
      label: "First launch from this creator",
      severity: "info",
      detail: "This creator has no prior launch history on TrustFun.",
    });
  }

  if (input.tokenomics.complianceStatus === "pending_review") {
    score -= 5;
    factors.push({
      id: "tokenomics-pending-review",
      label: "AI-assisted tokenomics pending compliance review",
      severity: "caution",
      detail:
        "This token's tokenomics were AI-drafted and have not yet cleared human compliance review (Blueprint 5.3).",
    });
  }

  score = Math.max(0, Math.min(100, score));

  return {
    score,
    factors,
    computedAt: new Date().toISOString(),
    methodologyVersion: METHODOLOGY_VERSION,
  };
}
