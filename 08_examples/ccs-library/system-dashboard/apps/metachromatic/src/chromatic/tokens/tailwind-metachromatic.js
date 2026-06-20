/**
 * MetaChromatic Tailwind Plugin
 * Extends Tailwind with custom utilities for Controlled Radiance design system
 */

const plugin = require('tailwindcss/plugin');

module.exports = plugin(
  function ({ addUtilities, addComponents, theme }) {
    // ========================================================================
    // Glass Utilities
    // ========================================================================
    addUtilities({
      '.glass': {
        background: 'var(--panel)',
        border: '1px solid var(--border)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      },
      '.glass-a': {
        background: 'var(--panel)',
        border: '1px solid var(--border)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: '10',
      },
      '.glass-b': {
        background: 'rgba(18, 22, 28, 0.7)',
        border: '1px solid var(--border)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: '20',
      },
      '.glass-c': {
        background: 'rgba(18, 22, 28, 0.85)',
        border: '1px solid rgba(199, 206, 216, 0.25)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: '30',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
    });

    // ========================================================================
    // Radiant Text Utilities
    // ========================================================================
    addUtilities({
      '.radiant': {
        background: 'linear-gradient(135deg, var(--a) 0%, var(--b) 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        MozBackgroundClip: 'text',
        MozTextFillColor: 'transparent',
      },
      '.radiant-subtle': {
        background:
          'linear-gradient(135deg, color-mix(in srgb, var(--a) 60%, var(--text)) 0%, color-mix(in srgb, var(--b) 60%, var(--text)) 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      },
    });

    // ========================================================================
    // Glow Utilities (R0-R3)
    // ========================================================================
    addUtilities({
      '.glow-r0': {
        textShadow: 'none',
      },
      '.glow-r1': {
        textShadow:
          '0 0 10px color-mix(in srgb, var(--a) 35%, transparent), 0 0 20px color-mix(in srgb, var(--b) 25%, transparent)',
      },
      '.glow-r2': {
        textShadow:
          '0 0 14px color-mix(in srgb, var(--a) 55%, transparent), 0 0 22px color-mix(in srgb, var(--b) 40%, transparent)',
      },
      '.glow-r3': {
        textShadow:
          '0 0 20px color-mix(in srgb, var(--a) 70%, transparent), 0 0 30px color-mix(in srgb, var(--b) 60%, transparent), 0 0 45px color-mix(in srgb, var(--a) 40%, transparent)',
      },
    });

    // ========================================================================
    // Button Glow Utilities
    // ========================================================================
    addUtilities({
      '.btn-glow-r1': {
        boxShadow:
          '0 4px 16px color-mix(in srgb, var(--a) 25%, transparent), 0 0 8px color-mix(in srgb, var(--b) 20%, transparent)',
      },
      '.btn-glow-r2': {
        boxShadow:
          '0 6px 24px color-mix(in srgb, var(--a) 35%, transparent), 0 0 12px color-mix(in srgb, var(--b) 30%, transparent)',
      },
    });

    // ========================================================================
    // Focus Ring Utilities
    // ========================================================================
    addUtilities({
      '.focus-ring': {
        outline: '2px solid var(--focus)',
        outlineOffset: '2px',
      },
      '.focus-ring-inner': {
        boxShadow:
          'inset 0 0 0 2px var(--focus), 0 0 8px color-mix(in srgb, var(--a) 30%, transparent)',
      },
    });

    // ========================================================================
    // Radiance Decay Animation
    // ========================================================================
    addUtilities({
      '.radiant-decay': {
        animation: 'radianceDecay 10s ease-out forwards',
      },
      '@keyframes radianceDecay': {
        '0%': {
          textShadow:
            '0 0 14px color-mix(in srgb, var(--a) 55%, transparent), 0 0 22px color-mix(in srgb, var(--b) 40%, transparent)',
        },
        '100%': {
          textShadow: 'none',
        },
      },
    });

    // ========================================================================
    // Mode Gradient Backgrounds
    // ========================================================================
    addUtilities({
      '.bg-mode-gradient': {
        background: 'linear-gradient(135deg, var(--a) 0%, var(--b) 100%)',
      },
      '.bg-mode-gradient-subtle': {
        background:
          'linear-gradient(135deg, color-mix(in srgb, var(--a) 15%, transparent) 0%, color-mix(in srgb, var(--b) 10%, transparent) 100%)',
      },
    });

    // ========================================================================
    // Components
    // ========================================================================
    addComponents({
      '.btn': {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '10px 20px',
        fontSize: '14px',
        fontWeight: '500',
        borderRadius: 'var(--radius)',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 150ms ease',
        fontFamily: 'inherit',
      },
      '.btn-primary': {
        background: 'linear-gradient(135deg, var(--a) 0%, var(--b) 100%)',
        color: '#FFFFFF',
        boxShadow:
          '0 4px 16px color-mix(in srgb, var(--a) 25%, transparent), 0 0 8px color-mix(in srgb, var(--b) 20%, transparent)',
        '&:hover': {
          boxShadow:
            '0 6px 24px color-mix(in srgb, var(--a) 35%, transparent), 0 0 12px color-mix(in srgb, var(--b) 30%, transparent)',
          transform: 'translateY(-1px)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        '&:disabled': {
          opacity: '0.5',
          cursor: 'not-allowed',
          transform: 'none',
        },
      },
      '.btn-secondary': {
        background: 'transparent',
        color: 'var(--mercury)',
        border: '1.5px solid var(--mercury)',
        '&:hover': {
          background: 'rgba(199, 206, 216, 0.1)',
          borderColor: '#FFFFFF',
        },
        '&:active': {
          background: 'rgba(199, 206, 216, 0.15)',
        },
        '&:disabled': {
          opacity: '0.4',
          cursor: 'not-allowed',
        },
      },
      '.btn-ghost': {
        background: 'transparent',
        color: 'var(--text)',
        '&:hover': {
          background: 'rgba(199, 206, 216, 0.08)',
        },
        '&:active': {
          background: 'rgba(199, 206, 216, 0.12)',
        },
      },
      '.btn-danger': {
        background: 'var(--error)',
        color: '#FFFFFF',
        '&:hover': {
          background: '#DC2626',
        },
        '&:active': {
          background: '#B91C1C',
        },
        '&:disabled': {
          opacity: '0.5',
          cursor: 'not-allowed',
        },
      },
    });
  },
  {
    theme: {
      extend: {
        colors: {
          // Neutrals
          obsidian: {
            DEFAULT: '#0A0A0F',
            light: '#0D0D12',
          },
          graphite: {
            DEFAULT: '#12161C',
            light: '#1A1E24',
          },
          mercury: {
            DEFAULT: '#A8A8B2',
            dark: '#8B8B95',
            light: '#C7CED8',
          },

          // Mode Gradients (use CSS variables in components)
          'mode-browse-a': '#35d6ff',
          'mode-browse-b': '#8b5cff',
          'mode-tag-a': '#8b5cff',
          'mode-tag-b': '#ff4fd8',
          'mode-review-a': '#2ee59d',
          'mode-review-b': '#35d6ff',
          'mode-export-a': '#ffcc3a',
          'mode-export-b': '#ff4fd8',

          // Functional
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        },
        borderRadius: {
          sm: '6px',
          DEFAULT: '8px',
          md: '10px',
          lg: '12px',
          xl: '14px',
        },
        fontFamily: {
          sans: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
          mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
        },
        fontSize: {
          '2xs': ['10px', { lineHeight: '14px' }],
          xs: ['12px', { lineHeight: '16px' }],
          sm: ['13px', { lineHeight: '18px' }],
          base: ['14px', { lineHeight: '20px' }],
          lg: ['16px', { lineHeight: '24px' }],
          xl: ['18px', { lineHeight: '28px' }],
          '2xl': ['20px', { lineHeight: '30px' }],
          '3xl': ['24px', { lineHeight: '32px' }],
          '4xl': ['28px', { lineHeight: '36px' }],
          '5xl': ['32px', { lineHeight: '40px' }],
        },
        backdropBlur: {
          xs: '4px',
          sm: '8px',
          DEFAULT: '12px',
          md: '16px',
          lg: '20px',
          xl: '24px',
        },
      },
    },
  }
);
