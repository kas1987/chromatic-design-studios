"use client";
import Link from "next/link";
import { Card, Badge, Button, Progress, Avatar, Table, type TableColumn } from "@chromatic/ui";
import { ThemeToggle } from "../../../components/ThemeToggle";

type Activity = { id: string; user: string; action: string; time: string };

const ACTIVITY: Activity[] = [
  { id: "1", user: "Maya Patel", action: "shipped the dashboard route", time: "2m ago" },
  { id: "2", user: "Theo Lin", action: "updated the primary scale to violet-600", time: "12m ago" },
  { id: "3", user: "Iris Cao", action: "merged PR #42 — token-driven Tabs", time: "1h ago" },
  { id: "4", user: "Ren Vasquez", action: "opened Wave 7 bead: cli distribution", time: "3h ago" },
  { id: "5", user: "Akira Sato", action: "shipped Toast viewport", time: "yesterday" },
];

const COLUMNS: TableColumn<Activity>[] = [
  { id: "user", header: "User", cell: (r) => r.user, sortable: true },
  { id: "action", header: "Action", cell: (r) => r.action },
  { id: "time", header: "When", cell: (r) => r.time, align: "right" },
];

export default function DashboardExample() {
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
              Dashboard / Chromatic
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-6 py-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Badge tone="primary">Example</Badge>
            <h1 className="mt-2 font-heading text-3xl font-bold text-text-primary glow-text">
              Good morning, kas
            </h1>
            <p className="mt-1 font-body text-text-secondary">
              Here&rsquo;s what shipped across the Chromatic ecosystem in the last 24 hours.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Avatar name="Kas Adams" size="lg" tone="primary" />
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card eyebrow="Components" title="23" footer={<Badge tone="success">+18 this week</Badge>}>
            Token-driven primitives ready to ship.
          </Card>
          <Card eyebrow="Tokens" title="6" footer={<Badge tone="success">stable</Badge>}>
            Color, spacing, typography, motion, glow, light.
          </Card>
          <Card eyebrow="Tests" title="94+" footer={<Badge tone="success">green</Badge>}>
            Unit, E2E, and CLI tests across the stack.
          </Card>
          <Card eyebrow="Waves" title="4 / 5" footer={<Progress value={80} tone="primary" />}>
            80% of the 90-day plan complete.
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-heading text-2xl font-semibold text-text-primary">
              Recent activity
            </h2>
            <span className="font-mono text-xs text-text-muted">live</span>
          </div>
          <Table<Activity> columns={COLUMNS} rows={ACTIVITY} rowKey={(r) => r.id} />
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold text-text-primary">
            Next up
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card
              eyebrow="Wave 9"
              title="Examples gallery"
              footer={<Button size="sm" href="/examples">View all 10</Button>}
            >
              Ten production-grade patterns are now in the gallery.
            </Card>
            <Card
              eyebrow="Wave 9"
              title="v1.0.0 ship"
              footer={<Button size="sm" href="/">Back to home</Button>}
            >
              All five waves done &mdash; ship the platform release.
            </Card>
          </div>
        </section>
      </main>

      <footer className="glass mt-auto">
        <div className="mx-auto flex max-w-6xl justify-between px-6 py-4 text-xs text-text-muted">
          <Link href="/examples" className="hover:text-text-primary">
            ← Back to examples
          </Link>
          <span>Dashboard example · token-driven</span>
        </div>
      </footer>
    </div>
  );
}