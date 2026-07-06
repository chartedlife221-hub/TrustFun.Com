import PageLayout from "../components/layout/PageLayout";
import Alert from "../components/ui/Alert";
import styles from "./LegalPage.module.css";

export default function PrivacyPage() {
  return (
    <PageLayout>
      <div className="container">
        <div className={styles.wrap}>
          <h1>Privacy Policy</h1>
          <p className={styles.updated}>Draft placeholder — not reviewed by counsel.</p>

          <Alert tone="caution" title="Placeholder content">
            This describes the categories of data this MVP would need to handle, not a
            compliant privacy policy. It needs review against applicable law (e.g. GDPR, CCPA)
            per jurisdiction before launch.
          </Alert>

          <h2>What we collect</h2>
          <ul>
            <li>Wallet addresses used to connect to the platform.</li>
            <li>Creator-provided display names, descriptions, and tokenomics content.</li>
            <li>Discussion posts and governance votes, which are public by design.</li>
            <li>Basic usage analytics (not yet implemented in this build).</li>
          </ul>

          <h2>What we don&apos;t currently collect</h2>
          <p>
            This MVP does not perform KYC/AML identity verification. If that changes for
            specific jurisdictions (see Trust &amp; Safety), this policy will need a
            corresponding update before it&apos;s accurate.
          </p>

          <h2>How disclosure data is used</h2>
          <p>
            Tokenomics, risk scores, and creator verification status are public by design — the
            product&apos;s purpose is transparency. Do not disclose information you don&apos;t
            want to be public.
          </p>

          <h2>Your choices</h2>
          <p>
            Creators may publish anonymously (wallet address remains visible; real identity is
            not linked publicly). This does not exempt content from the AI-generation
            compliance gate described in Trust &amp; Safety.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
