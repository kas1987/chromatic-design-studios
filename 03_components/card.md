# Card

> **Status:** stable
> **Category:** Layout
> **Counterpart:** `packages/ui/src/components/Card.tsx`

Chromatic Card — surface container with eyebrow, title, content, and optional footer. Glassmorphism by default; can be marked `interactive` for hover-lift behavior on clickable surfaces.

## Anatomy

```
┌─────────────────────────────────────┐
│  Eyebrow (optional)                 │
│  Title                              │
│  Content (children)                 │
│  ─────────────────────────────────  │
│  Footer (optional)                  │
└─────────────────────────────────────┘
```

## States

- Default — surface elevation, no hover
- Interactive — adds hover-lift (translate Y) and brightens border

## Token references

| Property | Token |
|----------|-------|
| Background | `color.surface.elevated` |
| Border | `color.border.default` |
| Border (interactive hover) | `color.border.hover` |
| Shadow | `glow.card` |
| Radius | `radius.lg` (12px) |
