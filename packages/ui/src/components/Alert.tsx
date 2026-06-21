import * as React from "react";

/**
 * Chromatic Alert — inline callout for info, success, warning, error states.
 * Token-driven; includes optional title, description, and dismiss.
 */

export type AlertTone = "info" | "success" | "warning" | "error";

export interface AlertProps {
  tone?: AlertTone;
  title?: React.ReactNode;
  children?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const TONE: Record<AlertTone, { border: string; icon: string; tint: string }> = {
  info: { border: "border-info", icon: "ℹ", tint: "bg-info/10" },
  success: { border: "border-success", icon: "✓", tint: "bg-success/10" },
  warning: { border: "border-warning", icon: "⚠", tint: "bg-warning/10" },
  error: { border: "border-error", icon: "✕", tint: "bg-error/10" },
};

export function Alert({
  tone = "info",
  title,
  children,
  dismissible,
  onDismiss,
  className = "",
}: AlertProps) {
  const t = TONE[tone];
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-md border-l-4 p-4 ${t.border} ${className}`}
    >
      <span aria-hidden className="font-heading text-base">{t.icon}</span>
      <div className="flex-1">
        {title && (
          <div className="font-heading text-sm font-semibold text-text-primary">{title}</div>
        )}
        {children && (
          <div className="mt-1 font-body text-sm text-text-secondary">{children}</div>
        )}
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="text-text-muted transition hover:text-text-primary"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default Alert;