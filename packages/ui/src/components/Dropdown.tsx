import * as React from "react";

/**
 * Chromatic Dropdown — button-triggered menu. Closes on outside click,
 * Escape, and item selection. Keyboard nav: Arrow keys + Enter.
 */

export interface DropdownItem {
  id: string;
  label: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  destructive?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "start" | "end";
}

export function Dropdown({ trigger, items, align = "start" }: DropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(items.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      items[active]?.onSelect?.();
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center justify-center rounded-md border border-border-default bg-surface-default px-4 py-2 font-body text-sm text-text-primary transition hover:border-primary-700 hover:text-text-primary"
      >
        {trigger}
        <span aria-hidden className="ml-2 text-text-muted">▾</span>
      </button>
      {open && (
        <ul
          role="menu"
          tabIndex={-1}
          onKeyDown={onListKey}
          className={`glass absolute z-20 mt-2 min-w-[12rem] overflow-hidden rounded-md py-1 ${
            align === "end" ? "right-0" : "left-0"
          }`}
        >
          {items.map((it, i) => (
            <li key={it.id} role="none">
              <button
                role="menuitem"
                type="button"
                disabled={it.disabled}
                onMouseEnter={() => setActive(i)}
                onClick={() => {
                  it.onSelect?.();
                  setOpen(false);
                }}
                className={`flex w-full items-center px-4 py-2 text-left font-body text-sm transition ${
                  active === i ? "bg-surface-hover" : ""
                } ${
                  it.destructive ? "text-error" : "text-text-primary"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {it.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;