import Link from "next/link";
import { Badge, Card, Button } from "@chromatic/ui";
import { ThemeToggle } from "../../components/ThemeToggle";

export const metadata = {
  title: "Examples — Chromatic Design System",
  description: "Production-grade page patterns built from the Chromatic token system.",
};

type Example = {
  slug: string;
  title: string;
  pattern: string;
  description: string;
  status: "shipped" | "draft";
  href?: string;
};

const EXAMPLES: Example[] = [
  { slug: "dashboard", title: "Dashboard", pattern: "Product", description: "Stat cards, activity table, and progress surfaces over a token-driven grid.", status: "shipped", href: "/examples/dashboard" },
  { slug: "auth", title: "Auth flow", pattern: "Form", description: "Sign-in form with email, password, OAuth, and demo alert.", status: "shipped", href: "/examples/auth" },
  { slug: "empty-state", title: "Empty state", pattern: "System", description: "First-run screen with primary CTA and component preview chips.", status: "shipped", href: "/examples/empty-state" },
  { slug: "error-page", title: "Error page (404)", pattern: "System", description: "Branded failure screen with diagnostics and recovery actions.", status: "shipped", href: "/examples/error-page" },
  { slug: "pricing", title: "Pricing", pattern: "Marketing", description: "Three-tier comparison with highlight column and feature lists.", status: "shipped", href: "/examples/pricing" },
  { slug: "settings", title: "Settings page", pattern: "Product", description: "Sectioned form with grouped inputs, toggles, and save bar.", status: "draft" },
  { slug: "blog-post", title: "Blog post", pattern: "Content", description: "Long-form reading layout with code blocks and pull quotes.", status: "draft" },
  { slug: "e-commerce", title: "Product card / e-com", pattern: "E-commerce", description: "Listing + detail surface with price, variant chips, and add-to-cart.", status: "draft" },
  { slug: "mobile-shell", title: "Mobile shell", pattern: "Mobile", description: "Bottom-nav + top-bar skeleton for native-feel web apps.", status: "draft" },
  { slug: "hero-landing", title: "Hero landing", pattern: "Marketing", description: "Above-the-fold hero with badge, dual-CTA, and holographic gradient.", status: "draft" },
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
          <Link href="/tokens" className="hover:text-text-primary">Tokens</Link>
          <Link href="/examples" className="text-text-primary">Examples</Link>
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
        <span>Chromatic Design Studios v1.0.0</span>
        <span>5 shipped · 5 draft · 10 patterns total</span>
      </div>
    </footer>
  );
}

export default function ExamplesIndex() {
  const shipped = EXAMPLES.filter((e) => e.status === "shipped");
  const draft = EXAMPLES.filter((e) => e.status === "draft");

  const renderCard = (e: Example) => {
    const cardBody = (
      <Card
        eyebrow={e.pattern}
        title={e.title}
        interactive={!!e.href}
        footer={
          <div className="flex items-center justify-between">
            <Badge tone={e.status === "shipped" ? "success" : "warning"}>
              {e.status}
            </Badge>
            <span className="font-mono text-xs text-text-muted">
              {e.href ?? `/examples/${e.slug}`}
            </span>
          </div>
        }
      >
        {e.description}
      </Card>
    );

    if (e.href) {
      return (
        <Link key={e.slug} href={e.href} className="block">
          {cardBody}
        </Link>
      );
    }
    return <div key={e.slug}>{cardBody}</div>;
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="fixed inset-0 -z-10 bg-background-default">
        <div className="absolute inset-0 bg-gradient-holographic" />
      </div>

      <Nav />

      <main id="main" className="mx-auto w-full max-w-6xl flex-1 space-y-12 px-6 py-12">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="primary">v1.0.0</Badge>
            <Badge tone="success">{shipped.length} shipped</Badge>
            <Badge tone="warning">{draft.length} draft</Badge>
          </div>
          <h1 className="font-heading text-4xl font-bold text-text-primary glow-text">
            Examples
          </h1>
          <p className="max-w-2xl font-body text-lg text-text-secondary">
            Production-grade page patterns. Each example is a fully-rendered Next.js route —
            token-driven, accessible, and ready to ship.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" href="/playground">Try the playground</Button>
            <Button variant="ghost" href="/components">Browse components</Button>
          </div>
        </header>

        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold text-text-primary">Shipped</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shipped.map(renderCard)}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold text-text-primary">
            In design
          </h2>
          <p className="max-w-2xl font-body text-text-secondary">
            Drafts are listed here for the next minor. Click into any shipped pattern
            to see the live route.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {draft.map(renderCard)}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}