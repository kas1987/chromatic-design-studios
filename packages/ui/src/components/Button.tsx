import * as React from "react";

/**
 * Chromatic Button — token-driven primitive. All visual values map to
 * Chromatic tokens via Tailwind classes (Design Law #1). Shared by the Hero
 * CTAs and the studio surfaces.
 */
export type ButtonVariant = "primary" | "ghost" | "secondary";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Render as an <a> when set (keeps the same visual treatment). */
  href?: string;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-600 text-text-primary hover:bg-primary-500 hover:shadow-glow-hover hover:-translate-y-px",
  ghost:
    "border border-border-default text-text-secondary hover:bg-surface-default hover:text-text-primary hover:border-primary-700",
  secondary:
    "bg-surface-default text-text-primary border border-border-default hover:bg-surface-hover",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-3 text-base",
  lg: "px-6 py-3.5 text-lg",
};

const BASE =
  "inline-flex items-center justify-center rounded-md font-medium transition duration-fast ease-easeOut " +
  "focus-visible:outline-none focus-visible:shadow-glow-focus " +
  "disabled:opacity-50 disabled:pointer-events-none";

export function Button({
  variant = "primary",
  size = "md",
  href,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const cls = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`.trim();
  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}

export default Button;
