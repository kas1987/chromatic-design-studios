# Zelexto Landing — Design Patterns

> Repo: https://github.com/akashkottil/zelexto-landing  
> Stack: Next.js 16 + TypeScript + Tailwind CSS 4 + Framer Motion + Rive

## Purpose
B2B creative studio landing page. Premium positioning: web design, mobile apps, brand systems, AI integration.

---

## Design System

### Color Tokens
```css
--ink:    #0B1020   /* near-black background */
--canvas: #F5F4F0   /* light background */
--lime:   #D4FF4F   /* punchy accent/highlight */
--violet: #6C5CE7   /* primary brand color */
```

### Typography
- **Display:** Instrument Serif (premium serif accent)
- **Body/UI:** Geist (modern sans)
- **Code:** Geist Mono
- Fluid scaling via `clamp()` throughout — no breakpoint-heavy font sizing

### Button System
```
.btn-violet   → primary (violet fill)
.btn-canvas   → secondary (light fill)
.btn-ghost    → tertiary (transparent)
.btn-lime     → accent action (lime highlight)
```
All include `transform: translateY(-2px)` on hover + smooth transition.

---

## Animation Patterns

### Framer Motion Reveal Variant
```js
const reveal = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
}
// Stagger: 0.12s increments per child element
```

### CSS Keyframe Animations
| Name | Duration | Use |
|---|---|---|
| `spark-pulse` | 1s infinite | Pulsing dot for active/featured states |
| `marquee` | — | Continuous horizontal service list scroll |
| `drift` | 16s / 24s | Background gradient blob movement |
| `pulse-violet` | — | Ring expansion from center (credibility indicators) |

### Scroll-Linked
- `useScroll() + useTransform()` in Process section
- Vertical progress line draws as user scrolls through 4 steps

---

## Component Patterns

### Page Structure (top → bottom)
```
Navbar (sticky glass pill)
Hero (headline + CTA + Orbit decoration)
Marquee (scrolling services list)
Services (3-col icon grid)
WhyZelexto (value props + stats)
Process (4-step scroll animation)
Audience (target market positioning)
Portfolio (asymmetric featured grid)
FinalCTA (closing action)
Footer (3-col)
WhatsAppButton (persistent float)
```

### Navbar — Glass Pill Pattern
- Floating pill shape, not full-width bar
- Glassmorphism: `backdrop-blur(12px)` + `rgba` bg + alpha border
- Scroll threshold: activates at 40px
- Mobile: hamburger → slide-down menu

### Hero
- Metadata row with booking status + coordinates (small, muted — feels editorial)
- Two-line headline, staggered reveal
- Paragraph + dual CTAs side-by-side
- SVG `Orbit` curve element as atmospheric decoration
- `Atmosphere.tsx` = CSS-only animated background (no canvas/JS)

### Portfolio Grid — Asymmetric Layout
```
[  Large featured card  ] [ Card 2 ]
                          [ Card 3 ]
```
- Large: `h-[420px]` desktop / `h-72` mobile
- Hover: `translateY(-4px)` + violet border + arrow reveal
- Gradient backgrounds with animated grid overlays
- Abstract mockup cards with rotation transforms

### Services Grid
- 3-col responsive (1→2→3 columns)
- Hover: vertical lift (-4px) + border color transition
- Index labels top-right: `/ 01`, `/ 02`...
- "Spark dot" (lime pulse) on featured items

---

## Visual Effects

### Glassmorphism Recipe
```css
backdrop-filter: blur(12px) saturate(120%);
background: rgba(var(--surface-rgb), 0.12);
border: 1px solid rgba(255,255,255,0.08);
```

### Atmospheric Background
- Two radial gradient blobs (violet top-right, bottom-left)
- `drift` animation (slow, 16–24s) — subtle, non-distracting
- Dot grid pattern overlay
- `Atmosphere.tsx` is pure CSS — zero JS, zero paint cost

---

## Key Takeaways for DTC Landing Pages
1. **Glass pill nav** reads more premium than full-width bars
2. **Instrument Serif + Geist** is a strong luxury-modern pairing (analogous to our Didot + Helvetica Neue)
3. **Lime as accent** is bold — for Zelex equivalent use gold
4. **Metadata row in hero** (location, status, small labels) adds editorial gravitas cheaply
5. **Asymmetric portfolio grid** better than uniform grid for luxury photography
6. **WhatsApp float button** = high-conversion for DTC (consider for Zelex contact flow)
7. **Rive** for interactive vector animations — worth evaluating for product hero moments
