import { ReactNode } from "react";
import styles from "./Alert.module.css";

type Tone = "info" | "caution" | "danger" | "success";

const ICONS: Record<Tone, string> = {
  info: "ℹ",
  caution: "⚠",
  danger: "⛔",
  success: "✓",
};

interface AlertProps {
  tone?: Tone;
  title?: string;
  children: ReactNode;
}

export default function Alert({ tone = "info", title, children }: AlertProps) {
  const role = tone === "danger" || tone === "caution" ? "alert" : "status";
  return (
    <div className={`${styles.alert} ${styles[tone]}`} role={role}>
      <span className={styles.icon} aria-hidden="true">
        {ICONS[tone]}
      </span>
      <div>
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
