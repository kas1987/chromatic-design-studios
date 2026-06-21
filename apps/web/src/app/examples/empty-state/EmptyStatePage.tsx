"use client";
import Link from "next/link";
import { Card, Badge, Button } from "@chromatic/ui";
import { ThemeToggle } from "../../../components/ThemeToggle";

export function EmptyStatePage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="fixed inset-0 -z-10 bg-background-default">
        <div className="absolute inset-0 bg-gradient-holographic" />
      </div>

      <header className="glass sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/examples" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-gradient-accentSweep" />
            <span className="font-heading font-semibold tracking-tight text-text-primary">
              Empty state / Chromatic
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main id="main" className="mx-auto flex w-full max-w-2xl flex-1 items-center px-6 py-16">
        <Card className="w-full text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-glowEdge">
            <span aria-hidden className="font-heading text-3xl text-primary-500">◇</span>
          </div>
          <h1 className="mt-6 font-heading text-2xl font-bold text-text-primary glow-text">
            No components yet
          </h1>
          <p className="mx-auto mt-2 max-w-md font-body text-text-secondary">
            Get started by adding your first token-driven component. The CLI will
            scaffold the file and wire the design tokens.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="primary">
              <span className="font-mono text-sm">npx chromatic-ui add button</span>
            </Button>
            <Button variant="ghost" href="/docs">
              Read the docs
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Badge tone="primary">Button</Badge>
            <Badge tone="primary">Card</Badge>
            <Badge tone="primary">Modal</Badge>
            <Badge tone="accent">21 more</Badge>
          </div>
        </Card>
      </main>

      <footer className="px-6 py-4 text-center text-xs text-text-muted">
        <Link href="/examples" className="hover:text-text-primary">
          ← Back to examples
        </Link>
      </footer>
    </div>
  );
}