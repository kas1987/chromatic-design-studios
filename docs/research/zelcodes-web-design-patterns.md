# Zelcodes Web — Design Patterns

> Repo: https://github.com/akashkottil/zelcodes-web  
> Stack: Next.js 16 + TypeScript + Tailwind CSS 4 + Framer Motion 12 + next-themes

## Purpose
Marketing site for a SwiftUI animation library. Freemium model: browse free, Patreon for source. Features 27 static animation detail pages and an interactive filtering showcase.

---

## Design System

### Color Tokens (Light / Dark)
```css
/* Light */
--background: #fafbff
--foreground: dark neutral
/* Dark */
--background: #05060f   ← near-black, similar to our --ground
```
Accent colors: **indigo, pink, cyan** (for gradients/highlights)  
`--patreon`: coral/orange (brand-specific monetization color)

### Typography
- **Body/UI:** Inter
- **Code:** JetBrains Mono
- Both loaded via `next/font` (no layout shift, no external request)

### Utility Classes
```css
.glass           → backdrop-blur + saturation + subtle border
.text-gradient   → 3-color background-clip gradient on text
.ring-glow       → box-shadow halo in brand color
.noise::after    → SVG fractal noise texture overlay
.liquid-text     → flowing background-position animation
.liquid-sheen    → layered sheen animation
```

---

## Animation Patterns

### Spring Carousel (HeroCarousel)
```js
spring: { stiffness: 240, damping: 28 }
// Auto-advance: every 4.8s, pause on hover/touch
// Drag threshold: >60px offset OR >6000 momentum
```
Card transforms by distance from active:
```
Active:   scale(1.0),  rotate(0°),  blur(0)
Adjacent: scale(0.9),  rotate(±5°), blur(light)
Distant:  scale(0.78), rotate(±?°), blur(heavy)
```

### Framer Motion Reveal (shared with zelexto-landing)
```js
// Same easing: [0.22, 1, 0.36, 1]
// Stagger: 0.08s (slightly tighter than zelexto-landing's 0.12s)
// Once: true — no re-animation on scroll back
```

### MeshGradient Component
Three animated gradient orbs, each on independent timing:
```
Orb 1: 18s loop
Orb 2: 22s loop (reversed direction)
Orb 3: 26s loop
Blur: 120–140px (very soft, painterly)
Intensity prop: bold=0.85, soft=0.55
```
Memoized to prevent re-renders. Most sophisticated ambient background pattern in the portfolio.

### CSS Keyframes
```css
shimmer    → loading/skeleton states
float      → gentle up/down bob
mesh       → gradient orb path movement
liquid-flow → background-position sweep for text effects
```

---

## Component Patterns

### Page Structure
```
Navbar (sticky glass)
Hero (badge + headline + carousel)
AnimationShowcase (filter + 3-col grid)
HowItWorks (3-step process)
CredibilitySection (builder trust)
CTASection (gradient background)
Footer (4-col)
```

### AnimationCard
```
[Preview container]
[Difficulty badge]     top-left
[Title + arrow]        hover: arrow slides right
[Description]          2-line clamp
[Category tags]        max 3
```
Hover state: `translateY(-4px)` + ring highlight + staggered entrance by index.

### Filter System
```jsx
// Dynamic category list from data
// Active: solid foreground bg
// Inactive: .glass effect
// useMemo for filtered array — no re-render on unrelated state
```

### HowItWorks (3-Step Freemium Funnel)
1. Browse the library (free)
2. Pick what you need
3. Unlock source on Patreon

Glass cards + gradient icons + 0.08s stagger.

### CTASection — Gradient Background
```css
background: linear-gradient(135deg, indigo → pink → cyan)
```
Full-width section, centered headline + dual CTAs. Viewport-triggered slide-up.

### Theme Toggle
- `next-themes` for light/dark
- System preference detected on first load
- CSS variables swap cleanly — no flash of wrong theme (SSR-safe)

---

## Structural Patterns

### Static Generation for GitHub Pages
```js
// next.config.ts
output: 'export'
images: { unoptimized: true }
basePath: process.env.NODE_ENV === 'production' ? '/zelcodes-web' : ''
```
27 animation detail pages pre-rendered at build time. Zero server needed.

### Data Layer (`lib/animations.ts`)
All animation metadata lives in a single TypeScript file:
```ts
interface Animation {
  slug, title, category, difficulty,
  description, tags[], previewComponent
}
```
Filtering, routing, and detail pages all derive from this one source of truth. Clean pattern for any catalog-style DTC site.

---

## Key Takeaways for DTC / Catalog Sites
1. **Spring carousel** (stiffness 240, damping 28) is the sweet spot — responsive without being bouncy
2. **MeshGradient** as hero background is far more premium than static gradients — worth extracting as a standalone component
3. **`lib/` data layer pattern** for product catalog: one source of truth → filtering, routing, detail pages all derive from it
4. **Difficulty/category badges** on cards = scannability pattern applicable to product spec tags (cup size, height, material)
5. **Static export to GitHub Pages** is the right call for our HowieZZ bundle too — same pattern already in use
6. **next-themes** light/dark toggle adds ~0 overhead and is expected by modern users
7. **`.text-gradient`** (background-clip gradient text) is a premium accent worth adding to our editorial CSS
8. **`liquid-flow` + `.liquid-sheen`** animations: consider for gold accent text on Zelex headers
