# Shopify Theme Architecture Patterns

> Distilled from zelexto-shopify repo review (2026-06-05) and HowieZZ editorial build.

---

## Event Bus (Pub/Sub)
Vanilla JS, no framework. Loose coupling between sections via a shared event bus in `theme.js`:

```js
theme.emit('cart:updated', payload)
theme.on('cart:updated', handler)
theme.off('cart:updated', handler)
```

Enables cart drawer, sticky bar, and recommendation sections to react to each other without direct references.

---

## Lazy Module Loading
Components declare their module via a `data-module` attribute. Theme core loads the JS only when the element enters the viewport (IntersectionObserver, 200px rootMargin):

```html
<div data-module="quick-view">...</div>
```

```js
// theme.js
observer.observe(el) // loads assets/quick-view.js on visibility
```

Benefits: zero JS cost for sections not on page; clean section isolation.

---

## Parallax Engine Pattern

Key implementation decisions from `parallax-engine.js`:

```
Single shared scroll listener (passive)
  → requestAnimationFrame schedule (decouples scroll from render)
    → IntersectionObserver (skip off-screen elements)
      → CSS translateY/translateX only (GPU layer, no layout thrash)
```

**Speed multipliers:** 0.5×, 0.7×, 0.8×, 1.0×, 1.1× (declared via `data-parallax-speed`)  
**Mobile damping:** 35% reduced intensity  
**Max shift:** declared via `data-parallax-max`  

```html
<div data-parallax-speed="0.15" data-parallax-axis="y" data-parallax-max="80">
```

This same pattern (IntersectionObserver + rAF + GPU transform) is what our `editorial.js` uses for `.reveal` elements.

---

## Section Architecture
60+ sections, each self-contained:
- Liquid template handles data + markup
- `data-module` attribute pulls in JS on demand
- Section-specific CSS scoped by section class

Sections communicate only via the event bus — no direct DOM coupling.

---

## CSS Design System Conventions

### Naming
- BEM-inspired: `.btn--primary`, `.field__input`, `.card__body`
- Utility layout: `.container`, `.stack`, `.cluster`, `.grid`
- State: `[data-parallax]`, `[data-reveal]`, `[data-module]`

### Design Token Structure
```css
/* Typography scale: 9 steps 0.75rem–5rem */
/* Spacing: 4px base, 10 levels (4px–128px) */
/* Motion: Apple easing functions, 150ms–900ms durations */
/* Z-index: 1–500 scale */
/* Elevation: 2 shadow levels */
```

Container max: **1240px**, fluid gutter via `clamp()`.

---

## Critical CSS Pattern
`critical.css` is inlined in `<head>` for above-fold styles.  
`base.css`, `components.css`, `motion.css` loaded async.  
Keeps First Contentful Paint fast without blocking render.

---

## Settings Schema
`config/settings_schema.json` exposes ~15 customization groups to the Shopify theme editor:
- Design (colors, typography, layout)
- Header (sticky, transparency, logo width)
- Commerce (cart mode, free shipping threshold, hover effects)
- CRO (low stock badges, exit-intent, sticky ATC, upsells)
- Motion (toggle, duration)
- Analytics (GA4, GTM, Meta Pixel, Klaviyo)
- India market (Razorpay, UPI/COD/EMI badges, GST, pincode)

Pattern: expose design tokens as theme editor variables → CSS custom properties.

---

## Performance Targets (from zelexto PRD)
| Metric | Target |
|---|---|
| Lighthouse score | 90+ |
| First Contentful Paint | < 2s |
| Largest Contentful Paint | < 2.5s |
| Frame rate | 60fps |
| CLS | Minimal |

---

## Localization Structure
```
locales/
  en.default.json   (English)
  hi.json           (Hindi)
  ar.json           (Arabic — RTL support)
```
Currency selector + locale/market switcher in header. INR uses lakh formatting.

---

## Sections to Reference for Zelex Rebuild
| File | Purpose |
|---|---|
| `layout/theme.liquid` | Master template |
| `sections/story-hero.liquid` | Cinematic fullscreen hero with parallax |
| `sections/story-parallax.liquid` | Three-layer depth parallax section |
| `sections/main-product.liquid` | Apple-style PDP |
| `sections/main-collection.liquid` | Collection with filtering/sorting |
| `assets/theme.js` | Core event bus + module loader |
| `assets/parallax-engine.js` | GPU-accelerated parallax |
| `assets/base.css` | Design tokens + layout primitives |
| `assets/motion.css` | Animation definitions |
| `snippets/product-card.liquid` | Reusable product card |
