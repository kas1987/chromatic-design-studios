# MetaChromatic Design System

Reference for tokens, layout patterns, and consistency. Implementation lives in `src/chromatic/` and shared layout components.

## Typography and color

- **Primary text:** `var(--text)` — main content (rgba white 0.95). Use for headings and body.
- **Secondary text:** `var(--text-muted)` — supporting copy (rgba white 0.65). Use for captions, labels, stats.
- **Tertiary / disabled:** `var(--text-dim)` — hints, placeholders (rgba white 0.4).

Avoid hard-coded hex for text (e.g. `#e8e8f0`, `#7a7a8e`). Prefer the variables above so mode and accessibility overrides apply.

Reference: [chromatic/tokens/variables.css](../src/chromatic/tokens/variables.css).

## Glass variants

- **Default panel:** `glass-panel` (Tailwind/global) or `glass-b` from [glass.css](../src/chromatic/tokens/glass.css) for workspace panels.
- **Stronger (modals, command bar):** `glass-strong` / plane C for floating surfaces.
- **Subtle (cards, list items):** `glass-subtle` for depth without heavy blur.

Use borders from tokens: `1px solid var(--border)` for panel edges.

## Spacing

Use a consistent scale for padding and gaps. Tokens in [variables.css](../src/chromatic/tokens/variables.css):

- **`var(--spacing-8)`** (8px) — tight (icon–label, badge padding)
- **`var(--spacing-12)`** (12px) — default (form fields, list items)
- **`var(--spacing-16)`** (16px) — relaxed (section padding, toolbar vertical)

Toolbars: horizontal padding `var(--spacing-16)` (px-4), vertical `var(--spacing-12)` (py-3), gap between elements `var(--spacing-16)` (gap-4).

## Mode toolbar pattern

All mode views (Browse, Tag, Review, Export, AI Training, Dashboard, ComfyUI) use the same toolbar structure:

- **Left:** Title + optional stats (badges, counts). Optional primary controls (e.g. folder picker in Browse).
- **Right:** Actions (buttons, filters, view toggles).

Toolbar structure: same height, `border-bottom: 1px solid var(--border)`, flex layout. Horizontal padding `var(--spacing-16)`, vertical `var(--spacing-12)`.

Implementation: shared `ModeToolbar` component with `left` and `right` slots. Keeps toolbars visually and structurally consistent.

## Empty states

- **Structure:** One line explaining why the state is empty; one line for “do this next”; one primary CTA (e.g. “Go to Browse”).
- **Component:** `ModeEmptyState` with `title`, `subtitle`, `ctaLabel`, `onCta`, and mode `accentColor` / `accentColor2`.
- **Pattern:** Tag, Review, Export, and Browse all follow this structure. When no CTA is needed (e.g. "Select from queue"), subtitle alone suffices.
- **Workflow hint:** When the Working Set is empty, the StatusBar shows "Add assets from Browse to get started" with a link. Dismissible per session (sessionStorage) to avoid nagging.

## Motion

- Prefer short, purposeful transitions (e.g. panel open/close, modal, route transition). ~150–200ms.
- Respect `prefers-reduced-motion`; see [accessibility.css](../src/chromatic/tokens/accessibility.css). No decorative motion; use only where it aids understanding.
- Panel collapse/expand: `transition: width 0.2s ease`. Route transitions: ~180ms easeInOut.

## Sidebar and progressive disclosure

- **Sidebar (AutoHideWrapper):** Left nav auto-hides after 3s inactivity; reappears on hover or when pinned. Pin state is global (PinContext). Optional future: “collapse to icons only” for more space.
- **Mode panels:** Tag (Batch/Sets/Meta), Review (Rules/Issues), and Export config can use an optional collapse (chevron) to shrink to a narrow strip or icon bar so power users can maximize grid/preview area. Same pattern for Browse detail panel “peek” if desired.
- **Shortcuts:** A single “?” or Help affordance (CommandBar) toggles the Keyboard Shortcuts modal. Document shortcuts in APP_WORKFLOWS_AND_TABS.md.

## Accessibility

- Focus: `:focus-visible` uses `var(--a)`; buttons/inputs get a visible ring.
- High contrast and reduced motion: handled in accessibility.css.
- Use semantic HTML and ARIA where needed (e.g. `role="tablist"`, `aria-selected` for tabs).
