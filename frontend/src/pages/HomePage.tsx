import { Link } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import styles from "./HomePage.module.css";

const FEATURES = [
  {
    icon: "🔒",
    title: "Liquidity locks by default",
    body: "Locks are surfaced on every disclosure card — locked, partial, or none — never buried in a whitepaper.",
  },
  {
    icon: "🛡️",
    title: "Baseline risk signals",
    body: "Every token gets a transparent, rules-based risk score: liquidity lock status, allocation concentration, vesting, creator history.",
  },
  {
    icon: "✅",
    title: "Creator verification",
    body: "Know who created a token, when, and with what distribution — anonymity is disclosed, not hidden.",
  },
  {
    icon: "🤖",
    title: "Gated AI assistance",
    body: "AI-drafted tokenomics and whitepapers are clearly labeled pending review until a human compliance reviewer signs off.",
  },
];

const STEPS = [
  { title: "Connect a wallet", body: "Link your Solana wallet to start a launch or back a project." },
  { title: "Create or discover", body: "Launch a token with disclosed tokenomics, or browse live launches by risk signal." },
  { title: "Read the disclosure card", body: "Every token ships a standardized card: creator, supply, lock status, tokenomics, risk score." },
  { title: "Decide with the full picture", body: "Back, discuss, or vote on governance proposals — the information is the product." },
];

export default function HomePage() {
  return (
    <PageLayout>
      <section className={styles.hero}>
        <div className="container">
          <span className={styles.eyebrow}>The trust layer for token launches</span>
          <h1 className={styles.heroTitle}>Know what you&apos;re backing.</h1>
          <p className={styles.heroSub}>
            TrustFun is an AI-assisted platform for launching and discovering community-driven
            crypto projects on Solana — where the transparent path is the default, not an
            opt-in badge.
          </p>
          <div className={styles.heroActions}>
            <Link to="/launch">
              <Button variant="primary">Launch a token</Button>
            </Link>
            <Link to="/explore">
              <Button variant="secondary">Explore tokens</Button>
            </Link>
          </div>
        </div>
      </section>

      <div className={styles.metricBand}>
        <div className="container" style={{ textAlign: "center" }}>
          <p style={{ margin: 0, color: "var(--text-secondary)" }}>
            North Star metric: the <strong style={{ color: "var(--text-primary)" }}>% of launched
            tokens with complete, accurate, unedited-post-launch disclosure data</strong> — not
            volume, not TVL.
          </p>
        </div>
      </div>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2>Why TrustFun</h2>
            <p>
              Most launch platforms optimize for speed-to-launch. We optimize for backers being
              able to answer one question before they decide: what, exactly, am I backing?
            </p>
          </div>
          <div className={styles.grid4}>
            {FEATURES.map((f) => (
              <Card key={f.title}>
                <div style={{ fontSize: "1.5rem", marginBottom: "var(--sp-3)" }} aria-hidden="true">
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "var(--fs-base)" }}>{f.title}</h3>
                <p style={{ marginBottom: 0, fontSize: "var(--fs-sm)" }}>{f.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} style={{ paddingTop: 0 }}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2>How it works</h2>
          </div>
          <div className={styles.grid4}>
            {STEPS.map((s, i) => (
              <div key={s.title}>
                <div className={styles.stepNum} aria-hidden="true">
                  {i + 1}
                </div>
                <h3 style={{ fontSize: "var(--fs-base)" }}>{s.title}</h3>
                <p style={{ fontSize: "var(--fs-sm)" }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} style={{ paddingTop: 0 }}>
        <div className="container">
          <Card style={{ textAlign: "center", padding: "var(--sp-7)" }}>
            <h2 style={{ marginBottom: "var(--sp-3)" }}>Community tokens carry real risk.</h2>
            <p style={{ maxWidth: "60ch", margin: "0 auto var(--sp-5)" }}>
              TrustFun surfaces risk signals and disclosure — it does not eliminate the
              possibility of loss, and nothing on this site is investment, legal, or tax advice.
              Read our{" "}
              <Link to="/trust-safety">Trust &amp; Safety page</Link> before backing any token.
            </p>
            <Link to="/trust-safety">
              <Button variant="secondary">Read Trust &amp; Safety</Button>
            </Link>
          </Card>
        </div>
      </section>
    </PageLayout>
  );
}
