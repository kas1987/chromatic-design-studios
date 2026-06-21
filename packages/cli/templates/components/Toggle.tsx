import * as React from "react";

/**
 * Chromatic Toggle — two-state switch. Keyboard: Space toggles, Enter for action.
 */

export interface ToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  id?: string;
}

export function Toggle({
  checked,
  defaultChecked,
  onChange,
  label,
  disabled,
  id,
}: ToggleProps) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState<boolean>(defaultChecked ?? false);
  const value = isControlled ? checked! : internal;
  const setValue = (v: boolean) => {
    if (!isControlled) setInternal(v);
    onChange?.(v);
  };

  const inputId = id ?? `toggle-${React.useId()}`;

  return (
    <label
      htmlFor={inputId}
      className={`inline-flex cursor-pointer items-center gap-3 font-body text-sm text-text-primary ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
    >
      <span className="relative">
        <input
          id={inputId}
          type="checkbox"
          role="switch"
          aria-checked={value}
          checked={value}
          disabled={disabled}
          onChange={(e) => setValue(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={`block h-6 w-11 rounded-full border border-border-default transition duration-fast ${
            value ? "bg-primary-600 shadow-glow-focus" : "bg-surface-default"
          }`}
        />
        <span
          aria-hidden
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-background-elevated shadow transition-transform duration-fast ${
            value ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}

export default Toggle;