import * as React from "react";

/**
 * Chromatic Avatar — identity mark with image, initials fallback, and size variants.
 */

export interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  tone?: "primary" | "accent" | "success" | "warning" | "error";
}

const SIZE: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

const TONE_BG: Record<NonNullable<AvatarProps["tone"]>, string> = {
  primary: "bg-primary-600 text-text-onprimary",
  accent: "bg-accent-500 text-background-default",
  success: "bg-success text-background-default",
  warning: "bg-warning text-background-default",
  error: "bg-error text-text-onprimary",
};

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({ src, name, size = "md", tone = "primary" }: AvatarProps) {
  const [errored, setErrored] = React.useState(false);
  const showImage = src && !errored;
  return (
    <span
      role="img"
      aria-label={name}
      className={`inline-flex items-center justify-center overflow-hidden rounded-full font-heading font-semibold ${SIZE[size]} ${
        showImage ? "bg-surface-default" : TONE_BG[tone]
      }`}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          onError={() => setErrored(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        initials(name)
      )}
    </span>
  );
}

export default Avatar;