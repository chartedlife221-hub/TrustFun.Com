import { ButtonHTMLAttributes, forwardRef } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md";
  block?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", block, className, ...rest }, ref) => {
    const classes = [
      styles.btn,
      styles[variant],
      size === "sm" ? styles.sm : "",
      block ? styles.block : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return <button ref={ref} className={classes} {...rest} />;
  }
);

Button.displayName = "Button";
export default Button;
