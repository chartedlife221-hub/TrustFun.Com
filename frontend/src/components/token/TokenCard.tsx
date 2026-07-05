import { Link } from "react-router-dom";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import RiskScoreMeter from "./RiskScoreMeter";
import type { TrustFunToken } from "../../types/token";
import styles from "./TokenCard.module.css";

export default function TokenCard({ token }: { token: TrustFunToken }) {
  return (
    <Link to={`/token/${token.id}`} className={styles.link}>
      <Card interactive>
        <div className={styles.top}>
          <div>
            <h3 className={styles.name}>{token.name}</h3>
            <span className={styles.symbol}>${token.symbol}</span>
          </div>
          {token.disclosureComplete ? (
            <Badge tone="success" withDot>
              Complete
            </Badge>
          ) : (
            <Badge tone="caution" withDot>
              Incomplete
            </Badge>
          )}
        </div>

        <p className={styles.desc}>{token.description}</p>

        <div className={styles.badges}>
          {token.liquidityLock.locked ? (
            <Badge tone="success">Liquidity locked</Badge>
          ) : (
            <Badge tone="danger">No liquidity lock</Badge>
          )}
          {token.creator.verified ? (
            <Badge tone="info">Verified creator</Badge>
          ) : (
            <Badge tone="neutral">Unverified creator</Badge>
          )}
        </div>

        <RiskScoreMeter risk={token.riskScore} showFactors={false} />
      </Card>
    </Link>
  );
}
