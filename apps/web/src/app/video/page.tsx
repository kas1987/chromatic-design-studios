import Link from "next/link";
import { Badge, Card } from "@chromatic/ui";
import { ThemeToggle } from "../../components/ThemeToggle";
import { createStashClientOrMock } from "@chromatic/stash-client";
import type { StashClient, StashVideo } from "@chromatic/stash-client";
import { VideoGrid } from "./VideoGrid";

export const metadata = {
  title: "Video — Chromatic Design Studios",
  description:
    "Live grid of generated videos from the ComfyUI-Harness video-pipeline-lane. SVD img2vid runs, prompt + workflow ID per clip, model and fps metadata.",
};

async function loadStash(): Promise<{
  client: StashClient;
  first: StashVideo[];
  total: number;
  isLive: boolean;
}> {
  const url = process.env.NEXT_PUBLIC_STASH_URL ?? "http://127.0.0.1:9999/graphql";
  const client = await createStashClientOrMock(url);
  const page = await client.listVideos({ pageSize: 24, sort: "newest" });
  return {
    client,
    first: page.items,
    total: page.total,
    isLive: client.isLive(),
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
          <Link href="/generated" className="hover:text-text-primary">Generated</Link>
          <Link href="/video" className="text-text-primary">Video</Link>
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

export default async function VideoPage() {
  const { first, total, isLive } = await loadStash();
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="fixed inset-0 -z-10 bg-background-default">
        <div className="absolute inset-0 bg-gradient-holographic" />
      </div>

      <Nav isLive={isLive} />

      <main id="main" className="mx-auto w-full max-w-7xl flex-1 space-y-10 px-6 py-10">
        <section className="space-y-4">
          <div className="flex flex-col items-start gap-2">
            <Badge tone="primary">Video</Badge>
            <h1 className="font-heading text-4xl font-bold text-text-primary">
              Video Lane Surface
            </h1>
            <p className="max-w-2xl font-body text-text-secondary">
              {total} clips from the ComfyUI-Harness video-pipeline-lane
              (<code className="font-mono">03_LANES/video/</code>). Default model
              is <code className="font-mono">stabilityai/stable-video-diffusion-img2vid-xt</code>;
              clips link back to their source image, prompt, and workflow ID.
              {isLive ? "" : " Currently showing demo data — start Stash (`:9999`) and run the video lane to see live runs."}
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-lg font-semibold text-text-primary">Recent</h2>
          {first.length === 0 ? (
            <Card>
              <p className="font-body text-text-secondary">
                No videos yet. Run the SVD i2v lane on the ComfyUI-Harness side,
                then re-run the Stash indexer to populate this surface.
              </p>
            </Card>
          ) : (
            <VideoGrid items={first} />
          )}
        </section>
      </main>
    </div>
  );
}
