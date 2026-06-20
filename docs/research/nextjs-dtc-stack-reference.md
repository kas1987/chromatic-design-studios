# Next.js DTC Brand Stack — Reference

> Distilled from zelexto-landing + zelcodes-web (akashkottil, 2026-06-05)  
> This is the proven modern stack for luxury DTC / editorial brand marketing sites.

---

## Recommended Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16+ (App Router) | Static export, image opt, font opt, file-based routing |
| Language | TypeScript | Type-safe component props, data layer |
| Styling | Tailwind CSS 4 + PostCSS | Utility-first, custom properties, no SCSS needed |
| Animation | Framer Motion 12+ | Spring physics, scroll triggers, viewport reveals |
| Icons | Lucide React | Lightweight, consistent, tree-shakeable |
| Fonts | `next/font` | Zero layout shift, no external request |
| Theme | next-themes | Light/dark toggle, SSR-safe, ~0 overhead |
| Deployment | Vercel OR static export → GitHub Pages | Both proven |

**Font pairings that work:**
- Instrument Serif + Geist (studio/B2B)
- Didot/Playfair + Helvetica Neue (luxury editorial — our HowieZZ choice)
- Inter + JetBrains Mono (product/developer-focused)

---

## Shared Animation Constants

Both repos converge on these exact values — treat as proven defaults:

```js
// Framer Motion spring (carousel / drag)
const spring = { stiffness: 240, damping: 28 }

// Reveal variant (scroll-triggered entrance)
const reveal = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
  }
}

// Stagger delays
// Studio/editorial: 0.12s per child
// Catalog/compact: 0.08s per child

// Hover lift
transform: translateY(-4px)   // cards, portfolio items
transform: translateY(-2px)   // buttons, smaller elements
```

---

## Glassmorphism Recipe

```css
.glass {
  backdrop-filter: blur(12px) saturate(120%);
  background: rgba(var(--surface-rgb), 0.12);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```
Use for: floating navbars, feature cards, badges, filter buttons.  
Do NOT use for: primary content blocks (too much layering collapses depth).

---

## Ambient Background System

### Simple (zelexto-landing approach)
Two radial gradient blobs, pure CSS, `position: fixed`, `pointer-events: none`:
```css
.blob-1 { background: radial-gradient(circle, var(--violet) 0%, transparent 70%); }
animation: drift 16s ease-in-out infinite;

@keyframes drift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%       { transform: translate(30px, -20px) scale(1.05); }
}
```

### Premium (zelcodes MeshGradient approach)
Three independent orbs (React component, memoized):
- Orb timing: 18s / 22s reversed / 26s
- Blur: 120–140px
- Intensity prop controls opacity (bold: 0.85, soft: 0.55)
- Worth extracting as a standalone `<MeshGradient intensity="soft" />` component

---

## Data Layer Pattern (for catalog sites)

One TypeScript file → all catalog pages derive from it:

```ts
// lib/products.ts (or lib/muses.ts)
export interface Product {
  slug: string
  name: string
  category: string
  tags: string[]
  specs: { height: string; cup: string; material: string }
  portrait: string
  gallery: string[]
  description: string
}

export const products: Product[] = [ ... ]
```

Filtering: `useMemo(() => products.filter(...), [activeCategory])`  
Detail pages: `generateStaticParams()` from slugs  
No API calls, no server — fully static.

---

## Page Section Order (proven for DTC)

```
1. Navbar         — sticky glass pill or bar
2. Hero           — headline + CTA + atmospheric bg
3. Social proof   — marquee logos OR stats bar
4. Features/Grid  — 3-col cards, staggered entrance
5. Showcase       — carousel OR asymmetric photo grid
6. How it works   — 3-step process (numbered)
7. Testimonials   — 3-col reviews
8. Final CTA      — gradient background, centered
9. Footer         — 3–4 col, logo + nav + contact
```
Optional floats: WhatsApp button, cookie consent, exit-intent modal.

---

## CSS Utility Classes Worth Adding to Any Design System

```css
/* Gradient text */
.text-gradient {
  background: linear-gradient(135deg, var(--color-1), var(--color-2), var(--color-3));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Halo glow on brand elements */
.ring-glow {
  box-shadow: 0 0 0 2px transparent, 0 0 20px rgba(var(--brand-rgb), 0.4);
  transition: box-shadow 0.3s ease;
}
.ring-glow:hover {
  box-shadow: 0 0 0 2px var(--brand), 0 0 30px rgba(var(--brand-rgb), 0.6);
}

/* Noise texture overlay */
.noise::after {
  content: '';
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,..."); /* SVG fractal noise */
  opacity: 0.03;
  pointer-events: none;
}

/* Liquid flow for accent text */
.liquid-text {
  background: linear-gradient(90deg, var(--gold), var(--gold-hi), var(--gold));
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: liquid-flow 3s linear infinite;
}
@keyframes liquid-flow {
  0%   { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
```

---

## Static Export Config (GitHub Pages)

```ts
// next.config.ts
const isProd = process.env.NODE_ENV === 'production'

const config = {
  output: 'export',
  images: { unoptimized: true },
  basePath: isProd ? '/repo-name' : '',
  assetPrefix: isProd ? '/repo-name/' : '',
}
```

Add `.nojekyll` to `public/` to prevent GitHub Pages from ignoring `_next/` assets.
