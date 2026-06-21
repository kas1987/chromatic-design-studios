import * as React from "react";

/**
 * Chromatic Tabs — keyboard-navigable tab strip with roving tabindex.
 * Arrow Left/Right cycle focus; Home/End jump to ends.
 */

export interface TabItem {
  id: string;
  label: React.ReactNode;
  panel: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (id: string) => void;
  ariaLabel?: string;
}

export function Tabs({
  items,
  defaultValue,
  value,
  onValueChange,
  ariaLabel,
}: TabsProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<string>(
    defaultValue ?? items[0]?.id ?? "",
  );
  const active = isControlled ? value! : internal;
  const setActive = (id: string) => {
    if (!isControlled) setInternal(id);
    onValueChange?.(id);
  };

  const listRef = React.useRef<HTMLDivElement>(null);
  const enabledIds = items.filter((i) => !i.disabled).map((i) => i.id);
  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, id: string) => {
    const idx = enabledIds.indexOf(id);
    if (idx < 0) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = enabledIds[(idx + 1) % enabledIds.length];
      setActive(next);
      listRef.current?.querySelector<HTMLButtonElement>(`[data-tab="${next}"]`)?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = enabledIds[(idx - 1 + enabledIds.length) % enabledIds.length];
      setActive(prev);
      listRef.current?.querySelector<HTMLButtonElement>(`[data-tab="${prev}"]`)?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      const first = enabledIds[0];
      setActive(first);
      listRef.current?.querySelector<HTMLButtonElement>(`[data-tab="${first}"]`)?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      const last = enabledIds[enabledIds.length - 1];
      setActive(last);
      listRef.current?.querySelector<HTMLButtonElement>(`[data-tab="${last}"]`)?.focus();
    }
  };

  return (
    <div className="space-y-4">
      <div
        ref={listRef}
        role="tablist"
        aria-label={ariaLabel}
        className="inline-flex gap-1 rounded-md border border-border-default bg-background-elevated p-1"
      >
        {items.map((it) => {
          const isActive = it.id === active;
          return (
            <button
              key={it.id}
              role="tab"
              type="button"
              data-tab={it.id}
              aria-selected={isActive}
              aria-controls={`panel-${it.id}`}
              tabIndex={isActive ? 0 : -1}
              disabled={it.disabled}
              onKeyDown={(e) => onKeyDown(e, it.id)}
              onClick={() => setActive(it.id)}
              className={`rounded-sm px-4 py-1.5 font-body text-sm transition duration-fast ${
                isActive
                  ? "bg-primary-600 text-text-onprimary shadow-glow-hover"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {it.label}
            </button>
          );
        })}
      </div>
      {items.map((it) => (
        <div
          key={it.id}
          role="tabpanel"
          id={`panel-${it.id}`}
          aria-labelledby={`tab-${it.id}`}
          hidden={it.id !== active}
          className="font-body text-text-primary"
        >
          {it.panel}
        </div>
      ))}
    </div>
  );
}

export default Tabs;