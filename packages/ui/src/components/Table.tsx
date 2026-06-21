import * as React from "react";

/**
 * Chromatic Table — semantic data table with header, body, footer, and
 * optional sortable columns. Styling is token-driven; consumers provide
 * data shape via generics.
 */

export interface TableColumn<T> {
  id: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
  sortable?: boolean;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  caption?: string;
  emptyMessage?: string;
}

export function Table<T>({
  columns,
  rows,
  rowKey,
  caption,
  emptyMessage = "No data",
}: TableProps<T>) {
  const [sort, setSort] = React.useState<{ colId: string; dir: "asc" | "desc" } | null>(null);

  const sortedRows = React.useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.id === sort.colId);
    if (!col) return rows;
    return [...rows].sort((a, b) => {
      const av = col.cell(a);
      const bv = col.cell(b);
      const cmp = String(av).localeCompare(String(bv));
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [rows, columns, sort]);

  return (
    <div className="glass overflow-x-auto rounded-md">
      <table className="w-full border-collapse font-body text-sm">
        {caption && <caption className="px-4 py-2 text-left text-text-secondary">{caption}</caption>}
        <thead>
          <tr className="border-b border-border-default bg-background-elevated">
            {columns.map((c) => {
              const isSorted = sort?.colId === c.id;
              const align = c.align ?? "left";
              return (
                <th
                  key={c.id}
                  scope="col"
                  className={`px-4 py-3 font-heading text-xs font-semibold uppercase tracking-wide text-text-secondary ${
                    align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"
                  }`}
                >
                  {c.sortable ? (
                    <button
                      type="button"
                      onClick={() =>
                        setSort((s) =>
                          s?.colId === c.id
                            ? { colId: c.id, dir: s.dir === "asc" ? "desc" : "asc" }
                            : { colId: c.id, dir: "asc" },
                        )
                      }
                      className="inline-flex items-center gap-1 transition hover:text-text-primary"
                    >
                      {c.header}
                      <span aria-hidden>{isSorted ? (sort?.dir === "asc" ? "▲" : "▼") : "↕"}</span>
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedRows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-text-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedRows.map((row) => (
              <tr
                key={rowKey(row)}
                className="border-b border-border-default transition hover:bg-surface-hover"
              >
                {columns.map((c) => {
                  const align = c.align ?? "left";
                  return (
                    <td
                      key={c.id}
                      className={`px-4 py-3 text-text-primary ${
                        align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"
                      }`}
                    >
                      {c.cell(row)}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;