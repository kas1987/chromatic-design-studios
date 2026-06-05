import Link from "next/link";
import { Button, Card, Badge, Input } from "@chromatic/ui";
import { ThemeToggle } from "../../components/ThemeToggle";

export const metadata = {
  title: "Studio — Chromatic Design System",
  description: "Live gallery of Chromatic token-driven primitives",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="font-heading text-2xl font-semibold text-text-primary">
        {title}
      </h2>
      {children}
    </section>
  );
}

const SWATCHES: { name: string; varName: string }[] = [
  { name: "background", varName: "--color-background-default" },
  { name: "surface", varName: "--color-background-elevated" },
  { name: "primary-500", varName: "--color-primary-500" },
  { name: "primary-600", varName: "--color-primary-600" },
  { name: "accent-500", varName: "--color-accent-500" },
  { name: "text-primary", varName: "--color-text-primary" },
  { name: "text-secondary", varName: "--color-text-secondary" },
  { name: "border", varName: "--color-border-default" },
];

export default function StudioPage() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-background-default">
        <div className="absolute inset-0 bg-gradient-holographic" />
      </div>

      <header className="glass sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-gradient-accentSweep" />
            <span className="font-heading font-semibold tracking-tight text-text-primary">
              Chromatic Studio
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-text-secondary sm:inline">
              Design system gallery
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-6xl space-y-12 px-6 py-12">
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-bold text-text-primary glow-text">
            Component Studio
          </h1>
          <p className="font-body text-lg text-text-secondary">
            Every primitive below is token-driven from{" "}
            <code className="font-mono text-text-primary">02_design_tokens</code>.
          </p>
        </div>

        <Section title="Color tokens">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SWATCHES.map((s) => (
              <div
                key={s.name}
                className="rounded-md border border-border-default bg-background-elevated p-3"
              >
                <div
                  className="mb-2 h-12 w-full rounded"
                  style={{
                    background: `var(${s.varName})`,
                    border: "1px solid var(--color-border-default)",
                  }}
                />
                <div className="font-mono text-xs text-text-secondary">{s.name}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Buttons">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </Section>

        <Section title="Badges">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Default</Badge>
            <Badge tone="primary">Primary</Badge>
            <Badge tone="accent">Accent</Badge>
            <Badge tone="success">Success</Badge>
            <Badge tone="warning">Warning</Badge>
            <Badge tone="error">Error</Badge>
          </div>
        </Section>

        <Section title="Inputs">
          <div className="grid max-w-xl gap-4 sm:grid-cols-2">
            <Input label="Project name" placeholder="chromatic-studio" />
            <Input label="Token prefix" placeholder="cds-" hint="Used for issue IDs" />
            <Input
              label="Invalid example"
              defaultValue="bad value"
              invalid
              hint="This field has an error"
            />
            <Input label="Disabled" placeholder="unavailable" disabled />
          </div>
        </Section>

        <Section title="Cards">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card eyebrow="Surface" title="Static card">
              Glassmorphism surface using the elevated background, default border,
              and the glow-card shadow preset.
            </Card>
            <Card
              eyebrow="Interactive"
              title="Hover me"
              interactive
              footer={<Button size="sm">Action</Button>}
            >
              Lifts and brightens its border on hover — for clickable surfaces.
            </Card>
            <Card eyebrow="Token-driven" title="No hard-coded values">
              Spacing, radius, color, and glow all reference Chromatic tokens.
            </Card>
          </div>
        </Section>
      </main>

      <footer className="glass">
        <div className="mx-auto flex max-w-6xl justify-between px-6 py-4 text-xs text-text-muted">
          <Link href="/" className="hover:text-text-primary">
            ← Back to home
          </Link>
          <span>Chromatic Studio v0.4.0</span>
        </div>
      </footer>
    </div>
  );
}
