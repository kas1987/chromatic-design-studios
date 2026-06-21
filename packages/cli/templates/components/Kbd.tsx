import * as React from "react";

/**
 * Chromatic Kbd — keyboard key indicator. Renders an inline <kbd> with
 * token-driven background and border.
 */

export interface KbdProps {
  children: React.ReactNode;
  className?: string;
}

export function Kbd({ children, className = "" }: KbdProps) {
  return (
    <kbd
      className={`inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-sm border border-border-default bg-background-elevated px-1.5 font-mono text-xs text-text-primary ${className}`}
    >
      {children}
    </kbd>
  );
}

export default Kbd;