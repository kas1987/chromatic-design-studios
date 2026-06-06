import * as React from "react";

/**
 * Chromatic Button — token-driven primitive. All visual values map to
 * Chromatic tokens via Tailwind classes (Design Law #1). Shared by the Hero
 * CTAs and the studio surfaces.
 */
export type ButtonVariant = "primary" | "ghost" | "secondary";
export type ButtonSize = "sm" | "md" | "lg";

// Anchor-only attributes that are meaningful for the `href` (<a>) branch and
// have no equivalent on <button>. Surfaced on ButtonProps so TS callers can type
// linked CTAs (external/downloadable links) with the same props the runtime
// already spreads onto the anchor. `type` is deliberately excluded — it would
// collide with ButtonHTMLAttributes' button `type` ("button"/"submit"/"reset").
type LinkedButtonAttributes = Pick<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "target" | "rel" | "download" | "referrerPolicy" | "hrefLang" | "ping" | "media"
>;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    LinkedButtonAttributes {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Render as an <a> when set (keeps the same visual treatment). */
  href?: string;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-600 text-text-onprimary hover:bg-primary-500 hover:shadow-glow-hover hover:-translate-y-px",
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
  "disabled:opacity-50 disabled:pointer-events-none " +
  // Anchors ignore the `disabled` attribute, so mirror the dimmed/non-interactive
  // treatment via aria-disabled for the linked-and-disabled branch below.
  "aria-disabled:opacity-50 aria-disabled:pointer-events-none";

export function Button({
  variant = "primary",
  size = "md",
  href,
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const cls = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`.trim();
  if (href) {
    // Anchors don't honor the `disabled` attribute or Tailwind's `disabled:*`
    // variants, so a disabled linked CTA must drop its href, suppress its click
    // handler, leave the tab order, and expose aria-disabled for assistive tech.
    if (disabled) {
      const { onClick: _onClick, ...anchorRest } =
        rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
      return (
        <a
          className={cls}
          role="link"
          aria-disabled="true"
          tabIndex={-1}
          {...anchorRest}
        >
          {children}
        </a>
      );
    }
    // Forward the remaining props (onClick, aria-*, data-*, …) to the anchor so
    // linked CTAs keep their handlers, not just the button branch.
    return (
      <a
        href={href}
        className={cls}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }
  return (
    <button className={cls} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}

export default Button;
