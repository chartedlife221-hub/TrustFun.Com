import PageLayout from "../components/layout/PageLayout";
import styles from "./LegalPage.module.css";

export default function AboutPage() {
  return (
    <PageLayout>
      <div className="container">
        <div className={styles.wrap}>
          <h1>About TrustFun</h1>

          <h2>Mission</h2>
          <p>
            Reduce the information and trust gap between creators and backers in the
            memecoin/community-token space using AI-assisted transparency tools.
          </p>

          <h2>Core values</h2>
          <ul>
            <li>Trust is a product feature, not a marketing word.</li>
            <li>Simplicity beats cleverness.</li>
            <li>Security and compliance are inputs to design, not audits after the fact.</li>
            <li>AI assists judgment; it does not replace disclosure obligations.</li>
          </ul>

          <h2>Brand promise</h2>
          <p>&quot;Know what you&apos;re backing.&quot;</p>

          <h2>How we measure ourselves</h2>
          <p>
            Our North Star metric is the percentage of launched tokens with complete, accurate,
            unedited-post-launch disclosure data — a proxy for trust, deliberately not volume or
            total value locked.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
