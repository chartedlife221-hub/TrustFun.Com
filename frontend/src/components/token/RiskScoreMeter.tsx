import type { RiskScore } from "../../types/token";
import styles from "./RiskScoreMeter.module.css";

function bandColor(score: number): string {
  if (score >= 75) return "var(--success-500)";
  if (score >= 50) return "var(--caution-500)";
  return "var(--danger-500)";
}

function bandLabel(score: number): string {
  if (score >= 75) return "Lower risk signals";
  if (score >= 50) return "Some risk signals";
  return "Elevated risk signals";
}

const SEVERITY_COLOR: Record<string, string> = {
  info: "var(--info-500)",
  caution: "var(--caution-500)",
  high: "var(--danger-500)",
};

interface RiskScoreMeterProps {
  risk: RiskScore;
  showFactors?: boolean;
}

export default function RiskScoreMeter({ risk, showFactors = true }: RiskScoreMeterProps) {
  const color = bandColor(risk.score);

  return (
    <div>
      <div className={styles.wrap}>
        <div
          className={styles.track}
          role="progressbar"
          aria-label="Baseline risk signal score"
          aria-valuenow={risk.score}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className={styles.fill} style={{ width: `${risk.score}%`, background: color }} />
        </div>
        <span className={styles.scoreLabel} style={{ color }}>
          {risk.score}
        </span>
      </div>
      <p style={{ fontSize: "var(--fs-xs)", color: "var(--text-muted)", margin: "0.4rem 0 0" }}>
        {bandLabel(risk.score)} · baseline rules engine {risk.methodologyVersion} · not a
        guarantee of safety
      </p>

      {showFactors && risk.factors.length > 0 && (
        <ul className={styles.factorList}>
          {risk.factors.map((factor) => (
            <li key={factor.id} className={styles.factor}>
              <span
                className={styles.factorDot}
                style={{ background: SEVERITY_COLOR[factor.severity] }}
                aria-hidden="true"
              />
              <span>
                <strong style={{ color: "var(--text-primary)" }}>{factor.label}.</strong>{" "}
                {factor.detail}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
