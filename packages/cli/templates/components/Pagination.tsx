import * as React from "react";

/**
 * Chromatic Pagination — page navigation with first/prev/next/last
 * and an ellipsis-collapsed range. Keyboard-accessible buttons.
 */

export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  siblingCount?: number; // pages to show on each side of current
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function buildItems(page: number, total: number, sibling: number): (number | "ellipsis")[] {
  const totalNumbers = sibling * 2 + 5;
  if (total <= totalNumbers) return range(1, total);
  const left = Math.max(page - sibling, 1);
  const right = Math.min(page + sibling, total);
  const showLeftEllipsis = left > 2;
  const showRightEllipsis = right < total - 1;
  if (!showLeftEllipsis && showRightEllipsis) {
    return [...range(1, 3 + 2 * sibling), "ellipsis", total];
  }
  if (showLeftEllipsis && !showRightEllipsis) {
    return [1, "ellipsis", ...range(total - (3 + 2 * sibling), total)];
  }
  return [1, "ellipsis", ...range(left, right), "ellipsis", total];
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  if (pageCount <= 1) return null;
  const items = buildItems(page, pageCount, siblingCount);
  const go = (p: number) => () => {
    if (p < 1 || p > pageCount || p === page) return;
    onPageChange(p);
  };

  const btn =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-border-default bg-surface-default px-3 font-body text-sm text-text-primary transition hover:border-primary-700 hover:text-text-primary disabled:opacity-40 disabled:pointer-events-none";

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center gap-1">
      <button type="button" className={btn} onClick={go(1)} disabled={page === 1} aria-label="First page">
        «
      </button>
      <button type="button" className={btn} onClick={go(page - 1)} disabled={page === 1} aria-label="Previous page">
        ‹
      </button>
      {items.map((it, i) =>
        it === "ellipsis" ? (
          <span key={`e-${i}`} className="px-2 text-text-muted">…</span>
        ) : (
          <button
            key={it}
            type="button"
            onClick={go(it)}
            aria-current={it === page ? "page" : undefined}
            aria-label={`Page ${it}`}
            className={`${btn} ${it === page ? "border-primary-600 bg-primary-600 text-text-onprimary shadow-glow-hover" : ""}`}
          >
            {it}
          </button>
        ),
      )}
      <button type="button" className={btn} onClick={go(page + 1)} disabled={page === pageCount} aria-label="Next page">
        ›
      </button>
      <button type="button" className={btn} onClick={go(pageCount)} disabled={page === pageCount} aria-label="Last page">
        »
      </button>
    </nav>
  );
}

export default Pagination;