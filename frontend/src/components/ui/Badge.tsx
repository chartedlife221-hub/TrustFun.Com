import { ReactNode } from "react";
import styles from "./Badge.module.css";

type Tone = "neutral" | "success" | "caution" | "danger" | "info";

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
  withDot?: boolean;
}

export default function Badge({ tone = "neutral", children, withDot }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[tone]}`}>
      {withDot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  );
}
