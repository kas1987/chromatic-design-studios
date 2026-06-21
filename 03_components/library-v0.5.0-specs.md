# Component Library v0.5.0 — Specs

> **Status:** Wave 6 deliverables. All components token-driven, accessibility-wired, agent-readable.
> **Counterpart source:** `packages/ui/src/components/<Name>.tsx`.
> **Total surface:** 23 components (5 from v0.3.0 + 18 added in v0.5.0).

---

## Conventions

Every component in this document:

- **Token-driven** — references Chromatic tokens via Tailwind classes. No hardcoded values.
- **Accessibility-wired** — keyboard support, ARIA roles, focus-visible states, label associations.
- **Agent-renderable** — this spec can be consumed by `chromatic-agent render` to emit TSX.
- **Composable** — exposes a `className` passthrough for surface-level overrides.
- **Reduced-motion-safe** — respects `prefers-reduced-motion`.

---

## Form

### Modal
Focus-trapped overlay for confirmations and forms. Renders into a portal at body. Escape key + backdrop click + body scroll lock. `aria-modal="true"`, `role="dialog"`. Sizes: sm (max-w-sm), md (max-w-md, default), lg (max-w-2xl).

```ts
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}
```

### Input
(Existing in v0.3.0.) Text input with label, hint, error, disabled states. Token-driven.

### Dropdown
Button-triggered menu. Closes on outside click, Escape, and item selection. Arrow keys move focus; Enter activates. `align="start" | "end"`.

```ts
interface DropdownItem { id: string; label: ReactNode; onSelect?: () => void; disabled?: boolean; destructive?: boolean; }
```

### Toggle
Two-state switch with `role="switch"`, `aria-checked`. Hidden checkbox + styled track. Disabled supported. Click + Space toggle.

### Slider
Range input with min/max/step. Linear-gradient fill tracks the value via `accent-primary-600`. Arrow keys step by `step`; Shift+Arrow steps by `step * 10`; Home/End jump to min/max. `aria-valuemin/max/now`.

---

## Display

### Badge
(Existing in v0.3.0.) Tone variants: default, primary, accent, success, warning, error.

### Avatar
Identity mark with image, initials fallback, and size variants. `tone` picks the initials background. Image error gracefully falls back to initials.

```ts
interface AvatarProps { src?: string; name: string; size?: "sm" | "md" | "lg" | "xl"; tone?: "primary" | "accent" | "success" | "warning" | "error"; }
```

### Progress
Linear progress bar. Determinate when `value` is set (0-100); indeterminate animates a fixed-width segment. `aria-valuemin/max/now`. Tone picks color.

### Skeleton
Loading placeholder with shimmer animation. Honors `prefers-reduced-motion`. Sizes via `width` and `height` props.

### Tooltip
Hover/focus disclosure with placement. 200ms hover delay. Clones the child to wire mouse/focus handlers — child must accept those handlers (e.g. buttons, links, spans). `role="tooltip"`, `aria-describedby` linkage.

### Alert
Inline callout. Tone variants: info, success, warning, error. `role="alert"` for errors, `role="status"` for the rest. Optional `dismissible` and `onDismiss`.

---

## Layout

### Card
(Existing in v0.3.0.) Surface with eyebrow, title, content, optional footer. `interactive` lifts on hover.

### Sheet
Full-bleed surface anchored to a viewport edge. Distinct from Drawer (Sheet is layout, Drawer is overlay). Side: left, right, top, bottom. Elevation: 0/1/2.

### Table
Semantic data table with header, body, caption, footer. Generics over row shape. `sortable` columns toggle ascending/descending. Empty state.

```ts
interface TableColumn<T> { id: string; header: ReactNode; cell: (row: T) => ReactNode; align?: "left" | "right" | "center"; sortable?: boolean; }
```

### Separator
Horizontal or vertical rule using the `border-default` token. `role="separator"`, `aria-orientation`.

### Kbd
Inline keyboard key indicator. Renders a `<kbd>` with token-driven background/border.

---

## Feedback

### Toast
Transient, non-blocking notification. Stack viewport at body bottom-right. Auto-dismiss after `duration` (default 4s). Tone: info, success, warning, error. Imperative API via `useToast()`.

### Drawer
Side-anchored panel with token-driven transitions. Backdrop + Escape dismiss. Renders into a portal. Side: left, right, top, bottom. Width for left/right (default `max-w-md`).

---

## Navigation

### Tabs
Tab strip with roving tabindex. Arrow Left/Right cycle focus. Home/End jump to ends. Controlled or uncontrolled. Disabled tabs skipped.

### Menu
Vertical action list. Composed primitives: `Menu`, `MenuItem`, `MenuSeparator`, `MenuLabel`. Item supports `shortcut` (kbd hint) and `destructive` styling.

### Pagination
Page navigation with first/prev/next/last and ellipsis-collapsed range. `aria-current="page"` on the active page. Sibling count configurable.

---

## Acceptance criteria for v0.5.0

- [x] All 18 new components ship with TSX + spec entry
- [x] All 23 components token-driven (no hardcoded values)
- [x] Keyboard navigation: Tab, Arrow, Home/End, Enter, Escape wired per component
- [x] ARIA roles + state attributes for every component
- [x] `prefers-reduced-motion` honored across motion-bearing components
- [x] `className` passthrough on every primitive
- [x] `packages/ui` barrel export updated with all 23 components
- [x] `apps/web` typecheck, build, unit tests, E2E all green
- [x] `/components` route shows the full library with category grouping
- [x] `/studio` gallery updated to show new components

## Counterpart file index

| Component | File |
|-----------|------|
| Alert | `packages/ui/src/components/Alert.tsx` |
| Avatar | `packages/ui/src/components/Avatar.tsx` |
| Badge | `packages/ui/src/components/Badge.tsx` |
| Button | `packages/ui/src/components/Button.tsx` |
| Card | `packages/ui/src/components/Card.tsx` |
| Drawer | `packages/ui/src/components/Drawer.tsx` |
| Dropdown | `packages/ui/src/components/Dropdown.tsx` |
| Hero | `packages/ui/src/components/Hero.tsx` |
| Input | `packages/ui/src/components/Input.tsx` |
| Kbd | `packages/ui/src/components/Kbd.tsx` |
| Menu | `packages/ui/src/components/Menu.tsx` |
| Modal | `packages/ui/src/components/Modal.tsx` |
| Pagination | `packages/ui/src/components/Pagination.tsx` |
| Progress | `packages/ui/src/components/Progress.tsx` |
| Separator | `packages/ui/src/components/Separator.tsx` |
| Sheet | `packages/ui/src/components/Sheet.tsx` |
| Skeleton | `packages/ui/src/components/Skeleton.tsx` |
| Slider | `packages/ui/src/components/Slider.tsx` |
| Table | `packages/ui/src/components/Table.tsx` |
| Tabs | `packages/ui/src/components/Tabs.tsx` |
| Toast | `packages/ui/src/components/Toast.tsx` |
| Toggle | `packages/ui/src/components/Toggle.tsx` |
| Tooltip | `packages/ui/src/components/Tooltip.tsx` |
