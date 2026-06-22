"use client";

import * as React from "react";
import { Card, Badge } from "@chromatic/ui";
import type { StashImage } from "@chromatic/stash-client";

type Props = {
  items: StashImage[];
};

function copy(text: string): void {
  if (typeof navigator === "undefined") return;
  try {
    navigator.clipboard?.writeText(text);
  } catch {
    /* non-fatal */
  }
}

export function GeneratedGrid({ items }: Props) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = React.useCallback((id: string, text: string) => {
    copy(text);
    setCopiedId(id);
    const handle = window.setTimeout(() => {
      setCopiedId((cur) => (cur === id ? null : cur));
    }, 1200);
    return () => window.clearTimeout(handle);
  }, []);

  return (
    <ul
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      data-testid="generated-grid"
      aria-label="Generated images"
    >
      {items.map((img) => (
        <li key={img.id}>
          <Card className="overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.thumbnail}
              alt={img.title}
              width={320}
              height={320}
              loading="lazy"
              className="aspect-square w-full bg-surface-sunken object-cover"
            />
            <div className="space-y-2 p-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-heading text-sm font-semibold text-text-primary">
                  {img.title}
                </h3>
                <Badge tone="primary" aria-label={`rating ${img.rating} of 5`}>
                  ★ {img.rating}
                </Badge>
              </div>
              <p className="font-mono text-xs text-text-secondary" data-testid="workflow-id">
                {img.workflowId ?? "—"}
              </p>
              <div className="flex flex-wrap gap-1">
                {img.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border-default px-2 py-0.5 text-[10px] uppercase tracking-wide text-text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {img.prompt ? (
                <button
                  type="button"
                  onClick={() => handleCopy(img.id, img.prompt!)}
                  className="w-full rounded-md border border-border-default bg-surface-default px-2 py-1 text-left text-[11px] text-text-secondary transition hover:border-border-hover hover:text-text-primary focus-visible:outline-none focus-visible:shadow-glow-focus"
                  aria-label={`Copy prompt for ${img.title}`}
                >
                  {copiedId === img.id ? "Copied!" : "Copy prompt"}
                </button>
              ) : null}
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
