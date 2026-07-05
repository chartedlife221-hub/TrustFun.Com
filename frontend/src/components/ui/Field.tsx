import {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  useId,
} from "react";
import styles from "./Field.module.css";

interface FieldShellProps {
  label: string;
  hint?: string;
  error?: string;
  hideLabel?: boolean;
  children: (props: { id: string; describedBy: string | undefined }) => ReactNode;
}

function FieldShell({ label, hint, error, hideLabel, children }: FieldShellProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={styles.field}>
      <label className={hideLabel ? "visually-hidden" : styles.label} htmlFor={id}>
        {label}
      </label>
      {children({ id, describedBy })}
      {hint && !error && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  hideLabel?: boolean;
}

export function TextField({ label, hint, error, hideLabel, className, ...rest }: TextFieldProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} hideLabel={hideLabel}>
      {({ id, describedBy }) => (
        <input
          id={id}
          aria-describedby={describedBy}
          aria-invalid={!!error}
          className={[styles.control, error ? styles.controlError : "", className ?? ""]
            .filter(Boolean)
            .join(" ")}
          {...rest}
        />
      )}
    </FieldShell>
  );
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function TextAreaField({ label, hint, error, className, ...rest }: TextAreaFieldProps) {
  return (
    <FieldShell label={label} hint={hint} error={error}>
      {({ id, describedBy }) => (
        <textarea
          id={id}
          aria-describedby={describedBy}
          aria-invalid={!!error}
          className={[styles.control, error ? styles.controlError : "", className ?? ""]
            .filter(Boolean)
            .join(" ")}
          {...rest}
        />
      )}
    </FieldShell>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function SelectField({ label, hint, error, className, children, ...rest }: SelectFieldProps) {
  return (
    <FieldShell label={label} hint={hint} error={error}>
      {({ id, describedBy }) => (
        <select
          id={id}
          aria-describedby={describedBy}
          aria-invalid={!!error}
          className={[styles.control, error ? styles.controlError : "", className ?? ""]
            .filter(Boolean)
            .join(" ")}
          {...rest}
        >
          {children}
        </select>
      )}
    </FieldShell>
  );
}
