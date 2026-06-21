"use client";
import Link from "next/link";
import { Card, Badge, Button, Kbd } from "@chromatic/ui";
import { ThemeToggle } from "../../../components/ThemeToggle";

export function ErrorPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="fixed inset-0 -z-10 bg-background-default">
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      <header className="absolute right-0 top-0 z-50 p-6">
        <ThemeToggle />
      </header>

      <main id="main" className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div>
          <span aria-hidden className="block font-heading text-9xl font-bold leading-none text-primary-500 glow-text">
            404
          </span>
          <Badge tone="warning" className="mt-4">Page not found</Badge>
        </div>

        <h1 className="mt-4 font-heading text-2xl font-bold text-text-primary">
          Lost in the chromatic void
        </h1>
        <p className="mt-2 max-w-md font-body text-text-secondary">
          The page you&rsquo;re looking for doesn&rsquo;t exist &mdash; or it&rsquo;s been moved to a different
          wavelength. Try one of the recovery paths below.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="primary" href="/">Back to home</Button>
          <Button variant="ghost" href="/examples">Browse examples</Button>
        </div>

        <Card className="mt-12 text-left">
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-text-secondary">
            Diagnostics
          </h2>
          <dl className="mt-3 space-y-2 font-mono text-xs">
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">path</dt>
              <dd className="text-text-primary">{typeof window !== "undefined" ? window.location.pathname : "/unknown"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">timestamp</dt>
              <dd className="text-text-primary">{new Date().toISOString()}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">trace</dt>
              <dd className="text-text-primary">No upstream trace ID &mdash; this is a 404, not a 5xx</dd>
            </div>
          </dl>
        </Card>

        <p className="mt-8 font-body text-xs text-text-muted">
          Press <Kbd>Esc</Kbd> to go back, or use the navigation above.
        </p>
      </main>
    </div>
  );
}