# Visual Language — Chromatic Design Studios v0.1

## Color Philosophy

### Palette Structure

| Role | Base | Usage |
|------|------|-------|
| Background | `#0a0a0f` (Deep Void) | Primary canvas, dark mode default |
| Surface | `#12121a` (Stellar Dust) | Cards, panels, elevated surfaces |
| Surface Elevated | `#1a1a2e` (Nebula) | Modals, dropdowns, popovers |
| Primary | `#7c3aed` (Chromatic Violet) | CTAs, active states, links |
| Primary Glow | `#a78bfa` (Violet Halo) | Hover states, glow effects |
| Accent | `#06b6d4` (Holographic Cyan) | Highlights, badges, secondary actions |
| Accent Glow | `#67e8f9` (Cyan Halo) | Hover accents, sparkle effects |
| Text Primary | `#f8fafc` (Starlight) | Headings, primary readable text |
| Text Secondary | `#94a3b8` (Lunar) | Body text, descriptions, metadata |
| Text Muted | `#475569` (Shadow) | Disabled, placeholders, captions |
| Success | `#22c55e` (Plasma Green) | Confirmations, valid states |
| Warning | `#f59e0b` (Solar Amber) | Alerts, pending states |
| Error | `#ef4444` (Nova Red) | Errors, destructive actions |
| Border | `#1e293b` (Orbital) | Dividers, card borders, input outlines |
| Border Focus | `#7c3aed` (Chromatic Violet) | Focus rings, active borders |

### Gradient Patterns

- **Hero Gradient:** `linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #2e1065 100%)`
- **Holographic Panel:** `linear-gradient(180deg, rgba(124,58,237,0.15) 0%, rgba(6,182,212,0.05) 100%)`
- **Glow Edge:** `radial-gradient(circle at 50% 0%, rgba(124,58,237,0.3), transparent 70%)`

## Typography Hierarchy

| Level | Font | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|------|--------|-------------|----------------|-------|
| Display | Inter | 48px / 3rem | 700 | 1.1 | -0.02em | Hero headlines |
| H1 | Inter | 36px / 2.25rem | 700 | 1.2 | -0.02em | Page titles |
| H2 | Inter | 24px / 1.5rem | 600 | 1.3 | -0.01em | Section headers |
| H3 | Inter | 18px / 1.125rem | 600 | 1.4 | 0 | Card titles, labels |
| Body | IBM Plex Sans | 16px / 1rem | 400 | 1.6 | 0 | Paragraphs, descriptions |
| Body Small | IBM Plex Sans | 14px / 0.875rem | 400 | 1.5 | 0 | Metadata, captions |
| Mono | IBM Plex Mono | 14px / 0.875rem | 400 | 1.5 | 0 | Code, tokens, data |
| Label | Inter | 12px / 0.75rem | 500 | 1.4 | 0.05em | Badges, tags, pills |

## Spacing Rhythm

Base unit: **8px**

| Token | Value | Usage |
|-------|-------|-------|
| space-1 | 4px | Tight internal padding |
| space-2 | 8px | Base unit, icon gaps |
| space-3 | 12px | Component internal padding |
| space-4 | 16px | Default padding, card gutters |
| space-5 | 24px | Section gaps |
| space-6 | 32px | Card padding, modal gaps |
| space-7 | 48px | Section vertical spacing |
| space-8 | 64px | Major section breaks |
| space-9 | 96px | Page-level vertical rhythm |

## Motion Principles

- **Duration Scale:**
  - `duration-fast`: 150ms — Micro-interactions, hover states
  - `duration-normal`: 300ms — Transitions, reveals
  - `duration-slow`: 500ms — Page transitions, major state changes
- **Easing:**
  - `ease-out`: `cubic-bezier(0.33, 1, 0.68, 1)` — Primary motion (decelerate)
  - `ease-in-out`: `cubic-bezier(0.65, 0, 0.35, 1)` — Symmetric transitions
  - `ease-spring`: `cubic-bezier(0.34, 1.56, 0.64, 1)` — Playful bounces (sparingly)
- **Rules:**
  - Never animate layout properties (width, height, top, left)
  - Prefer transform and opacity for 60fps motion
  - Respect `prefers-reduced-motion`

## Effect Vocabulary

### Glow

| Token | Value | Usage |
|-------|-------|-------|
| glow-sm | `0 0 8px` | Subtle focus rings |
| glow-md | `0 0 16px` | Hover states, active buttons |
| glow-lg | `0 0 32px` | Hero elements, emphasis |
| glow-primary | `rgba(124,58,237,0.4)` | Violet glow color |
| glow-accent | `rgba(6,182,212,0.4)` | Cyan glow color |
| glow-white | `rgba(248,250,252,0.2)` | Neutral halo |

### Glassmorphism

- `background: rgba(18, 18, 26, 0.7)`
- `backdrop-filter: blur(12px)`
- `border: 1px solid rgba(124, 58, 237, 0.1)`
- `box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3)`

### Holographic

- Multi-stop gradients with low opacity
- Subtle animated position shifts (if motion allowed)
- Never obstruct readability

## Responsive Breakpoints

| Name | Width | Behavior |
|------|-------|----------|
| sm | 640px | Stack layouts, reduce spacing |
| md | 768px | 2-column grids, standard spacing |
| lg | 1024px | Full layouts, max spacing |
| xl | 1280px | Wide compositions |
