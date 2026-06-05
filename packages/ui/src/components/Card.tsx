import * as React from "react";

/**
 * Chromatic Card — token-driven glassmorphism surface. Uses the elevated
 * surface, default border, and the `glow-card` shadow preset (Design Law #5:
 * glow, don't blur). Composable via optional title/footer or raw children.
 */
export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  /** Small uppercase label above the title. */
  eyebrow?: React.ReactNode;
  footer?: React.ReactNode;
  /** Lift + brighten border on hover (use for clickable cards). */
  interactive?: boolean;
}

export function Card({
  title,
  eyebrow,
  footer,
  interactive = false,
  className = "",
  children,
  ...rest
}: CardProps) {
  const hover = interactive
    ? "transition duration-fast ease-easeOut hover:-translate-y-px hover:border-border-hover hover:shadow-glow-hover cursor-pointer"
    : "";
  return (
    <div
      className={`rounded-lg border border-border-default bg-background-elevated p-5 shadow-glow-card ${hover} ${className}`.trim()}
      {...rest}
    >
      {eyebrow && (
        <div className="mb-2 text-label uppercase tracking-wide text-text-secondary">
          {eyebrow}
        </div>
      )}
      {title && (
        <h3 className="mb-1 font-heading text-lg font-semibold text-text-primary">
          {title}
        </h3>
      )}
      {children && (
        <div className="font-body text-base text-text-secondary">{children}</div>
      )}
      {footer && (
        <div className="mt-4 border-t border-border-default pt-4">{footer}</div>
      )}
    </div>
  );
}

export default Card;
