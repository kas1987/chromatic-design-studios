import * as React from "react";

/**
 * Chromatic Skeleton — loading placeholder. Pure CSS; uses the surface
 * token and a shimmer animation. Honors prefers-reduced-motion.
 */

export interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: "sm" | "md" | "lg" | "full";
  className?: string;
}

const RADIUS = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
} as const;

export function Skeleton({
  width = "100%",
  height = "1rem",
  rounded = "md",
  className = "",
}: SkeletonProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      aria-live="polite"
      style={{ width, height }}
      className={`inline-block bg-surface-default motion-reduce:animate-none ${RADIUS[rounded]} ${className}`}
    >
      <style>{`
        @keyframes skeleton-shimmer {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        [role="status"][aria-label="Loading"] {
          animation: skeleton-shimmer 1.5s ease-in-out infinite;
        }
      `}</style>
    </span>
  );
}

export default Skeleton;