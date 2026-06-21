"use client";

import * as React from "react";
import { Button, Card, Badge, Input } from "@chromatic/ui";

const PRIMARY_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
const DEFAULT_PRIMARY: Record<(typeof PRIMARY_STEPS)[number], string> = {
  50: "#f5f3ff",
  100: "#ede9fe",
  200: "#ddd6fe",
  300: "#c4b5fd",
  400: "#a78bfa",
  500: "#8b5cf6",
  600: "#7c3aed",
  700: "#6d28d9",
  800: "#5b21b6",
  900: "#4c1d95",
  950: "#2e1065",
};

function shadeMix(h: number, s: number, l: number): string {
  // Simple HSL → hex; uses the same lightness curve as the canonical violet ramp.
  const a = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = s / 100;
    const x = c * Math.min(l / 100, 1 - l / 100);
    return Math.round(255 * (l / 100 - x * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)))));
  };
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(a(0))}${toHex(a(8))}${toHex(a(4))}`;
}

export function Playground() {
  const [hue, setHue] = React.useState(263);
  const [sat, setSat] = React.useState(83);
  const [light, setLight] = React.useState(58);

  const ramp = React.useMemo(
    () =>
      PRIMARY_STEPS.map((step) => {
        const lAdj = Math.max(8, Math.min(96, light + (50 - step) * 0.6));
        return { step, value: shadeMix(hue, sat, lAdj) };
      }),
    [hue, sat, light],
  );

  // Apply the chosen 600 as the active primary CSS var so the live UI shifts.
  React.useEffect(() => {
    const root = document.documentElement;
    PRIMARY_STEPS.forEach((step) => {
      const v = ramp.find((r) => r.step === step)!.value;
      root.style.setProperty(`--color-primary-${step}`, v);
    });
    return () => {
      PRIMARY_STEPS.forEach((step) => {
        root.style.removeProperty(`--color-primary-${step}`);
      });
    };
  }, [ramp]);

  return (
    <div className="space-y-4">
      <Card title="Primary scale">
        <div className="space-y-3 font-mono text-xs text-text-secondary">
          <label className="flex items-center justify-between gap-3">
            <span>Hue</span>
            <input
              type="range"
              min={0}
              max={360}
              value={hue}
              onChange={(e) => setHue(Number(e.target.value))}
              aria-label="Primary hue"
              className="flex-1"
            />
            <span className="w-12 text-right text-text-primary">{hue}°</span>
          </label>
          <label className="flex items-center justify-between gap-3">
            <span>Saturation</span>
            <input
              type="range"
              min={0}
              max={100}
              value={sat}
              onChange={(e) => setSat(Number(e.target.value))}
              aria-label="Primary saturation"
              className="flex-1"
            />
            <span className="w-12 text-right text-text-primary">{sat}%</span>
          </label>
          <label className="flex items-center justify-between gap-3">
            <span>Base lightness</span>
            <input
              type="range"
              min={20}
              max={80}
              value={light}
              onChange={(e) => setLight(Number(e.target.value))}
              aria-label="Primary lightness"
              className="flex-1"
            />
            <span className="w-12 text-right text-text-primary">{light}%</span>
          </label>
        </div>
      </Card>

      <Card title="Live ramp">
        <div className="grid grid-cols-11 gap-1">
          {ramp.map((r) => (
            <div key={r.step} className="space-y-1">
              <div
                className="h-8 rounded"
                style={{ background: r.value }}
                aria-hidden
              />
              <div className="text-center font-mono text-[10px] text-text-muted">
                {r.step}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Live preview">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary">Primary</Button>
            <Button variant="ghost">Ghost</Button>
            <Badge tone="primary">Tone</Badge>
            <Badge tone="success">Success</Badge>
            <Badge tone="warning">Warning</Badge>
          </div>
          <Input label="Sample input" placeholder="token-driven" />
        </div>
      </Card>

      <Card>
        <p className="font-mono text-xs text-text-muted">
          Defaults restored when you navigate away. Use the companion script to persist.
        </p>
      </Card>
    </div>
  );
}
