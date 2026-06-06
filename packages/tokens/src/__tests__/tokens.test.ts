import { describe, it, expect } from 'vitest'
import colors from '../colors.json'
import spacing from '../spacing.json'
import typography from '../typography.json'
import motion from '../motion.json'
import effects from '../effects.json'

// ─── helpers ────────────────────────────────────────────────────────────────

const HEX_RE = /^#[0-9a-fA-F]{6}$/
const RGBA_RE = /^rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)$/
const PX_RE = /^-?\d+(\.\d+)?px$/
const MS_RE = /^\d+ms$/
const CUBIC_RE = /^cubic-bezier\([\d., -]+\)$/

function isHex(v: string) { return HEX_RE.test(v) }
function isRgba(v: string) { return RGBA_RE.test(v) }
function isPx(v: string) { return PX_RE.test(v) }
function isMs(v: string) { return MS_RE.test(v) }
function isCubicBezier(v: string) { return CUBIC_RE.test(v) }

function pxToNumber(v: string) { return parseFloat(v.replace('px', '')) }

// ─── colors ─────────────────────────────────────────────────────────────────

describe('colors token', () => {
  it('background values are valid hex', () => {
    for (const [key, val] of Object.entries(colors.background)) {
      expect(isHex(val), `background.${key}: "${val}"`).toBe(true)
    }
  })

  it('surface values are valid hex', () => {
    for (const [key, val] of Object.entries(colors.surface)) {
      expect(isHex(val), `surface.${key}: "${val}"`).toBe(true)
    }
  })

  it('primary scale values are valid hex', () => {
    for (const [key, val] of Object.entries(colors.primary)) {
      expect(isHex(val), `primary.${key}: "${val}"`).toBe(true)
    }
  })

  it('accent scale values are valid hex', () => {
    for (const [key, val] of Object.entries(colors.accent)) {
      expect(isHex(val), `accent.${key}: "${val}"`).toBe(true)
    }
  })

  it('text values are valid hex', () => {
    for (const [key, val] of Object.entries(colors.text)) {
      expect(isHex(val), `text.${key}: "${val}"`).toBe(true)
    }
  })

  it('semantic values are valid hex', () => {
    for (const [key, val] of Object.entries(colors.semantic)) {
      expect(isHex(val), `semantic.${key}: "${val}"`).toBe(true)
    }
  })

  it('border values are valid hex', () => {
    for (const [key, val] of Object.entries(colors.border)) {
      expect(isHex(val), `border.${key}: "${val}"`).toBe(true)
    }
  })

  it('glow values are valid rgba', () => {
    for (const [key, val] of Object.entries(colors.glow)) {
      expect(isRgba(val), `glow.${key}: "${val}"`).toBe(true)
    }
  })

  it('gradient values are CSS gradient strings', () => {
    for (const [key, val] of Object.entries(colors.gradient)) {
      const isGradient = val.startsWith('linear-gradient') || val.startsWith('radial-gradient')
      expect(isGradient, `gradient.${key}: "${val}"`).toBe(true)
    }
  })

  it('primary scale has all expected stops', () => {
    const stops = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
    for (const stop of stops) {
      expect(colors.primary).toHaveProperty(stop)
    }
  })

  it('primary scale lightens toward 50 (lower = lighter)', () => {
    // Very rough check: 50 value should be lighter than 900
    // We compare luminance via a simple hex-to-number comparison isn't perfect,
    // so we just assert the 50 value is a light color (high R+G+B)
    const light = parseInt(colors.primary['50'].slice(1), 16)
    const dark = parseInt(colors.primary['900'].slice(1), 16)
    expect(light).toBeGreaterThan(dark)
  })
})

// ─── spacing ─────────────────────────────────────────────────────────────────

