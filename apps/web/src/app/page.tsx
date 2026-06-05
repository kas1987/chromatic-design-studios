import { Hero } from "@chromatic/ui";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Cosmic background (token-driven holographic overlay). */}
      <div className="fixed inset-0 -z-10 bg-background-default">
        <div className="absolute inset-0 bg-gradient-holographic" />
      </div>

      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-gradient-accentSweep" />
            <span className="font-heading font-semibold tracking-tight text-text-primary">
              Chromatic Design Studios
            </span>
          </div>
          <nav className="hidden gap-6 text-sm text-text-secondary md:flex">
            <a href="#" className="transition-colors hover:text-text-primary">Dashboard</a>
            <a href="#" className="transition-colors hover:text-text-primary">Assets</a>
            <a href="#" className="transition-colors hover:text-text-primary">Prompts</a>
            <a href="#" className="transition-colors hover:text-text-primary">Agents</a>
          </nav>
        </div>
      </header>

      {/* Hero — canonical token-driven component */}
      <main className="flex-1">
        <Hero
          badge="Design System"
          title="AI Design"
          titleAccent="Control Center"
          subtitle="Governed design operations for the Chromatic Harness ecosystem. Orchestrate models, prompts, agents, and visual assets from one local-first workspace."
          primaryCta={{ label: "Open Dashboard", href: "#" }}
          ghostCta={{ label: "Read the PDR", href: "#" }}
        />
      </main>

      {/* Footer */}
      <footer className="glass mt-auto">
        <div className="mx-auto flex max-w-7xl justify-between px-6 py-4 text-xs text-text-muted">
          <span>Chromatic Design Studios v0.2.0</span>
          <span>Chromatic Harness</span>
        </div>
      </footer>
    </div>
  );
}
