import * as React from "react";

/**
 * Chromatic Badge — token-driven pill label. Uses the label type token and
 * semantic colors; tones map to surface/semantic tokens (Design Law #1).
 */
export type BadgeTone =
  | "default"
  | "primary"
  | "accent"
  | "success"
  | "warning"
  | "error";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const TONES: Record<BadgeTone, string> = {
  default: "border-border-default bg-surface-default text-text-secondary",
  primary: "border-primary-700 bg-surface-default text-primary-300",
  accent: "border-accent-700 bg-surface-default text-accent-300",
  success: "border-semantic-success bg-surface-default text-semantic-success",
  warning: "border-semantic-warning bg-surface-default text-semantic-warning",
  error: "border-semantic-error bg-surface-default text-semantic-error",
};

export function Badge({
  tone = "default",
  className = "",
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-label uppercase tracking-wide ${TONES[tone]} ${className}`.trim()}
      {...rest}
    >
      {children}
    </span>
  );
}

export default Badge;
