import * as React from "react";

/**
 * Chromatic Slider — range input with keyboard nudging. Arrow keys step
 * by 1, Shift+Arrow steps by 10, Home/End jump to min/max.
 */

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (v: number) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
}

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  onChange,
  label,
  disabled,
  id,
}: SliderProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<number>(defaultValue ?? min);
  const v = isControlled ? value! : internal;
  const setV = (n: number) => {
    const clamped = Math.max(min, Math.min(max, n));
    if (!isControlled) setInternal(clamped);
    onChange?.(clamped);
  };
  const inputId = id ?? `slider-${React.useId()}`;
  const pct = ((v - min) / Math.max(1, max - min)) * 100;

  return (
    <div className="space-y-2 font-body text-sm">
      {label && (
        <div className="flex items-baseline justify-between">
          <label htmlFor={inputId} className="text-text-secondary">{label}</label>
          <span className="font-mono text-xs text-text-primary">{v}</span>
        </div>
      )}
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={v}
        disabled={disabled}
        onChange={(e) => setV(Number(e.target.value))}
        onKeyDown={(e) => {
          const big = step * 10;
          if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            e.preventDefault();
            setV(v + (e.shiftKey ? big : step));
          } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            e.preventDefault();
            setV(v - (e.shiftKey ? big : step));
          } else if (e.key === "Home") {
            e.preventDefault();
            setV(min);
          } else if (e.key === "End") {
            e.preventDefault();
            setV(max);
          }
        }}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={v}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-default accent-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          background: `linear-gradient(to right, var(--color-primary-600) ${pct}%, var(--color-surface-default) ${pct}%)`,
        }}
      />
    </div>
  );
}

export default Slider;