import Link from "next/link";
import { Badge, Card } from "@chromatic/ui";
import { ThemeToggle } from "../../components/ThemeToggle";

export const metadata = {
  title: "Tokens — Chromatic Design System",
  description:
    "Explore the Chromatic token system — colors, spacing, typography, motion, and glow. Every primitive resolves to a JSON source of truth.",
};

// Token families mirrored from 02_design_tokens/*.json. These are visual
// representations only — the canonical values live in the JSON files and
// are emitted into CSS vars by scripts/build-tokens.mjs.
const COLOR_RAMP = [
  { name: "50", value: "#f5f3ff" },
  { name: "100", value: "#ede9fe" },
  { name: "200", value: "#ddd6fe" },
  { name: "300", value: "#c4b5fd" },
  { name: "400", value: "#a78bfa" },
  { name: "500", value: "#8b5cf6" },
  { name: "600", value: "#7c3aed" },
  { name: "700", value: "#6d28d9" },
  { name: "800", value: "#5b21b6" },
  { name: "900", value: "#4c1d95" },
  { name: "950", value: "#2e1065" },
];

const ACCENT_RAMP = [
  { name: "50", value: "#ecfeff" },
  { name: "100", value: "#cffafe" },
  { name: "200", value: "#a5f3fc" },
  { name: "300", value: "#67e8f9" },
  { name: "400", value: "#22d3ee" },
  { name: "500", value: "#06b6d4" },
  { name: "600", value: "#0891b2" },
  { name: "700", value: "#0e7490" },
  { name: "800", value: "#155e75" },
  { name: "900", value: "#164e63" },
  { name: "950", value: "#083344" },
];

const SEMANTIC = [
  { name: "success", value: "#22c55e" },
  { name: "warning", value: "#f59e0b" },
  { name: "error", value: "#ef4444" },
  { name: "info", value: "#3b82f6" },
];

const SPACING_SCALE = [
  { name: "0", rem: "0" },
  { name: "1", rem: "0.25rem" },
  { name: "2", rem: "0.5rem" },
  { name: "3", rem: "0.75rem" },
  { name: "4", rem: "1rem" },
  { name: "5", rem: "1.5rem" },
  { name: "6", rem: "2rem" },
  { name: "7", rem: "2.5rem" },
  { name: "8", rem: "3rem" },
  { name: "9", rem: "6rem" },
];

const TYPE_SCALE = [
  { name: "xs", size: "0.75rem" },
  { name: "sm", size: "0.875rem" },
  { name: "base", size: "1rem" },
  { name: "lg", size: "1.125rem" },
  { name: "xl", size: "1.5rem" },
  { name: "2xl", size: "1.875rem" },
  { name: "3xl", size: "2.25rem" },
  { name: "4xl", size: "3rem" },
];

function Nav() {
  return (
    <header className="glass sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-gradient-accentSweep" />
          <span className="font-heading font-semibold tracking-tight text-text-primary">
            Chromatic Design Studios
          </span>
        </Link>
        <nav aria-label="Primary" className="hidden gap-6 text-sm text-text-secondary md:flex">
          <Link href="/components" className="hover:text-text-primary">Components</Link>
          <Link href="/tokens" className="text-text-primary">Tokens</Link>
          <Link href="/examples" className="hover:text-text-primary">Examples</Link>
          <Link href="/playground" className="hover:text-text-primary">Playground</Link>
          <Link href="/studio" className="hover:text-text-primary">Studio</Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="glass mt-auto">
      <div className="mx-auto flex max-w-6xl justify-between px-6 py-4 text-xs text-text-muted">
        <span>Chromatic Design Studios v0.4.0</span>
        <span className="font-mono">02_design_tokens/</span>
      </div>
    </footer>
  );
}

function Swatch({
  name,
  value,
}: {
  name: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-border-default bg-background-elevated p-3">
      <div
        className="mb-2 h-12 w-full rounded"
        style={{
          background: value,
          border: "1px solid var(--color-border-default)",
        }}
        aria-hidden
      />
      <div className="flex items-baseline justify-between font-mono text-xs">
        <span className="text-text-primary">{name}</span>
        <span className="text-text-muted">{value}</span>
      </div>
    </div>
  );
}

export default function TokensPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="fixed inset-0 -z-10 bg-background-default">
        <div className="absolute inset-0 bg-gradient-holographic" />
      </div>

      <Nav />

      <main id="main" className="mx-auto w-full max-w-6xl flex-1 space-y-12 px-6 py-12">
        <header className="space-y-3">
          <Badge tone="primary">Source of truth</Badge>
          <h1 className="font-heading text-4xl font-bold text-text-primary glow-text">
            Design tokens
          </h1>
          <p className="max-w-2xl font-body text-lg text-text-secondary">
            Six JSON files in <code className="font-mono text-text-primary">02_design_tokens/</code>{" "}
            compile to CSS variables and a Tailwind theme via{" "}
            <code className="font-mono text-text-primary">scripts/build-tokens.mjs</code>.
            Toggle light/dark to see the alternate ramp — both live in version control.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold text-text-primary">
            Primary (violet)
          </h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-11">
            {COLOR_RAMP.map((c) => (
              <Swatch key={c.name} name={c.name} value={c.value} />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold text-text-primary">
            Accent (cyan)
          </h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-11">
            {ACCENT_RAMP.map((c) => (
              <Swatch key={c.name} name={c.name} value={c.value} />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold text-text-primary">
            Semantic
          </h2>
          <div className="grid gap-3 sm:grid-cols-4">
            {SEMANTIC.map((c) => (
              <Swatch key={c.name} name={c.name} value={c.value} />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold text-text-primary">
            Spacing (8px grid)
          </h2>
          <Card>
            <ul className="space-y-2">
              {SPACING_SCALE.map((s) => (
                <li key={s.name} className="flex items-center gap-4 font-mono text-sm">
                  <span className="w-12 text-text-muted">{s.name}</span>
                  <span
                    className="block rounded bg-primary-600"
                    style={{ width: s.rem, height: "0.75rem" }}
                    aria-hidden
                  />
                  <span className="text-text-primary">{s.rem}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold text-text-primary">
            Typography
          </h2>
          <Card>
            <div className="space-y-3">
              {TYPE_SCALE.map((t) => (
                <div key={t.name} className="flex items-baseline gap-4">
                  <span className="w-16 font-mono text-xs text-text-muted">{t.name}</span>
                  <span
                    className="font-heading text-text-primary"
                    style={{ fontSize: t.size, lineHeight: 1.2 }}
                  >
                    The quick brown fox jumps over the lazy dog
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold text-text-primary">
            Glow & motion
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card title="Glow · primary">rgba(124, 58, 237, 0.4)</Card>
            <Card title="Glow · accent">rgba(6, 182, 212, 0.4)</Card>
            <Card title="Glow · white">rgba(248, 250, 252, 0.2)</Card>
            <Card title="Motion · fast">150ms · ease-out</Card>
            <Card title="Motion · base">250ms · ease-out</Card>
            <Card title="Motion · slow">500ms · ease-out</Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
