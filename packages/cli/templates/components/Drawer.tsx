import * as React from "react";

/**
 * Chromatic Drawer — side-anchored panel. Slides in from the chosen edge
 * with token-driven transitions. Backdrop click + Escape dismisses.
 */

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right" | "top" | "bottom";
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  width?: string; // tailwind max-w-* class for left/right
}

const SIDE_TRANSFORM: Record<NonNullable<DrawerProps["side"]>, string> = {
  left: "inset-y-0 left-0",
  right: "inset-y-0 right-0",
  top: "inset-x-0 top-0",
  bottom: "inset-x-0 bottom-0",
};

export function Drawer({
  open,
  onClose,
  side = "right",
  title,
  children,
  footer,
  width = "max-w-md",
}: DrawerProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  const isHorizontal = side === "left" || side === "right";
  const sizeClass = isHorizontal ? `h-full w-full ${width}` : "w-full";

  return (
    <div
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-background-default/80 backdrop-blur-sm"
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`glass fixed ${SIDE_TRANSFORM[side]} ${sizeClass} flex flex-col overflow-hidden rounded-md p-6 outline-none motion-safe:animate-[fadeIn_250ms_ease-out]`}
      >
        {title && (
          <h2 className="font-heading text-xl font-semibold text-text-primary">{title}</h2>
        )}
        <div className="mt-4 flex-1 overflow-auto font-body text-text-primary">{children}</div>
        {footer && <div className="mt-4 flex justify-end gap-3 border-t border-border-default pt-4">{footer}</div>}
      </div>
    </div>
  );
}

export default Drawer;