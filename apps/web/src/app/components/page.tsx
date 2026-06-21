import Link from "next/link";
import { Button, Card, Badge, Input, Hero } from "@chromatic/ui";
import { ThemeToggle } from "../../components/ThemeToggle";

export const metadata = {
  title: "Components — Chromatic Design System",
  description:
    "Browse the Chromatic component library — 23 token-driven, agent-readable, accessibility-wired primitives.",
};

type ComponentMeta = {
  slug: string;
  name: string;
  status: "stable" | "beta" | "alpha";
  category: "Form" | "Layout" | "Display" | "Feedback" | "Navigation";
  description: string;
};

const COMPONENTS: ComponentMeta[] = [
  // Form
  { slug: "button", name: "Button", status: "stable", category: "Form", description: "Primary action trigger with primary/secondary/ghost variants and three sizes." },
  { slug: "input", name: "Input", status: "stable", category: "Form", description: "Text input with label, hint, error, and disabled states." },
  { slug: "dropdown", name: "Dropdown", status: "beta", category: "Form", description: "Menu triggered by a button — keyboard navigable, typeahead supported." },
  { slug: "toggle", name: "Toggle", status: "stable", category: "Form", description: "Two-state switch with label and accessibility wiring." },
  { slug: "slider", name: "Slider", status: "beta", category: "Form", description: "Range input with min/max/step, keyboard nudging, and value display." },
  // Layout
  { slug: "card", name: "Card", status: "stable", category: "Layout", description: "Surface container with eyebrow, footer slot, and optional interactivity." },
  { slug: "hero", name: "Hero", status: "stable", category: "Layout", description: "Canonical above-the-fold section — token-driven implementation of 03_components/hero-component.md." },
  { slug: "sheet", name: "Sheet", status: "beta", category: "Layout", description: "Full-bleed surface anchored to a viewport edge." },
  { slug: "table", name: "Table", status: "beta", category: "Layout", description: "Data table with header, footer, sortable columns, and row hover." },
  { slug: "separator", name: "Separator", status: "stable", category: "Layout", description: "Horizontal or vertical rule using the border token." },
  // Display
  { slug: "badge", name: "Badge", status: "stable", category: "Display", description: "Compact status pill — default, primary, accent, success, warning, error tones." },
  { slug: "avatar", name: "Avatar", status: "stable", category: "Display", description: "Identity mark with image, initials, and size variants." },
  { slug: "progress", name: "Progress", status: "stable", category: "Display", description: "Linear progress bar with determinate and indeterminate states." },
  { slug: "skeleton", name: "Skeleton", status: "stable", category: "Display", description: "Loading placeholder that mirrors target component shapes." },
  { slug: "tooltip", name: "Tooltip", status: "beta", category: "Display", description: "Hover/focus disclosure with arrow and placement options." },
  { slug: "alert", name: "Alert", status: "stable", category: "Display", description: "Inline callout — info, success, warning, error variants." },
  { slug: "kbd", name: "Kbd", status: "stable", category: "Display", description: "Inline keyboard key indicator." },
  // Feedback
  { slug: "modal", name: "Modal", status: "beta", category: "Feedback", description: "Focus-trapped overlay for primary confirmations and forms." },
  { slug: "drawer", name: "Drawer", status: "beta", category: "Feedback", description: "Side-anchored panel for secondary flows and detail views." },
  { slug: "toast", name: "Toast", status: "beta", category: "Feedback", description: "Transient, non-blocking notification with auto-dismiss." },
  // Navigation
  { slug: "tabs", name: "Tabs", status: "beta", category: "Navigation", description: "Tabular navigation with keyboard support and roving tabindex." },
  { slug: "menu", name: "Menu", status: "beta", category: "Navigation", description: "Vertical action menu with sub-menus, separators, and shortcuts." },
  { slug: "pagination", name: "Pagination", status: "beta", category: "Navigation", description: "Page navigation with first/prev/next/last and page range." },
];

const STATUS_TONE: Record<ComponentMeta["status"], "success" | "primary" | "warning"> = {
  stable: "success",
  beta: "primary",
  alpha: "warning",
};

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
          <Link href="/components" className="text-text-primary">Components</Link>
          <Link href="/tokens" className="hover:text-text-primary">Tokens</Link>
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
        <span>Chromatic Design Studios v0.5.0</span>
        <span>23 components · 5 categories · token-driven</span>
      </div>
    </footer>
  );
}

function groupByCategory(items: ComponentMeta[]): Record<string, ComponentMeta[]> {
  return items.reduce<Record<string, ComponentMeta[]>>((acc, c) => {
    (acc[c.category] ??= []).push(c);
    return acc;
  }, {});
}

export default function ComponentsIndex() {
  const grouped = groupByCategory(COMPONENTS);
  const categories = Object.keys(grouped).sort();
  const stableCount = COMPONENTS.filter((c) => c.status === "stable").length;
  const betaCount = COMPONENTS.filter((c) => c.status === "beta").length;

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="fixed inset-0 -z-10 bg-background-default">
        <div className="absolute inset-0 bg-gradient-holographic" />
      </div>

      <Nav />

      <main id="main" className="mx-auto w-full max-w-6xl flex-1 space-y-12 px-6 py-12">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="primary">v0.5.0</Badge>
            <Badge tone="success">{stableCount} stable</Badge>
            <Badge tone="primary">{betaCount} beta</Badge>
          </div>
          <h1 className="font-heading text-4xl font-bold text-text-primary glow-text">
            Components
          </h1>
          <p className="max-w-2xl font-body text-lg text-text-secondary">
            Every primitive is token-driven, accessibility-wired, and ships with a spec that agents can read.
            Each component is also a confidence-gated render target for{" "}
            <code className="font-mono text-text-primary">chromatic-agent render</code>.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" href="/playground">Open playground</Button>
            <Button variant="ghost" href="/tokens">Browse tokens</Button>
            <Button variant="ghost" href="/studio">View gallery</Button>
          </div>
        </header>

        {categories.map((cat) => (
          <section key={cat} className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h2 className="font-heading text-2xl font-semibold text-text-primary">
                {cat}
              </h2>
              <span className="font-mono text-xs text-text-muted">
                {grouped[cat].length} components
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {grouped[cat].map((c) => (
                <Card
                  key={c.slug}
                  eyebrow={c.category}
                  title={c.name}
                  interactive
                  footer={
                    <div className="flex items-center justify-between">
                      <Badge tone={STATUS_TONE[c.status]}>{c.status}</Badge>
                      <span className="text-xs text-text-muted">/components/{c.slug}</span>
                    </div>
                  }
                >
                  {c.description}
                </Card>
              ))}
            </div>
          </section>
        ))}

        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold text-text-primary">
            Coming next
          </h2>
          <p className="max-w-2xl font-body text-text-secondary">
            Wave 7 ships token packaging — a real npm package, a Tailwind preset, and a Figma Tokens export.
            Wave 8 ships the agent render CLI.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <Input label="Subscribe to changelog" placeholder="you@team.dev" />
            <Input label="GitHub repo" placeholder="kas1987/chromatic-design-studios" />
            <Input label="Component request" placeholder="Command palette" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}