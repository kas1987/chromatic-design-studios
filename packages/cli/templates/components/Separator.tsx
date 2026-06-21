import * as React from "react";

/**
 * Chromatic Separator — horizontal or vertical rule using the border token.
 */

export interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Separator({ orientation = "horizontal", className = "" }: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={`bg-border-default ${
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px"
      } ${className}`}
    />
  );
}

export default Separator;