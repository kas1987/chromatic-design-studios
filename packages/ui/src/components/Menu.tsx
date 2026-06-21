import * as React from "react";

/**
 * Chromatic Menu — vertical action list. Optionally grouped with labels
 * and separated by dividers. Pure presentational; pair with Dropdown
 * or any container for keyboard handling.
 */

export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shortcut?: string;
  destructive?: boolean;
}

export function MenuItem({
  shortcut,
  destructive,
  className = "",
  children,
  ...rest
}: MenuItemProps) {
  return (
    <button
      type="button"
      {...rest}
      className={`flex w-full items-center justify-between gap-3 px-4 py-2 text-left font-body text-sm transition ${
        destructive ? "text-error hover:bg-surface-hover" : "text-text-primary hover:bg-surface-hover"
      } disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      <span>{children}</span>
      {shortcut && (
        <span className="font-mono text-xs text-text-muted">{shortcut}</span>
      )}
    </button>
  );
}

export function MenuSeparator() {
  return <div role="separator" className="my-1 h-px bg-border-default" />;
}

export function MenuLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 pb-1 pt-3 font-mono text-xs uppercase tracking-wide text-text-muted">
      {children}
    </div>
  );
}

export interface MenuProps {
  children: React.ReactNode;
  className?: string;
}

export function Menu({ children, className = "" }: MenuProps) {
  return (
    <div
      role="menu"
      className={`glass min-w-[12rem] overflow-hidden rounded-md py-1 ${className}`}
    >
      {children}
    </div>
  );
}

export default Menu;