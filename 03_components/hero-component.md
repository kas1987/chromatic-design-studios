# Hero Component Spec — Chromatic Design Studios

## Overview

The Hero component is the primary above-the-fold section for Chromatic Design Studios pages. It establishes the cosmic, holographic, premium identity immediately and serves as the canonical example of token-driven design.

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  .chromatic-hero                                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  .chromatic-hero-content                                │  │
│  │  ┌─────────────────┐  ┌────────────────────────────┐  │  │
│  │  │  Badge (pill)     │  │  Headline (display)        │  │
│  │  │  "Design System"  │  │  "Chromatic Studios"         │  │
│  │  └─────────────────┘  └────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Subheadline (body large)                      │  │  │
│  │  │  "Governed design operations for the"            │  │  │
│  │  │  "Chromatic Harness ecosystem."                  │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  CTA Group (flex row, gap-4)                   │  │  │
│  │  │  [Primary Button]  [Ghost Button]              │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  (Background: .chromatic-hero-gradient with .chromatic-    │
│   aurora overlay, optional floating glassmorphism card     │
│   decoration at 80% right)                                 │
└─────────────────────────────────────────────────────────────┘
```

## Token Mapping

| Element | Token | Value | Source File |
|---------|-------|-------|-------------|
| Background | gradient.hero + aurora | linear-gradient + radial overlays | tokens.colors.json |
| Badge BG | color.surface | #12121a | tokens.colors.json |
| Badge Border | color.border | #1e293b | tokens.colors.json |
| Badge Text | color.text.secondary | #94a3b8 | tokens.colors.json |
| Headline | font.heading / text.4xl / weight.bold | Inter 48px 700 | tokens.typography.json |
| Headline Color | color.text.primary | #f8fafc | tokens.colors.json |
| Subheadline | font.body / text.lg / weight.normal | IBM Plex Sans 18px 400 | tokens.typography.json |
| Subheadline Color | color.text.secondary | #94a3b8 | tokens.colors.json |
| Primary CTA BG | color.primary.600 | #7c3aed | tokens.colors.json |
| Primary CTA Text | color.text.primary | #f8fafc | tokens.colors.json |
| Ghost CTA Border | color.border | #1e293b | tokens.colors.json |
| Ghost CTA Text | color.text.secondary | #94a3b8 | tokens.colors.json |
| Section Padding | space.9 (vertical) | 96px | tokens.spacing.json |
| Content Gap | space.5 | 24px | tokens.spacing.json |
| CTA Gap | space.4 | 16px | tokens.spacing.json |
| Badge Radius | radius.full | 9999px | tokens.spacing.json |
| Card Radius | radius.lg | 12px | tokens.spacing.json |
| CTA Radius | radius.md | 8px | tokens.spacing.json |

## Responsive Behavior

| Breakpoint | Layout Change |
|------------|---------------|
| xl (1280px+) | Full layout, max container width, optional floating card |
| lg (1024px) | Container lg, floating card hidden |
| md (768px) | Stack CTA group vertically if needed, reduce headline to 3xl |
| sm (640px) | Stack everything vertically, headline 2xl, padding space.7 |

## Interaction States

- **Badge**: static, no hover state
- **Headline**: static, `.chromatic-text-glow` on load animation (optional)
- **Subheadline**: static
- **Primary CTA**: hover → background shifts to primary-500, glow-md primary glow, translateY(-1px)
- **Ghost CTA**: hover → background becomes surface, text becomes primary, border becomes primary-700
- **Background**: subtle parallax on scroll (optional, 10% speed), respects prefers-reduced-motion

## CSS Classes Used

```
.chromatic-hero
.chromatic-hero-gradient
.chromatic-aurora
.chromatic-container
.chromatic-flex-col
.chromatic-flex-gap-5
.chromatic-badge
.chromatic-text-4xl  (or responsive: chromatic-text-3xl, chromatic-text-2xl)
.chromatic-text-secondary
.chromatic-text-glow
.chromatic-button-primary
.chromatic-button-ghost
```

## Accessibility

- Headline is `h1`
- Subheadline is `p`
- CTA buttons use `<button>` with focus-visible styles
- Color contrast: headline (#f8fafc on #0a0a0f) = 19.5:1 ✅
- Subheadline (#94a3b8 on #0a0a0f) = 7.2:1 ✅
- Respect `prefers-reduced-motion` — disable parallax and load animations

## Acceptance Criteria

- [ ] Background renders without banding in all major browsers
- [ ] Headline uses exact token values (font, size, weight, color)
- [ ] Spacing matches token scale (section padding, content gaps)
- [ ] Responsive layout works at 320px, 768px, 1280px
- [ ] CTA hover states use tokens and 150ms transitions
- [ ] No hardcoded colors outside token system
- [ ] Lighthouse accessibility score >= 95
- [ ] File size: CSS + HTML < 20KB uncompressed
