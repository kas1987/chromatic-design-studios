import * as React from "react";

/**
 * Chromatic Input — token-driven text field. Surface background, default
 * border, focus ring uses border-focus + the glow-focus preset (Design Law
 * #5). Optional label + hint render with the type/color tokens.
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, hint, invalid = false, id, className = "", ...rest }, ref) {
    const inputId = id || (label ? `in-${Math.abs(hashLabel(String(label)))}` : undefined);
    const border = invalid
      ? "border-semantic-error focus:border-semantic-error focus:shadow-none"
      : "border-border-default focus:border-border-focus focus:shadow-glow-focus";
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-label uppercase tracking-wide text-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={invalid || undefined}
          className={`rounded-md border bg-surface-default px-3 py-2 font-body text-base text-text-primary placeholder:text-text-muted transition duration-fast ease-easeOut focus:outline-none ${border} ${className}`.trim()}
          {...rest}
        />
        {hint && (
          <span className={`text-sm ${invalid ? "text-semantic-error" : "text-text-muted"}`}>
            {hint}
          </span>
        )}
      </div>
    );
  }
);

// Stable id from a label without Math.random (SSR-safe).
function hashLabel(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return h;
}

export default Input;
