import Badge from "../ui/Badge";
import Card from "../ui/Card";
import Alert from "../ui/Alert";
import RiskScoreMeter from "./RiskScoreMeter";
import type { TrustFunToken } from "../../types/token";
import styles from "./DisclosureCard.module.css";

interface DisclosureCardProps {
  token: TrustFunToken;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatSupply(n: number): string {
  return new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export default function DisclosureCard({ token }: DisclosureCardProps) {
  const { tokenomics, liquidityLock, creator } = token;

  return (
    <Card aria-label={`Disclosure card for ${token.name}`}>
      <div className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <h2 style={{ margin: 0 }}>{token.name}</h2>
            <span className={styles.symbol}>${token.symbol}</span>
          </div>
          <p style={{ margin: "0.4rem 0 0", maxWidth: "56ch" }}>{token.description}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", alignItems: "flex-end" }}>
          {token.disclosureComplete ? (
            <Badge tone="success" withDot>
              Disclosure complete
            </Badge>
          ) : (
            <Badge tone="caution" withDot>
              Disclosure incomplete
            </Badge>
          )}
          <span style={{ fontSize: "var(--fs-xs)", color: "var(--text-muted)" }}>
            Launched {formatDate(token.createdAt)}
          </span>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Creator</div>
        <div className={styles.metaGrid}>
          <div>
            <div className={styles.metaLabel}>Display name</div>
            <div className={styles.metaValue}>{creator.displayName}</div>
          </div>
          <div>
            <div className={styles.metaLabel}>Wallet</div>
            <div className={styles.metaValue} style={{ fontFamily: "var(--font-mono)" }}>
              {creator.walletAddress}
            </div>
          </div>
          <div>
            <div className={styles.metaLabel}>Verification</div>
            <div>
              {creator.verified ? (
                <Badge tone="success">Verified</Badge>
              ) : (
                <Badge tone="caution">Unverified</Badge>
              )}
              {creator.isAnonymous && (
                <span style={{ marginLeft: "0.4rem" }}>
                  <Badge tone="neutral">Anonymous</Badge>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Supply &amp; liquidity</div>
        <div className={styles.metaGrid}>
          <div>
            <div className={styles.metaLabel}>Total supply</div>
            <div className={styles.metaValue}>{formatSupply(token.totalSupply)}</div>
          </div>
          <div>
            <div className={styles.metaLabel}>Liquidity lock</div>
            <div>
              {liquidityLock.locked ? (
                <Badge tone="success">{liquidityLock.lockedPercent}% locked</Badge>
              ) : (
                <Badge tone="danger">Not locked</Badge>
              )}
            </div>
          </div>
          <div>
            <div className={styles.metaLabel}>Unlock date</div>
            <div className={styles.metaValue}>
              {liquidityLock.unlockDate ? formatDate(liquidityLock.unlockDate) : "—"}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Tokenomics</div>

        {tokenomics.source === "ai_assisted" && tokenomics.complianceStatus === "pending_review" && (
          <div style={{ marginBottom: "var(--sp-4)" }}>
            <Alert tone="caution" title="AI-assisted draft — pending compliance review">
              This tokenomics summary was AI-generated and has not yet been reviewed by the AI
              Risk Engine and a human compliance reviewer (Blueprint 5.3/5.4). Treat every
              figure below as unverified until it clears review.
            </Alert>
          </div>
        )}
        {tokenomics.source === "ai_assisted" && tokenomics.complianceStatus === "approved" && (
          <div style={{ marginBottom: "var(--sp-4)" }}>
            <Badge tone="success">AI draft reviewed &amp; approved by compliance</Badge>
          </div>
        )}

        {tokenomics.distribution.length === 0 ? (
          <p style={{ margin: 0 }}>No tokenomics disclosed yet.</p>
        ) : (
          <>
            <p>{tokenomics.summary}</p>
            <div className={styles.distribution}>
              {tokenomics.distribution.map((slice) => (
                <div key={slice.label} className={styles.distRow}>
                  <span>{slice.label}</span>
                  <span style={{ fontWeight: 700 }}>{slice.percent}%</span>
                  <span className={styles.distBarTrack}>
                    <span className={styles.distBarFill} style={{ width: `${slice.percent}%` }} />
                  </span>
                </div>
              ))}
            </div>
            <p style={{ marginTop: "var(--sp-3)", marginBottom: 0, fontSize: "var(--fs-sm)" }}>
              <strong style={{ color: "var(--text-primary)" }}>Vesting: </strong>
              {tokenomics.vestingDescription ?? "Not disclosed."}
            </p>
          </>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Baseline risk signals</div>
        <RiskScoreMeter risk={token.riskScore} />
      </div>
    </Card>
  );
}
