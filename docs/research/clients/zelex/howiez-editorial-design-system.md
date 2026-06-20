# HowieZZ Editorial Design System

> Built for the Zelex editorial preview bundle (HowieZZ repo, 2026-06-05)
> Live review: https://kas1987.github.io/HowieZZ/review.html
> Repo: https://github.com/kas1987/HowieZZ

## Design Direction
**Editorial / Magazine** — luxury brand feel engaging new browsers and returning collectors.  
Palette: **Dark Noir + Gold**. Type: serif display + sans body.

---

## CSS Design Tokens (`assets/editorial.css`)

```css
:root {
  /* Grounds */
  --ground:   #0f0e0c;   /* near-black page background */
  --panel:    #1d1a16;   /* raised card/section surface */
  --hairline: #34322c;   /* rule lines, borders */

  /* Text */
  --ivory:    #ece6d8;   /* primary body text */
  --ivory-hi: #f6f1e6;   /* high-contrast headings */
  --muted:    #a9a294;   /* captions, secondary labels */

  /* Accent */
  --gold:     #c8a24a;   /* gold accent — large display / decoration only */
  --gold-hi:  #ddb866;   /* hover/active gold */

  /* Typography */
  --display: "Didot","Bodoni MT","Playfair Display",Georgia,"Times New Roman",serif;
  --sans:    "Helvetica Neue",Arial,system-ui,sans-serif;

  /* Layout */
  --maxw: 1280px;
  --gut:  clamp(20px, 5vw, 72px);
}
```

### WCAG AA Notes
- Ivory `#ece6d8` on noir `#0f0e0c` passes AA body contrast
- Gold reserved for **large display text and non-text decoration only** (not small body text)
- Visible focus rings on all interactive elements

---

## Typography Rules
- **Display (serif):** headlines, overlines, pull-quotes, numbered entries
- **Body/labels (sans):** body copy, nav links, spec labels, CTAs, captions
- No external font fetches — bundle stays fully offline
- Serif stack degrades gracefully: Didot → Bodoni MT → Playfair Display → Georgia

---

## Component Patterns

### Masthead
- Sticky, slim fixed header
- Serif `ZELEXDOLL` wordmark + gold hairline underline
- Sans nav links (three editorial versions + brand-style labels)

### Buttons
```css
.btn            /* gold fill, sans uppercase */
.btn--ghost     /* hairline border, ivory text */
```

### Scroll Reveal
```css
.reveal         /* IntersectionObserver fade-in */
```
Gated on `prefers-reduced-motion`. Threshold: 0.15, rootMargin `-60px`.

---

## Three Editorial Versions

### V1 · Gallery Spread (`editorial-spread.html`)
- Asymmetric first screen: tall Aisha portrait + oversized serif statement
- Numbered featured strip (muses 02–05) below fold
- Alternating editorial grid rows with generous margins
- Key classes: `.spread-hero`, `.featured-strip`, `.ed-row`

### V2 · Cover Story (`editorial-cover.html`)
- Full-bleed rotating K-Series product photography (3 frames, 5200ms interval)
- Centered serif ZELEXDOLL masthead over cover
- "In This Issue" slim contents strip → asymmetric editorial muse grid
- Key classes: `.cover`, `.layer`, `.scrim`, `.cover-cap`, `.dots`, `.issue-strip`

### V3 · The Index (`editorial-index.html`)
- Split layout: feature image left / numbered typographic list right
- Hover/focus swaps feature image + spec caption (keyboard-operable)
- Click → scrolls to anchor detail block (no popout)
- Key classes: `.index-split`, `.index-feature`, `.muse-row`

---

## JavaScript Architecture (`assets/editorial.js`)

### `window.MUSES` Array
Single source of truth for all six personas. Each entry:
```js
{
  num, name, tagline,
  portrait,        // assets/I-Series/iseries-*.png
  gallery[3],      // three detail shots
  blurb, world,
  height, weight, cup, model, material,
  tags[]
}
```

### Three Interaction Modules
| Function | Purpose | Version |
|---|---|---|
| `initReveal()` | IntersectionObserver scroll fade | All |
| `initCover()` | Rotating cover (5200ms, gated on REDUCED) | V2 |
| `initIndexSwap()` | Hover/focus image swap | V3 |

`REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches`

---

## Responsive Breakpoints
- **880px** — editorial grids collapse to single column
- **480px** — masthead condenses, type scales down
- Fluid type via `clamp()` where used

---

## Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; animation: none !important; }
  .reveal { opacity: 1; transform: none; }
}
```
Cover rotation and index swap also gated in JS via `REDUCED` flag.
