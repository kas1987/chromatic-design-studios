# Demo Hero Page — Chromatic Design Studios

## Live Example

Open `hero-demo.html` in a browser to see the hero component rendered with full tokens, CSS, and effects.

## HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chromatic Design Studios — Hero Demo</title>
  <link rel="stylesheet" href="../../04_css_library/chromatic-base.css">
  <link rel="stylesheet" href="../../04_css_library/chromatic-layout.css">
  <link rel="stylesheet" href="../../04_css_library/chromatic-components.css">
  <link rel="stylesheet" href="../../04_css_library/chromatic-effects.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet">
</head>
<body>

  <section class="chromatic-hero chromatic-hero-gradient chromatic-aurora chromatic-section-xl">
    <div class="chromatic-container">
      <div class="chromatic-flex-col chromatic-flex-gap-5">

        <!-- Badge -->
        <span class="chromatic-badge chromatic-badge-primary">
          Design System v0.1
        </span>

        <!-- Headline -->
        <h1 class="chromatic-text-glow" style="font-family: var(--font-heading); font-size: var(--text-4xl); font-weight: var(--weight-bold); line-height: 1.1; letter-spacing: -0.02em; color: var(--color-text-primary);">
          Chromatic Studios
        </h1>

        <!-- Subheadline -->
        <p style="font-family: var(--font-body); font-size: var(--text-lg); font-weight: var(--weight-normal); line-height: 1.6; color: var(--color-text-secondary); max-width: 60ch;">
          Governed design operations for the Chromatic Harness ecosystem.
          Build beautiful, coherent, testable design assets from minimal user input.
        </p>

        <!-- CTA Group -->
        <div class="chromatic-flex chromatic-flex-gap-4" style="flex-wrap: wrap;">
          <button class="chromatic-button chromatic-button-primary">
            Explore Tokens
          </button>
          <button class="chromatic-button chromatic-button-ghost">
            View Prompts
          </button>
        </div>

      </div>
    </div>
  </section>

  <!-- Decorative floating card (desktop only) -->
  <div
    class="chromatic-card chromatic-card-glass"
    style="
      position: absolute;
      top: 15%;
      right: 10%;
      width: 280px;
      height: 180px;
      display: none;
    "
  >
    <div style="padding: var(--space-4);">
      <p style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-muted);">
        tokens.colors.json
      </p>
      <pre style="margin-top: var(--space-3); font-size: var(--text-xs); color: var(--color-accent-300);">
{
  "primary": "#7c3aed",
  "accent": "#06b6d4"
}
      </pre>
    </div>
  </div>

  <script>
    // Show floating card on large screens
    if (window.innerWidth >= 1024) {
      document.querySelector('.chromatic-card-glass').style.display = 'block';
    }
  </script>

</body>
</html>
```

## CSS Overrides for Demo

Add this inside a `<style>` tag in the HTML head for the demo-specific layout:

```css
.chromatic-hero {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.chromatic-hero .chromatic-container {
  position: relative;
  z-index: 1;
}

/* Decorative background orb */
.chromatic-hero::before {
  content: '';
  position: absolute;
  top: -20%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

/* Secondary orb */
.chromatic-hero::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -20%;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}
```

## Token Verification

| Property | Token Used | Verified |
|----------|-----------|----------|
| Background | gradient.hero + aurora | ✅ |
| Headline font | font.heading + text.4xl + weight.bold | ✅ |
| Headline color | color.text.primary | ✅ |
| Subheadline font | font.body + text.lg | ✅ |
| Subheadline color | color.text.secondary | ✅ |
| Primary CTA BG | color.primary.600 | ✅ |
| Ghost CTA border | color.border | ✅ |
| Badge style | badge-primary | ✅ |
| Section padding | space.9 | ✅ |
| Content gap | space.5 | ✅ |
| CTA gap | space.4 | ✅ |
| Floating card | card-glass | ✅ |

## Notes

- This demo uses inline `style` attributes for demonstration clarity.
- In production, prefer class-based CSS as defined in `chromatic-components.css` and `chromatic-effects.css`.
- The floating decorative card is hidden on mobile (`display: none` below 1024px).
- Background orbs are decorative and do not interfere with content readability.