describe('spacing token', () => {
  it('base is "8px"', () => {
    expect(spacing.base).toBe('8px')
  })

  it('all scale values are valid px strings', () => {
    for (const [key, val] of Object.entries(spacing.scale)) {
      expect(isPx(val), `scale.${key}: "${val}"`).toBe(true)
    }
  })

  it('scale values are multiples of 4px (half-base)', () => {
    for (const [key, val] of Object.entries(spacing.scale)) {
      const n = pxToNumber(val)
      expect(n % 4, `scale.${key}: ${n}px is not a multiple of 4`).toBe(0)
    }
  })

  it('scale values are strictly positive', () => {
    for (const [key, val] of Object.entries(spacing.scale)) {
      expect(pxToNumber(val), `scale.${key}`).toBeGreaterThan(0)
    }
  })

  it('semantic gap values are valid px strings', () => {
    for (const [key, val] of Object.entries(spacing.semantic.gap)) {
      expect(isPx(val), `semantic.gap.${key}: "${val}"`).toBe(true)
    }
  })

  it('semantic padding values are valid px strings', () => {
    for (const [key, val] of Object.entries(spacing.semantic.padding)) {
      expect(isPx(val), `semantic.padding.${key}: "${val}"`).toBe(true)
    }
  })

  it('semantic margin values are valid px strings', () => {
    for (const [key, val] of Object.entries(spacing.semantic.margin)) {
      expect(isPx(val), `semantic.margin.${key}: "${val}"`).toBe(true)
    }
  })

  it('semantic radius values are valid px strings', () => {
    for (const [key, val] of Object.entries(spacing.semantic.radius)) {
      expect(isPx(val), `semantic.radius.${key}: "${val}"`).toBe(true)
    }
  })

  it('scale values increase monotonically', () => {
    const values = Object.values(spacing.scale).map(pxToNumber)
    for (let i = 1; i < values.length; i++) {
      expect(values[i], `scale[${i}] should be > scale[${i - 1}]`).toBeGreaterThan(values[i - 1])
    }
  })
})

// ─── typography ──────────────────────────────────────────────────────────────

describe('typography token', () => {
  it('has the three required font families', () => {
    expect(typography.family).toHaveProperty('heading')
    expect(typography.family).toHaveProperty('body')
    expect(typography.family).toHaveProperty('mono')
    expect(typeof typography.family.heading).toBe('string')
    expect(typeof typography.family.body).toBe('string')
    expect(typeof typography.family.mono).toBe('string')
  })

  it('every scale entry has required fields', () => {
    for (const [name, entry] of Object.entries(typography.scale)) {
      expect(entry, `scale.${name}`).toHaveProperty('size')
      expect(entry, `scale.${name}`).toHaveProperty('rem')
      expect(entry, `scale.${name}`).toHaveProperty('lineHeight')
      expect(entry, `scale.${name}`).toHaveProperty('letterSpacing')
    }
  })

  it('size values in scale are valid px strings', () => {
    for (const [name, entry] of Object.entries(typography.scale)) {
      expect(isPx(entry.size), `scale.${name}.size: "${entry.size}"`).toBe(true)
    }
  })

  it('rem values are consistent with px sizes (base: 1rem = 16px)', () => {
    for (const [name, entry] of Object.entries(typography.scale)) {
      const px = pxToNumber(entry.size)
      const expectedRem = px / 16
      const actualRem = parseFloat(entry.rem.replace('rem', ''))
      expect(Math.abs(actualRem - expectedRem), `scale.${name}: ${px}px should be ${expectedRem}rem, got ${entry.rem}`).toBeLessThan(0.001)
    }
  })

  it('weight values are valid CSS font-weight integers', () => {
    const validWeights = new Set([100, 200, 300, 400, 500, 600, 700, 800, 900])
    for (const [name, weight] of Object.entries(typography.weight)) {
      expect(validWeights.has(weight as number), `weight.${name}: ${weight}`).toBe(true)
    }
  })

  it('role references resolve to existing scale entries', () => {
    const scaleKeys = new Set(Object.keys(typography.scale))
    for (const [role, def] of Object.entries(typography.role)) {
      expect(scaleKeys.has(def.size), `role.${role}.size "${def.size}" not in scale`).toBe(true)
    }
  })

  it('role references resolve to existing weight entries', () => {
    const weightKeys = new Set(Object.keys(typography.weight))
    for (const [role, def] of Object.entries(typography.role)) {
      expect(weightKeys.has(def.weight), `role.${role}.weight "${def.weight}" not in weight map`).toBe(true)
    }
  })

  it('lineHeight values in scale are positive numbers', () => {
    for (const [name, entry] of Object.entries(typography.scale)) {
      const lh = parseFloat(String(entry.lineHeight))
      expect(lh, `scale.${name}.lineHeight`).toBeGreaterThan(0)
    }
  })

  it('font-size scale increases from xs to 4xl', () => {
    const order = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'] as const
    const sizes = order.map(k => pxToNumber(typography.scale[k].size))
    for (let i = 1; i < sizes.length; i++) {
      expect(sizes[i], `${order[i]} should be larger than ${order[i - 1]}`).toBeGreaterThan(sizes[i - 1])
    }
  })
})

// ─── motion ──────────────────────────────────────────────────────────────────

