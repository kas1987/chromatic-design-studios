/** Chromatic Tailwind preset (CommonJS). */
module.exports = {
  "darkMode": "class",
  "theme": {
    "extend": {
      "colors": {
        "background": {
          "default": "var(--color-background-default)",
          "elevated": "var(--color-background-elevated)",
          "overlay": "var(--color-background-overlay)"
        },
        "surface": {
          "default": "var(--color-surface-default)",
          "hover": "var(--color-surface-hover)",
          "active": "var(--color-surface-active)",
          "disabled": "var(--color-surface-disabled)"
        },
        "primary": {
          "50": "var(--color-primary-50)",
          "100": "var(--color-primary-100)",
          "200": "var(--color-primary-200)",
          "300": "var(--color-primary-300)",
          "400": "var(--color-primary-400)",
          "500": "var(--color-primary-500)",
          "600": "var(--color-primary-600)",
          "700": "var(--color-primary-700)",
          "800": "var(--color-primary-800)",
          "900": "var(--color-primary-900)",
          "950": "var(--color-primary-950)"
        },
        "accent": {
          "50": "var(--color-accent-50)",
          "100": "var(--color-accent-100)",
          "200": "var(--color-accent-200)",
          "300": "var(--color-accent-300)",
          "400": "var(--color-accent-400)",
          "500": "var(--color-accent-500)",
          "600": "var(--color-accent-600)",
          "700": "var(--color-accent-700)",
          "800": "var(--color-accent-800)",
          "900": "var(--color-accent-900)",
          "950": "var(--color-accent-950)"
        },
        "text": {
          "primary": "var(--color-text-primary)",
          "secondary": "var(--color-text-secondary)",
          "muted": "var(--color-text-muted)",
          "disabled": "var(--color-text-disabled)",
          "inverse": "var(--color-text-inverse)"
        },
        "border": {
          "default": "var(--color-border-default)",
          "hover": "var(--color-border-hover)",
          "focus": "var(--color-border-focus)",
          "active": "var(--color-border-active)"
        }
      },
      "backgroundImage": {
        "gradient-hero": "var(--gradient-hero)",
        "gradient-holographic": "var(--gradient-holographic)",
        "gradient-glowEdge": "var(--gradient-glowEdge)",
        "gradient-accentSweep": "var(--gradient-accentSweep)"
      },
      "boxShadow": {
        "glow-focus": "var(--glow-focus)",
        "glow-hover": "var(--glow-hover)",
        "glow-card": "var(--glow-card)"
      }
    }
  }
};
