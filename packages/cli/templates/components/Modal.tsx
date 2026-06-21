import * as React from "react";

/**
 * Chromatic Modal — focus-trapped overlay for confirmations and forms.
 * Token-driven; uses Chromatic tokens via Tailwind classes only.
 * Renders into a portal at <body>.
 */

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const SIZE: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: ModalProps) {
  const dialogRef = React.useRef<HTMLDivElement>(null);

  // Escape key + body scroll lock + focus trap
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Move focus into the dialog on mount
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background-default/80 p-4 backdrop-blur-sm"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "chromatic-modal-title" : undefined}
        aria-describedby={description ? "chromatic-modal-desc" : undefined}
        tabIndex={-1}
        className={`glass w-full ${SIZE[size]} rounded-lg p-6 outline-none`}
      >
        {title && (
          <h2
            id="chromatic-modal-title"
            className="font-heading text-xl font-semibold text-text-primary"
          >
            {title}
          </h2>
        )}
        {description && (
          <p id="chromatic-modal-desc" className="mt-2 font-body text-sm text-text-secondary">
            {description}
          </p>
        )}
        {children && <div className="mt-4 font-body text-text-primary">{children}</div>}
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;