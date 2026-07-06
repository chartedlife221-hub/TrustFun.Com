import PageLayout from "../components/layout/PageLayout";
import Alert from "../components/ui/Alert";
import styles from "./LegalPage.module.css";

export default function TermsPage() {
  return (
    <PageLayout>
      <div className="container">
        <div className={styles.wrap}>
          <h1>Terms of Service</h1>
          <p className={styles.updated}>Draft placeholder — not reviewed by counsel.</p>

          <Alert tone="caution" title="Placeholder content">
            This is boilerplate structure for what a real Terms of Service needs to cover, not a
            binding agreement. It must be drafted and reviewed by qualified legal counsel,
            jurisdiction by jurisdiction, before this page governs real users or real funds
            (Blueprint 1.4).
          </Alert>

          <h2>1. What TrustFun is</h2>
          <p>
            TrustFun is a platform for creating standardized disclosure around, and discovering,
            community-driven crypto tokens on Solana. TrustFun is not a broker-dealer, exchange,
            custodian, or investment adviser.
          </p>

          <h2>2. Eligibility</h2>
          <p>
            Use of TrustFun may be restricted in jurisdictions where token issuance or trading
            through a platform like this is unlawful. Geo-fencing rules for such jurisdictions
            are pending the legal analysis described in Blueprint 1.4 and are not yet final.
          </p>

          <h2>3. Creator obligations</h2>
          <p>
            Creators are responsible for the accuracy of all information they disclose,
            including tokenomics, whitepapers, and identity/anonymity status. AI-assisted
            drafts do not shift that responsibility to TrustFun.
          </p>

          <h2>4. No investment advice</h2>
          <p>
            Nothing on TrustFun — including AI-generated content, risk scores, or disclosure
            cards — constitutes investment, legal, or tax advice, or a recommendation to buy or
            sell any token.
          </p>

          <h2>5. Assumption of risk</h2>
          <p>
            Backing a community token carries risk of total loss, including from fraud,
            volatility, smart contract failure, or abandonment by a creator. See our{" "}
            <a href="/trust-safety">Trust &amp; Safety</a> page.
          </p>

          <h2>6. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, TrustFun&apos;s liability is limited as
            described in Trust &amp; Safety. This section requires jurisdiction-specific legal
            drafting and is not enforceable as written here.
          </p>

          <h2>7. Changes</h2>
          <p>We may update these terms as the platform and its legal review evolve.</p>
        </div>
      </div>
    </PageLayout>
  );
}
