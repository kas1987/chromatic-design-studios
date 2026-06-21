import * as React from "react";

/**
 * Chromatic Progress — linear progress bar with determinate/indeterminate modes.
 */

export interface ProgressProps {
  value?: number; // 0-100; if undefined, indeterminate
  label?: string;
  showValue?: boolean;
  tone?: "primary" | "accent" | "success" | "warning" | "error";
}

const TONE: Record<NonNullable<ProgressProps["tone"]>, string> = {
  primary: "bg-primary-600",
  accent: "bg-accent-500",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
};

export function Progress({
  value,
  label,
  showValue,
  tone = "primary",
}: ProgressProps) {
  const indeterminate = value === undefined;
  const clamped = Math.max(0, Math.min(100, value ?? 0));
  return (
    <div className="space-y-2 font-body text-sm">
      {(label || showValue) && (
        <div className="flex items-baseline justify-between">
          {label && <span className="text-text-secondary">{label}</span>}
          {showValue && !indeterminate && (
            <span className="font-mono text-xs text-text-primary">{clamped}%</span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : clamped}
        aria-label={label}
        className="h-2 w-full overflow-hidden rounded-full bg-surface-default"
      >
        <div
          className={`h-full ${TONE[tone]} ${indeterminate ? "w-1/3 animate-[indeterminate_1.4s_ease-in-out_infinite]" : ""}`}
          style={!indeterminate ? { width: `${clamped}%` } : undefined}
        />
      </div>
    </div>
  );
}

export default Progress;