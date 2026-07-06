import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div>
            <div className={styles.brand}>◆ TrustFun</div>
            <p style={{ maxWidth: "32ch", color: "var(--text-muted)", marginBottom: 0 }}>
              Know what you&apos;re backing.
            </p>
          </div>

          <nav aria-label="Product">
            <div className={styles.colTitle}>Product</div>
            <ul className={styles.list}>
              <li>
                <Link to="/explore">Explore tokens</Link>
              </li>
              <li>
                <Link to="/launch">Launch a token</Link>
              </li>
              <li>
                <Link to="/trust-safety">Trust &amp; Safety</Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Company">
            <div className={styles.colTitle}>Company</div>
            <ul className={styles.list}>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Legal">
            <div className={styles.colTitle}>Legal</div>
            <ul className={styles.list}>
              <li>
                <Link to="/terms">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/trust-safety#risk-disclosure">Risk Disclosure</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p className={styles.disclaimer} style={{ marginBottom: 0 }}>
            TrustFun does not provide investment, legal, or tax advice. Community
            tokens carry substantial risk, including total loss. Nothing on this
            site is an offer to sell securities in any jurisdiction where such an
            offer would be unlawful.
          </p>
          <span>&copy; {new Date().getFullYear()} TrustFun</span>
        </div>
      </div>
    </footer>
  );
}
