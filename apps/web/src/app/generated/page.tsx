import Link from "next/link";
import { Badge, Card } from "@chromatic/ui";
import { ThemeToggle } from "../../components/ThemeToggle";
import { createStashClientOrMock } from "@chromatic/stash-client";
import type { StashClient, StashImage } from "@chromatic/stash-client";
import { GeneratedGrid } from "./GeneratedGrid";

export const metadata = {
  title: "Generated — Chromatic Design Studios",
  description:
    "Live grid of generated images from the ComfyUI-Harness Stash media library. Filter by tag, sort by rating, paginate, copy prompt + workflow ID for reuse.",
};

async function loadStash(): Promise<{ client: StashClient; first: StashImage[]; total: number; isLive: boolean; tags: string[] }> {
  const url = process.env.NEXT_PUBLIC_STASH_URL ?? "http://127.0.0.1:9999/graphql";
  const client = await createStashClientOrMock(url);
  const page = await client.listImages({ pageSize: 24, sort: "newest" });
  const tags = await client.listTags();
  return {
    client,
    first: page.items,
    total: page.total,
    isLive: client.isLive(),
    tags,
  };
}

function Nav({ isLive }: { isLive: boolean }) {
  return (
    <header className="glass sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
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
          <Link href="/generated" className="text-text-primary">Generated</Link>
          <Link href="/playground" className="hover:text-text-primary">Playground</Link>
          <Link href="/studio" className="hover:text-text-primary">Studio</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Badge tone={isLive ? "success" : "warning"} aria-label={isLive ? "Stash live data" : "Stash mock data"}>
            {isLive ? "Live" : "Demo data"}
          </Badge>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default async function GeneratedPage() {
  const { first, total, isLive, tags } = await loadStash();
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="fixed inset-0 -z-10 bg-background-default">
        <div className="absolute inset-0 bg-gradient-holographic" />
      </div>

      <Nav isLive={isLive} />

      <main id="main" className="mx-auto w-full max-w-7xl flex-1 space-y-10 px-6 py-10">
        <section className="space-y-4">
          <div className="flex flex-col items-start gap-2">
            <Badge tone="primary">Generated</Badge>
            <h1 className="font-heading text-4xl font-bold text-text-primary">
              Image + Video Resource Surface
            </h1>
            <p className="max-w-2xl font-body text-text-secondary">
              {total} entries from the ComfyUI-Harness Stash media library.
              Every image links back to its workflow ID, prompt, and ranked-output
              provenance. {isLive ? "Live" : "Currently showing demo data — start Stash (`:9999`) to see live runs."}
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-lg font-semibold text-text-primary">Tags</h2>
          <ul className="flex flex-wrap gap-2" aria-label="Filter by tag">
            {tags.slice(0, 24).map((tag) => (
              <li key={tag}>
                <span className="inline-flex items-center rounded-full border border-border-default bg-surface-default px-3 py-1 text-xs text-text-secondary">
                  {tag}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-lg font-semibold text-text-primary">Recent</h2>
          {first.length === 0 ? (
            <Card>
              <p className="font-body text-text-secondary">
                No images yet. Run <code className="font-mono">run_matrix.py</code> on the
                ComfyUI-Harness side, then re-run Stash indexer to populate this surface.
              </p>
            </Card>
          ) : (
            <GeneratedGrid items={first} />
          )}
        </section>
      </main>
    </div>
  );
}
