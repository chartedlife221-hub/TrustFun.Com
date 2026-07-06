import PageLayout from "../components/layout/PageLayout";
import Alert from "../components/ui/Alert";
import styles from "./LegalPage.module.css";

export default function TrustSafetyPage() {
  return (
    <PageLayout>
      <div className="container">
        <div className={styles.wrap}>
          <h1>Trust &amp; Safety</h1>
          <p className={styles.updated}>Last reviewed: draft, not yet legal-reviewed.</p>

          <Alert tone="caution" title="This page is not legal advice">
            The jurisdiction, securities, and liability language below is a placeholder
            describing intent, not a legal conclusion. Per Blueprint 1.4, real launch
            jurisdictions require sign-off from qualified legal counsel before this page (or any
            user-facing AI/blockchain feature) can be treated as authoritative.
          </Alert>

          <h2>What TrustFun actually does</h2>
          <p>
            TrustFun standardizes disclosure for community tokens: who created a token, when,
            with what allocation, and whether liquidity is locked. We compute a baseline,
            rules-based risk score from that disclosed data. None of this eliminates risk — it
            makes the risk that already exists visible before you decide.
          </p>

          <h2>Anti-rug mechanisms — and their limits</h2>
          <ul>
            <li>
              <strong>Liquidity lock disclosure.</strong> We show whether liquidity is locked,
              what percentage, and until when. We do not currently enforce locking as a
              precondition of launch — an unlocked token can still launch, clearly labeled
              as such.
            </li>
            <li>
              <strong>Vesting disclosure.</strong> Team/insider vesting terms are surfaced on the
              disclosure card when provided. A creator can still decline to disclose vesting;
              that omission itself lowers the token&apos;s baseline risk score.
            </li>
            <li>
              <strong>Creator verification.</strong> Verified badges are granted by TrustFun
              after an identity check — creators cannot self-declare verification. Anonymous
              creators can still launch; anonymity is disclosed, not hidden.
            </li>
            <li>
              <strong>Baseline risk scoring.</strong> Our current risk engine is a deterministic
              rules engine (liquidity lock, allocation concentration, vesting, creator history),
              not a machine-learning fraud model. It will miss novel scam patterns. A high score
              is a signal, not a guarantee.
            </li>
          </ul>

          <h2>What happens when this gets abused</h2>
          <p>
            A creator can disclose accurate-looking data and still rug backers after launch —
            disclosure reduces information asymmetry, it does not enforce good behavior after
            the fact. A well-funded bad actor could pass our baseline checks (lock liquidity
            short-term, disclose a vesting schedule, then abandon the project once the lock
            expires). Our response, in order of what exists today versus what&apos;s planned:
          </p>
          <ul>
            <li>
              <strong>Today:</strong> baseline anomaly detection flags common copy-paste scam
              contracts and rug-pull patterns at launch time; flagged launches are labeled, not
              blocked.
            </li>
            <li>
              <strong>Planned (Blueprint 5.4):</strong> a dedicated AI Risk Engine, which must
              exist and be functional before AI-generated tokenomics or whitepapers (5.3) are
              allowed to publish at all.
            </li>
            <li>
              We do not claim to catch every rug. If you see one, report it — reports feed the
              baseline rules and, later, the AI Risk Engine&apos;s training signal.
            </li>
          </ul>

          <h2>AI-generated content is gated, not automatic</h2>
          <p>
            AI-assisted tokenomics and whitepaper drafts are explicitly labeled
            &quot;pending compliance review&quot; from the moment they&apos;re generated. Nothing
            in TrustFun auto-approves that label to &quot;reviewed&quot; — that transition
            requires a human compliance reviewer, per the platform constitution: no AI-generated
            document resembling investment advice ships without a human + compliance review
            gate.
          </p>

          <h2>KYC / AML posture</h2>
          <p>
            TrustFun does not currently perform KYC/AML verification as a precondition of
            launching a token. Creator &quot;verification&quot; today refers to platform
            identity confirmation, not regulatory KYC/AML clearance. Anonymous creators may
            launch; their anonymity is disclosed as a risk factor in the baseline risk score.
            Whether KYC/AML becomes mandatory in specific jurisdictions is a jurisdiction-by-
            jurisdiction legal question (Blueprint 1.4) that has not yet been answered by
            counsel — treat this section as provisional.
          </p>

          <h2 id="risk-disclosure">Risk disclosure</h2>
          <p>
            Community tokens are speculative and can lose all value. TrustFun is not a broker,
            exchange, custodian, or investment adviser, and nothing on this site is an offer or
            solicitation to buy or sell securities in any jurisdiction where that would be
            unlawful. Whether a specific token issued through TrustFun could be construed as a
            security in a given jurisdiction (for example, under a Howey-type analysis in the
            U.S. or under MiCA in the EU) is a fact-specific legal question we have not resolved
            platform-wide — see Blueprint 1.4.
          </p>

          <h2>Where TrustFun&apos;s responsibility starts and ends</h2>
          <p>
            <strong>We are responsible for:</strong> the accuracy of what we compute and display
            ourselves (baseline risk scores, verification badges) and for the AI-generation gate
            actually blocking unreviewed content from being labeled &quot;reviewed.&quot;
          </p>
          <p>
            <strong>We are not responsible for:</strong> the truthfulness of a creator&apos;s own
            disclosures, a creator&apos;s conduct after launch, or losses from backing a token
            that later turns out to be fraudulent. Standardized disclosure lowers information
            asymmetry; it does not make TrustFun a guarantor of any listed project. This
            boundary itself is a policy choice, not a settled legal conclusion — it should be
            reviewed by counsel alongside the jurisdiction analysis before launch.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
