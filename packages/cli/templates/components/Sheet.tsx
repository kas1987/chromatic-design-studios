import * as React from "react";

/**
 * Chromatic Sheet — full-bleed surface anchored to a viewport edge.
 * Distinct from Drawer (Sheet is layout, Drawer is overlay interaction).
 * Useful for mobile bottom sheets and edge-attached panels in flow.
 */

export interface SheetProps {
  side?: "left" | "right" | "top" | "bottom";
  elevation?: 0 | 1 | 2;
  className?: string;
  children?: React.ReactNode;
}

const SIDE: Record<NonNullable<SheetProps["side"]>, string> = {
  left: "border-l",
  right: "border-r",
  top: "border-t",
  bottom: "border-b",
};

const ELEVATION: Record<NonNullable<SheetProps["elevation"]>, string> = {
  0: "",
  1: "shadow-glow-card",
  2: "shadow-glow-hover",
};

export function Sheet({
  side = "bottom",
  elevation = 1,
  className = "",
  children,
}: SheetProps) {
  return (
    <section
      className={`rounded-md border border-border-default bg-background-elevated p-5 ${SIDE[side]} ${ELEVATION[elevation]} ${className}`}
    >
      {children}
    </section>
  );
}

export default Sheet;