describe('motion token', () => {
  it('duration values are valid ms strings', () => {
    for (const [key, val] of Object.entries(motion.duration)) {
      expect(isMs(val), `duration.${key}: "${val}"`).toBe(true)
    }
  })

  it('duration values are positive', () => {
    for (const [key, val] of Object.entries(motion.duration)) {
      expect(parseInt(val), `duration.${key}`).toBeGreaterThan(0)
    }
  })

  it('duration order: fast < normal < slow', () => {
    const fast = parseInt(motion.duration.fast)
    const normal = parseInt(motion.duration.normal)
    const slow = parseInt(motion.duration.slow)
    expect(fast).toBeLessThan(normal)
    expect(normal).toBeLessThan(slow)
  })

  it('easing values are valid cubic-bezier strings', () => {
    for (const [key, val] of Object.entries(motion.easing)) {
      expect(isCubicBezier(val), `easing.${key}: "${val}"`).toBe(true)
    }
  })

  it('cubic-bezier x-parameters (P1x, P2x) are in [0, 1]', () => {
    for (const [key, val] of Object.entries(motion.easing)) {
      const inner = val.replace('cubic-bezier(', '').replace(')', '')
      const [p1x, , p2x] = inner.split(',').map(s => parseFloat(s.trim()))
      expect(p1x, `easing.${key} P1x`).toBeGreaterThanOrEqual(0)
      expect(p1x, `easing.${key} P1x`).toBeLessThanOrEqual(1)
      expect(p2x, `easing.${key} P2x`).toBeGreaterThanOrEqual(0)
      expect(p2x, `easing.${key} P2x`).toBeLessThanOrEqual(1)
    }
  })

  it('rule flags are booleans', () => {
    for (const [key, val] of Object.entries(motion.rule)) {
      expect(typeof val, `rule.${key}`).toBe('boolean')
    }
  })

  it('respectReducedMotion is true', () => {
    expect(motion.rule.respectReducedMotion).toBe(true)
  })
})

// ─── effects ─────────────────────────────────────────────────────────────────

describe('effects token', () => {
  it('intensity values are valid box-shadow partial strings', () => {
    for (const [key, val] of Object.entries(effects.intensity)) {
      // format: "0 0 Npx"
      expect(val, `intensity.${key}`).toMatch(/^0 0 \d+px$/)
    }
  })

  it('intensity sizes increase: sm < md < lg < xl', () => {
    const order = ['sm', 'md', 'lg', 'xl'] as const
    const sizes = order.map(k => parseInt(effects.intensity[k].split(' ')[2]))
    for (let i = 1; i < sizes.length; i++) {
      expect(sizes[i], `intensity.${order[i]} should be > ${order[i - 1]}`).toBeGreaterThan(sizes[i - 1])
    }
  })

  it('color values are valid rgba strings', () => {
    for (const [key, val] of Object.entries(effects.color)) {
      expect(isRgba(val), `color.${key}: "${val}"`).toBe(true)
    }
  })

  it('color alpha values are between 0 and 1', () => {
    for (const [key, val] of Object.entries(effects.color)) {
      const alpha = parseFloat(val.split(',')[3])
      expect(alpha, `color.${key} alpha`).toBeGreaterThan(0)
      expect(alpha, `color.${key} alpha`).toBeLessThanOrEqual(1)
    }
  })

  it('*Strong variants have higher alpha than base variants', () => {
    const pairs = [
      ['primary', 'primaryStrong'],
      ['accent', 'accentStrong'],
      ['white', 'whiteStrong'],
    ] as const
    for (const [base, strong] of pairs) {
      const baseAlpha = parseFloat(effects.color[base].split(',')[3])
      const strongAlpha = parseFloat(effects.color[strong].split(',')[3])
      expect(strongAlpha, `${strong} should have higher alpha than ${base}`).toBeGreaterThan(baseAlpha)
    }
  })

  it('preset values are non-empty strings', () => {
    for (const [key, val] of Object.entries(effects.preset)) {
      expect(typeof val, `preset.${key}`).toBe('string')
      expect(val.length, `preset.${key} should not be empty`).toBeGreaterThan(0)
    }
  })
})

// ─── index exports ────────────────────────────────────────────────────────────

describe('token package exports', () => {
  it('re-exports all token categories', async () => {
    const exports = await import('../../index')
    expect(exports).toHaveProperty('colors')
    expect(exports).toHaveProperty('spacing')
    expect(exports).toHaveProperty('typography')
    expect(exports).toHaveProperty('motion')
    expect(exports).toHaveProperty('effects')
  })

  it('exported objects are non-empty', async () => {
    const { colors, spacing, typography, motion, effects } = await import('../../index')
    expect(Object.keys(colors).length).toBeGreaterThan(0)
    expect(Object.keys(spacing).length).toBeGreaterThan(0)
    expect(Object.keys(typography).length).toBeGreaterThan(0)
    expect(Object.keys(motion).length).toBeGreaterThan(0)
    expect(Object.keys(effects).length).toBeGreaterThan(0)
  })
})
