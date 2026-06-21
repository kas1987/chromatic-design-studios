import Link from "next/link";
import { Badge, Card } from "@chromatic/ui";
import { ThemeToggle } from "../../components/ThemeToggle";
import { Playground } from "./Playground";

export const metadata = {
  title: "Playground — Chromatic Design System",
  description:
    "Interactively adjust tokens and preview the live UI. Changes are written back to 02_design_tokens via chromatic-token-studio.mjs.",
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
          <Link href="/components" className="hover:text-text-primary">Components</Link>
          <Link href="/tokens" className="hover:text-text-primary">Tokens</Link>
          <Link href="/examples" className="hover:text-text-primary">Examples</Link>
          <Link href="/playground" className="text-text-primary">Playground</Link>
          <Link href="/studio" className="hover:text-text-primary">Studio</Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}

export default function PlaygroundPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="fixed inset-0 -z-10 bg-background-default">
        <div className="absolute inset-0 bg-gradient-holographic" />
      </div>

      <Nav />

      <main id="main" className="mx-auto w-full max-w-6xl flex-1 space-y-12 px-6 py-12">
        <header className="space-y-3">
          <Badge tone="primary">Live preview</Badge>
          <h1 className="font-heading text-4xl font-bold text-text-primary glow-text">
            Playground
          </h1>
          <p className="max-w-2xl font-body text-lg text-text-secondary">
            Adjust the primary and accent scales with sliders and color inputs. The preview
            updates instantly through CSS custom properties; the persisted values live in
            <code className="font-mono text-text-primary"> 02_design_tokens/tokens.colors.json</code>.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <Playground />
          <div className="space-y-4">
            <Card title="What this does">
              The playground wires the slider values to <code className="font-mono text-text-primary">--color-primary-*</code>
              and <code className="font-mono text-text-primary">--color-accent-*</code> CSS variables
              at runtime. The companion script <code className="font-mono text-text-primary">chromatic-token-studio.mjs</code>
              ships those values back to the JSON source for the next build.
            </Card>
            <Card title="Constraints">
              Design Law #1 requires every visual value reference a token. The playground
              enforces that by exposing only token-derived inputs — never raw values.
            </Card>
            <Card title="CLI">
              After tuning, run <code className="font-mono text-text-primary">npm run tokens</code>{" "}
              to regenerate the Tailwind theme and CSS vars from the JSON source.
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
