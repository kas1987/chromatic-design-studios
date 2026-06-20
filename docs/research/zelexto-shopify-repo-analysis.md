# zelexto-shopify Repo Analysis

> Repo: https://github.com/akashkottil/zelexto-shopify/tree/main  
> Reviewed: 2026-06-05

---

## ⚠️ Identity Caveat

The repo name is `zelexto-shopify` (not `zelex`), authored by `akashkottil`.  
The theme is **heavily India-centric**: Razorpay, COD, GST/GSTIN, INR/lakh formatting, Hindi + Arabic locales, "Designed in India. Built for the world" homepage copy.

zelexdoll.com (the doll brand we're building for) is a **Chinese manufacturer**, not an Indian DTC brand. These are likely **different companies**:

| | This repo | Our target |
|---|---|---|
| Brand | "Zelexto" | "ZELEXDOLL" |
| Market | India-first | Global / US |
| Payment | Razorpay, UPI, COD | Standard Shopify |
| Currency | INR, lakh format | USD |

**Treat as architectural reference only — not brand source-of-truth for Zelex dolls.**

---

## What It Is

A **fully custom, from-scratch Shopify theme** — not Dawn, not any base theme.  
Built by a single contractor. Zero build tooling (no webpack, no Vite, no SCSS).

| Dimension | Detail |
|---|---|
| Stack | Vanilla JS + Liquid + hand-written CSS |
| Scale | 60+ sections, 61 snippets, 47 assets |
| JS architecture | Event-bus pub/sub, lazy-loaded ES modules |
| Animation | Custom parallax engine (GPU transforms, rAF, IntersectionObserver) |
| CSS | Utility-first, custom properties, Apple-aesthetic |
| Locales | English, Hindi, Arabic |
| Analytics | GA4, GTM, Meta Pixel, Klaviyo |
| India payments | Razorpay, UPI, Cards, Wallets, EMI, COD |
| India compliance | GSTIN, HSN codes, GST state defaults, pincode validation |

---

## Homepage Narrative Structure (9 sections)
1. Hero — dark cinematic banner + dual CTAs
2. Marquee — featured-in logos (Vogue, Wired, Forbes, etc.)
3–5. Feature Rows (×3) — alternating image-text (Materials, Engineering, Design)
6. Product Spotlight — "The flagship" dark section showcase
7. Categories Grid — 4-column collections grid
8. Image with Text — brand story block
9. Testimonials → FAQ → Newsletter

---

## Product Page (Apple-style PDP)
- Breadcrumbs, media gallery, pricing, variant swatches, qty, ATC
- Payment badges (UPI, Cards, Wallets, COD, EMI)
- Pincode/COD availability checker
- Low stock alerts + countdown timers
- Sticky mobile ATC bar
- Collapsible accordion (description, shipping, returns, size)
- "You might also like" + "Pairs well" complementary products

---

## What's Transferable to zelexdoll.com Work

**Directly applicable:**
- Parallax engine pattern (same IntersectionObserver + rAF + GPU transform approach we used)
- Section isolation architecture (data-module lazy loading)
- Event bus for cart/section communication
- CSS design token structure (custom properties for colors, type, spacing, motion)
- Critical CSS inline pattern
- `settings_schema.json` pattern for theme editor customization

**Not applicable (India-specific):**
- Razorpay / payment method selectors
- Pincode validation
- GSTIN/HSN fields
- INR/lakh formatting
- Hindi/Arabic locales
- COD workflow

---

## Files Worth Reading If Rebuilding Zelex Storefront
```
layout/theme.liquid              — master template
config/settings_schema.json      — full customization surface
assets/theme.js                  — event bus + module loader
assets/parallax-engine.js        — scroll animation engine
assets/base.css                  — design system tokens
assets/motion.css                — animation definitions
sections/story-hero.liquid       — cinematic hero pattern
sections/story-parallax.liquid   — parallax section structure
sections/main-collection.liquid  — collection filtering
snippets/product-card.liquid     — product card component
locales/en.default.json          — copy/branding language
```
