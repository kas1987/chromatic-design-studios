# Button

> **Status:** stable
> **Category:** Form
> **Counterpart:** `packages/ui/src/components/Button.tsx`

Chromatic Button — token-driven primitive. All visual values map to Chromatic tokens via Tailwind classes (Design Law #1). Shared by the Hero CTAs and the studio surfaces.

## Variants

| Variant | Use |
|---------|-----|
| primary | Main action — high emphasis |
| secondary | Lower-emphasis actions on the same surface |
| ghost | Tertiary actions; no background fill until hover |

## Sizes

| Size | Height | Use |
|------|--------|-----|
| sm | 32px | Inline actions, dense tables |
| md | 44px | Default |
| lg | 52px | Hero CTAs and prominent page actions |

## States

- Default
- Hover (lifts 1px, glow intensifies, primary shifts one step lighter)
- Focus-visible (glow focus ring)
- Disabled (50% opacity, no pointer events)
- aria-disabled for linked-and-disabled anchors

## Token references

| Property | Token |
|----------|-------|
| Background (primary) | `color.primary.600` |
| Background (primary hover) | `color.primary.500` |
| Background (ghost) | `color.surface.default` |
| Border (ghost) | `color.border.default` |
| Text | `color.text.onprimary` / `color.text.primary` |
| Radius | `radius.md` (8px) |
| Duration | `motion.duration.fast` (150ms) |
| Glow | `glow.hover` on primary hover |
