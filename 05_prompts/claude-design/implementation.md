# Claude Design Implementation Prompt — Chromatic Design Studios

## Bridge Prompt for Claude Design

Copy and paste the following into Claude Design when starting a new UI implementation task. This prompt provides the full design system context, token values, and constraints so Claude can build consistently with the Chromatic visual language.

---

```
You are building a UI component for the Chromatic Design System.

## Project Context
- Design system: Chromatic Design Studios v0.1
- Visual direction: cosmic, holographic, luminous, premium, modular
- Default theme: dark (Deep Void background)
- Framework: plain HTML + CSS (no React dependency for MVP)

## Token Values (Current)

### Colors
- Background: #0a0a0f
- Surface: #12121a
- Surface Elevated: #1a1a2e
- Primary (Violet): #7c3aed
- Primary Glow: #a78bfa
- Accent (Cyan): #06b6d4
- Accent Glow: #67e8f9
- Text Primary: #f8fafc
- Text Secondary: #94a3b8
- Text Muted: #475569
- Border: #1e293b
- Border Focus: #7c3aed
- Success: #22c55e
- Warning: #f59e0b
- Error: #ef4444

### Typography
- Headings: Inter (weights 600, 700)
- Body: IBM Plex Sans (weight 400)
- Mono: IBM Plex Mono
- Scale: xs=12px, sm=14px, base=16px, lg=18px, xl=24px, 2xl=30px, 3xl=36px, 4xl=48px
- Line heights: tight=1.2, normal=1.5, relaxed=1.6

### Spacing
- Base unit: 8px
- Scale: 1=4px, 2=8px, 3=12px, 4=16px, 5=24px, 6=32px, 7=48px, 8=64px, 9=96px

### Motion
- Fast: 150ms
- Normal: 300ms
- Slow: 500ms
- Easing (out): cubic-bezier(0.33, 1, 0.68, 1)

### Glow
- Small: 0 0 8px
- Medium: 0 0 16px
- Large: 0 0 32px
- Primary color: rgba(124,58,237,0.4)
- Accent color: rgba(6,182,212,0.4)

## Layout Constraints
- Container max-width: 1280px
- Responsive breakpoints: sm=640px, md=768px, lg=1024px, xl=1280px
- Grid: use 8px base grid for all spacing
- Prefer CSS Grid for layouts, Flexbox for component internals

## Component Rules
1. All colors must reference the token values above. No hardcoded colors.
2. Use CSS custom properties from chromatic-base.css.
3. Buttons: uppercase label, 12px letter-spacing, rounded-md, glow on hover.
4. Cards: surface background, border radius 12px, subtle glow on hover.
5. Inputs: background background color, border 1px solid border color, glow focus ring.
6. Respect prefers-reduced-motion.
7. Use transform and opacity for animations. Never animate width/height.

## QA Rules
- Verify every color is from the token list
- Verify spacing is a multiple of 8px (or 4px for tight internals)
- Verify no more than 2 font families are used
- Verify focus states are visible and use glow-primary
- Verify hover states have smooth transitions (150-300ms)
- Verify no decorative motion that doesn't serve UX

## Output Format
Produce:
1. HTML file with semantic markup
2. CSS file using the Chromatic token custom properties
3. Brief QA checklist confirming the rules above
```

---

## Usage Notes

- Paste this as the first message in a Claude Design session
- Replace `[component description]` with the specific UI to build
- If building a component from `03_components/`, include the component spec file content
- For responsive behavior, reference the breakpoints in Layout Constraints
- The QA Rules section at the end ensures Claude self-validates before finishing
