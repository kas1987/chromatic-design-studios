"use client";
import Link from "next/link";
import { Card, Badge, Button, Tooltip, Kbd, Separator } from "@chromatic/ui";
import { ThemeToggle } from "../../../components/ThemeToggle";

const TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: "Free",
    cadence: "forever",
    description: "For solo builders exploring the platform.",
    cta: { label: "Start free", variant: "ghost" as const },
    features: [
      "All 23 components",
      "Token pipeline + Tailwind preset",
      "Local-first CLI (chromatic-ui)",
      "Community support",
    ],
  },
  {
    id: "team",
    name: "Team",
    price: "$24",
    cadence: "per user / month",
    description: "For teams shipping a real product.",
    cta: { label: "Start trial", variant: "primary" as const },
    highlight: true,
    features: [
      "Everything in Starter",
      "Figma Tokens export",
      "Style Dictionary compatibility",
      "chromatic-agent render (5 components)",
      "Priority support",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    price: "Custom",
    cadence: "annual",
    description: "For platforms embedding Chromatic.",
    cta: { label: "Contact sales", variant: "ghost" as const },
    features: [
      "Everything in Team",
      "chromatic-agent render (full library)",
      "Custom token theming",
      "Dedicated success engineer",
      "SSO + audit logs",
    ],
  },
];

export function PricingPage() {
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
              Pricing / Chromatic
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-6xl flex-1 space-y-12 px-6 py-12">
        <header className="space-y-3 text-center">
          <Badge tone="primary">Pricing</Badge>
          <h1 className="font-heading text-4xl font-bold text-text-primary glow-text">
            Simple, token-driven pricing
          </h1>
          <p className="mx-auto max-w-2xl font-body text-lg text-text-secondary">
            Start free, scale when your team grows. Every plan ships the full
            component library and the token pipeline.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <Card
              key={tier.id}
              interactive
              className={
                tier.highlight
                  ? "border-primary-600 shadow-glow-hover"
                  : undefined
              }
              eyebrow={tier.highlight ? "Most popular" : tier.name}
              title={
                <span className="flex items-baseline gap-1">
                  <span className="font-heading text-3xl font-bold text-text-primary">
                    {tier.price}
                  </span>
                  <span className="font-body text-sm text-text-muted">
                    {tier.cadence}
                  </span>
                </span>
              }
              footer={
                <Button
                  variant={tier.cta.variant}
                  className="w-full"
                >
                  {tier.cta.label}
                </Button>
              }
            >
              <p className="font-body text-sm text-text-secondary">
                {tier.description}
              </p>
              <Separator className="my-4" />
              <ul className="space-y-2 font-body text-sm text-text-primary">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span aria-hidden className="mt-0.5 text-primary-500">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </section>

        <section className="space-y-4 text-center">
          <h2 className="font-heading text-2xl font-semibold text-text-primary">
            Compare the details
          </h2>
          <p className="mx-auto max-w-2xl font-body text-text-secondary">
            Hover any feature for the full description, or press{" "}
            <Tooltip content="Open the detailed comparison table">
              <Kbd>?</Kbd>
            </Tooltip>{" "}
            in the docs to deep-dive.
          </p>
        </section>
      </main>

      <footer className="px-6 py-4 text-center text-xs text-text-muted">
        <Link href="/examples" className="hover:text-text-primary">
          ← Back to examples
        </Link>
      </footer>
    </div>
  );
}