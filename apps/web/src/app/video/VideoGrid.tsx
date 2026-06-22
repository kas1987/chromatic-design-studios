"use client";

import { useState } from "react";
import { Badge, Card } from "@chromatic/ui";
import type { StashVideo } from "@chromatic/stash-client";

type Props = {
  items: StashVideo[];
};

export function VideoGrid({ items }: Props) {
  return (
    <ul
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Generated videos"
    >
      {items.map((v) => (
        <VideoCard key={v.id} video={v} />
      ))}
    </ul>
  );
}

function VideoCard({ video }: { video: StashVideo }) {
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    const text = video.prompt ?? video.title;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      // clipboard unavailable (SSR, headless, permission denied) — UI state
      // already updated above so the user sees feedback either way.
    }
  }

  return (
    <li>
      <Card>
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-md border border-border-default bg-surface-default">
            <video
              src={video.path}
              poster={video.thumbnail}
              controls
              preload="metadata"
              className="block aspect-video w-full bg-black"
              data-testid="video-clip"
            >
              <track kind="captions" />
            </video>
            <div className="absolute right-2 top-2 flex flex-wrap gap-1">
              <Badge tone="primary">{video.workflowId ?? "video"}</Badge>
              {typeof video.fps === "number" ? (
                <Badge tone="default">{video.fps} fps</Badge>
              ) : null}
              {typeof video.durationSec === "number" ? (
                <Badge tone="default">{video.durationSec}s</Badge>
              ) : null}
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="font-heading text-base font-semibold text-text-primary">
              {video.title}
            </h3>
            <p className="font-mono text-xs text-text-secondary">
              {video.model ?? "unknown model"}
            </p>
            <p className="font-mono text-xs text-text-secondary">
              source: {video.sourceImageId ?? "n/a"} · {video.createdAt}
            </p>
            <ul className="flex flex-wrap gap-1 pt-1" aria-label="Tags">
              {video.tags.map((tag) => (
                <li key={tag}>
                  <span className="inline-flex items-center rounded-full border border-border-default bg-surface-default px-2 py-0.5 text-[10px] text-text-secondary">
                    {tag}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between">
            <Badge tone={video.rating >= 4 ? "success" : "default"}>
              ★ {video.rating}/5
            </Badge>
            <button
              type="button"
              onClick={copyPrompt}
              className="rounded-md border border-border-default bg-surface-default px-3 py-1 font-body text-xs text-text-primary hover:bg-surface-hovered"
              aria-label="Copy prompt"
            >
              {copied ? "Copied" : "Copy prompt"}
            </button>
          </div>
        </div>
      </Card>
    </li>
  );
}
