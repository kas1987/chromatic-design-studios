import * as React from "react";

/**
 * Chromatic Toast — transient, non-blocking notification.
 * Auto-dismisses after `duration` ms. Stacks in a portal at body.bottom-right.
 */

export type ToastTone = "info" | "success" | "warning" | "error";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone?: ToastTone;
  duration?: number;
}

export interface ToastViewportProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const TONE_CLASS: Record<ToastTone, string> = {
  info: "border-info",
  success: "border-success",
  warning: "border-warning",
  error: "border-error",
};

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  if (toasts.length === 0) return null;
  return (
    <div
      role="region"
      aria-label="Notifications"
      className="fixed bottom-6 right-6 z-50 flex w-full max-w-sm flex-col gap-3"
    >
      {toasts.map((t) => (
        <Toast key={t.id} item={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const tone = item.tone ?? "info";
  React.useEffect(() => {
    const ms = item.duration ?? 4000;
    const timer = setTimeout(() => onDismiss(item.id), ms);
    return () => clearTimeout(timer);
  }, [item.id, item.duration, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`glass flex items-start gap-3 rounded-md border-l-4 p-4 ${TONE_CLASS[tone]}`}
    >
      <div className="flex-1">
        <div className="font-heading text-sm font-semibold text-text-primary">{item.title}</div>
        {item.description && (
          <div className="mt-1 font-body text-xs text-text-secondary">{item.description}</div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        aria-label="Dismiss notification"
        className="text-text-muted transition hover:text-text-primary"
      >
        ✕
      </button>
    </div>
  );
}

/** Imperative API helper — pair with ToastViewport in your app root. */
export function useToast() {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  const push = React.useCallback((item: Omit<ToastItem, "id">) => {
    setToasts((prev) => [...prev, { ...item, id: Math.random().toString(36).slice(2) }]);
  }, []);
  return { toasts, push, dismiss };
}

export default ToastViewport;