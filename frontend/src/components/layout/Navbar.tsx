import { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import Button from "../ui/Button";
import { useWallet } from "../../contexts/WalletContext";

const LINKS = [
  { to: "/explore", label: "Explore" },
  { to: "/launch", label: "Launch" },
  { to: "/trust-safety", label: "Trust & Safety" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const wallet = useWallet();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`;

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <NavLink to="/" className={styles.logo} onClick={() => setOpen(false)}>
          <span className={styles.logoMark}>◆</span> TrustFun
        </NavLink>

        <nav className={styles.desktopNav} aria-label="Primary">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          {wallet.connected ? (
            <Button variant="secondary" size="sm" onClick={wallet.disconnect}>
              <span className={styles.walletAddress}>{wallet.address}</span>
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={wallet.connect}>
              Connect Wallet
            </Button>
          )}

          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        className={`container ${styles.mobileNav} ${open ? styles.open : ""}`}
        aria-label="Primary mobile"
      >
        {LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} className={linkClass} onClick={() => setOpen(false)}>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
