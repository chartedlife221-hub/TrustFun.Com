import styles from "./StepIndicator.module.css";

interface StepIndicatorProps {
  steps: string[];
  currentIndex: number;
}

export default function StepIndicator({ steps, currentIndex }: StepIndicatorProps) {
  return (
    <ol className={styles.steps} aria-label="Launch progress">
      {steps.map((step, i) => {
        const state = i < currentIndex ? styles.done : i === currentIndex ? styles.current : "";
        return (
          <li key={step} className={`${styles.step} ${state}`} aria-current={i === currentIndex ? "step" : undefined}>
            <span className={styles.circle} aria-hidden="true">
              {i < currentIndex ? "✓" : i + 1}
            </span>
            {step}
          </li>
        );
      })}
    </ol>
  );
}
