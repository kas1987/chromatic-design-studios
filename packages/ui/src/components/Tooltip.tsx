import * as React from "react";

/**
 * Chromatic Tooltip — hover/focus disclosure. Placed via `placement` prop
 * with token-driven positioning. Delay 200ms before showing on focus.
 *
 * The child must be a focusable element (button, a, span with tabIndex).
 * We wrap it in a positioning span; event handlers are attached to the
 * child so hover/focus work natively.
 */

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: React.ReactNode;
  placement?: TooltipPlacement;
  children: React.ReactElement<{
    onMouseEnter?: React.MouseEventHandler;
    onMouseLeave?: React.MouseEventHandler;
    onFocus?: React.FocusEventHandler;
    onBlur?: React.FocusEventHandler;
    "aria-describedby"?: string;
  }>;
}

const PLACEMENT_CLASS: Record<TooltipPlacement, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

export function Tooltip({ content, placement = "top", children }: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    timerRef.current = setTimeout(() => setOpen(true), 200);
  };
  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(false);
  };
  React.useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const childProps = children.props;
  const child = React.cloneElement(children, {
    onMouseEnter: (e: React.MouseEvent) => {
      show();
      childProps.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hide();
      childProps.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent) => {
      show();
      childProps.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent) => {
      hide();
      childProps.onBlur?.(e);
    },
    "aria-describedby": open ? id : undefined,
  } as React.Attributes);

  return (
    <span className="relative inline-block">
      {child}
      {open && (
        <span
          role="tooltip"
          id={id}
          className={`glass absolute z-30 whitespace-nowrap rounded-md px-3 py-1.5 font-body text-xs text-text-primary ${PLACEMENT_CLASS[placement]}`}
        >
          {content}
        </span>
      )}
    </span>
  );
}

export default Tooltip;