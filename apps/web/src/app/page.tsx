import Link from "next/link";
import { Hero, Button, Badge } from "@chromatic/ui";
import { ThemeToggle } from "../components/ThemeToggle";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="fixed inset-0 -z-10 bg-background-default">
        <div className="absolute inset-0 bg-gradient-holographic" />
      </div>

      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-gradient-accentSweep" />
            <span className="font-heading font-semibold tracking-tight text-text-primary">
              Chromatic Design Studios
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <nav
              aria-label="Primary"
              className="hidden gap-6 text-sm text-text-secondary md:flex"
            >
              <Link href="/components" className="hover:text-text-primary">Components</Link>
              <Link href="/tokens" className="hover:text-text-primary">Tokens</Link>
              <Link href="/examples" className="hover:text-text-primary">Examples</Link>
              <Link href="/generated" className="hover:text-text-primary">Generated</Link>
              <Link href="/playground" className="hover:text-text-primary">Playground</Link>
              <Link href="/studio" className="hover:text-text-primary">Studio</Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main" className="flex-1">
        <Hero
          badge="v0.4.0"
          title="A Front-end"
          titleAccent="Resource Platform"
          subtitle="Token-driven, agent-readable, locally runnable. Build production design systems with a single source of truth that compiles to CSS variables and a Tailwind theme — and renders to TSX from a markdown spec."
          primaryCta={{ label: "Browse components", href: "/components" }}
          ghostCta={{ label: "Explore tokens", href: "/tokens" }}
        />

        {/* Surface grid */}
        <section className="mx-auto max-w-7xl space-y-6 px-6 py-16">
          <div className="flex flex-col items-start gap-2">
            <Badge tone="primary">The platform</Badge>
            <h2 className="font-heading text-3xl font-bold text-text-primary">
              Four surfaces, one token system
            </h2>
            <p className="max-w-2xl font-body text-text-secondary">
              Every surface pulls from the same <code className="font-mono text-text-primary">02_design_tokens/</code>{" "}
              source of truth. No hardcoded values. No drift between docs and code.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/components"
              className="glass group flex flex-col gap-2 rounded-md p-5 transition hover:border-border-hover"
            >
              <span className="font-mono text-xs text-text-muted">/components</span>
              <span className="font-heading text-xl font-semibold text-text-primary">
                Components
              </span>
              <span className="font-body text-sm text-text-secondary">
                21+ token-driven primitives, each with a spec, TSX, and demo.
              </span>
            </Link>
            <Link
              href="/tokens"
              className="glass group flex flex-col gap-2 rounded-md p-5 transition hover:border-border-hover"
            >
              <span className="font-mono text-xs text-text-muted">/tokens</span>
              <span className="font-heading text-xl font-semibold text-text-primary">
                Tokens
              </span>
              <span className="font-body text-sm text-text-secondary">
                Color, spacing, typography, motion, and glow — all live in JSON.
              </span>
            </Link>
            <Link
              href="/examples"
              className="glass group flex flex-col gap-2 rounded-md p-5 transition hover:border-border-hover"
            >
              <span className="font-mono text-xs text-text-muted">/examples</span>
              <span className="font-heading text-xl font-semibold text-text-primary">
                Examples
              </span>
              <span className="font-body text-sm text-text-secondary">
                Production patterns: landing, dashboard, settings, auth, and more.
              </span>
            </Link>
            <Link
              href="/playground"
              className="glass group flex flex-col gap-2 rounded-md p-5 transition hover:border-border-hover"
            >
              <span className="font-mono text-xs text-text-muted">/playground</span>
              <span className="font-heading text-xl font-semibold text-text-primary">
                Playground
              </span>
              <span className="font-body text-sm text-text-secondary">
                Adjust the primary scale and watch the live UI update.
              </span>
            </Link>
          </div>
        </section>

        {/* Why chromatic */}
        <section className="mx-auto max-w-7xl space-y-6 px-6 py-16">
          <div className="flex flex-col items-start gap-2">
            <Badge tone="accent">Differentiators</Badge>
            <h2 className="font-heading text-3xl font-bold text-text-primary">
              Built for the agent era
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="glass rounded-md p-5">
              <h3 className="font-heading text-lg font-semibold text-text-primary">Spec-as-source</h3>
              <p className="mt-2 font-body text-sm text-text-secondary">
                Every component ships as a structured markdown spec with token mappings,
                layout diagrams, and acceptance criteria. The spec is the prompt.
              </p>
            </div>
            <div className="glass rounded-md p-5">
              <h3 className="font-heading text-lg font-semibold text-text-primary">Local-first</h3>
              <p className="mt-2 font-body text-sm text-text-secondary">
                The full stack runs offline: LiteLLM, n8n, Open WebUI, ComfyUI, Ollama.
                Tune the design system without leaving your machine.
              </p>
            </div>
            <div className="glass rounded-md p-5">
              <h3 className="font-heading text-lg font-semibold text-text-primary">Confidence-gated</h3>
              <p className="mt-2 font-body text-sm text-text-secondary">
                A 1-5 confidence gate decides what ships automatically and what pauses for review.
                Documentation, tokens, and components stay coherent.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl space-y-4 px-6 py-16 text-center">
          <h2 className="font-heading text-3xl font-bold text-text-primary glow-text">
            Ship v1.0.0 in 12 weeks
          </h2>
          <p className="mx-auto max-w-2xl font-body text-text-secondary">
            Five waves from the current v0.4.0 platform surface to a public, agent-renderable,
            locally runnable front-end resource platform.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="primary" href="/components">Start with components</Button>
            <Button variant="ghost" href="/playground">Try the playground</Button>
          </div>
        </section>
      </main>

      <footer className="glass mt-auto">
        <div className="mx-auto flex max-w-7xl justify-between px-6 py-4 text-xs text-text-muted">
          <span>Chromatic Design Studios v0.4.0</span>
          <span>Token-driven · Agent-readable · Locally runnable</span>
        </div>
      </footer>
    </div>
  );
}
