import React, { useEffect, useMemo, useRef, useState } from 'react';

export type Column<T> = {
  key: string; // unique key
  label: string;
  width?: number; // initial px width
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  render?: (row: T) => React.ReactNode;
  sortFn?: (a: T, b: T) => number;
  // optional: allow overflow for popovers/menus in this column
  allowOverflow?: boolean;
};

export type DataGridProps<T> = {
  columns: Column<T>[];
  rows: T[];
  pageSize?: number;
  className?: string;
};

/**
 * Reusable DataGrid
 * - Resizable columns (pointer events)
 * - Sorting by header click (toggle asc/desc)
 * - Pagination (simple)
 * - Custom render per column
 *
 * Styling: expects Tailwind to be available.
 */
export function DataGrid<T extends Record<string, any>>({
  columns,
  rows,
  pageSize = 10,
  className = '',
}: DataGridProps<T>) {
  // initial widths
  const initialWidths = columns.map((c) => c.width ?? 140);
  const [colWidths, setColWidths] = useState<number[]>(initialWidths);

  // sorting
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // pagination
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));

  // resizing
  const resizingRef = useRef<null | { idx: number; startX: number; startW: number }>(null);

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      if (!resizingRef.current) return;
      const { idx, startX, startW } = resizingRef.current;
      const delta = e.clientX - startX;
      const next = [...colWidths];
      next[idx] = Math.max(columns[idx].minWidth ?? 60, Math.round(startW + delta));
      setColWidths(next);
    }
    function onPointerUp() {
      resizingRef.current = null;
    }
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [colWidths, columns]);

  // sorting logic
  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    const col = columns.find((c) => c.key === sortKey);
    const copy = [...rows];
    if (col?.sortFn) copy.sort(col.sortFn);
    else {
      copy.sort((a, b) => {
        const va = a[sortKey];
        const vb = b[sortKey];
        if (va == null) return 1;
        if (vb == null) return -1;
        if (typeof va === 'number' && typeof vb === 'number') return va - vb;
        return String(va).localeCompare(String(vb));
      });
    }
    if (sortDir === 'desc') copy.reverse();
    return copy;
  }, [rows, sortKey, sortDir, columns]);

  // paginated rows
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, page, pageSize]);

  function handleStartResize(e: React.PointerEvent, idx: number) {
    (e.target as Element).setPointerCapture?.((e as any).pointerId);
    resizingRef.current = { idx, startX: e.clientX, startW: colWidths[idx] };
  }

  function toggleSort(key: string) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  // ensure page stays in bounds when rows change
  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(1, Math.ceil(rows.length / pageSize))));
  }, [rows.length, pageSize]);

  return (
    <div className={`bg-white ${className}`}>
      <div className="border border-black/10 bg-white shadow-sm">
        {/* Header */}
        <div className="flex bg-black/2 border-b border-black/10 select-none">
          {columns.map((col, idx) => (
            <div
              key={col.key}
              className="relative flex items-center px-4 py-4 text-base font-normal"
              style={{ width: colWidths[idx], minWidth: col.minWidth ?? 60 }}
            >
              {/* Header label: truncation & no-wrap */}
              <div
                className={`flex-1 cursor-pointer ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}`}
                onClick={() => toggleSort(col.key)}
                title={col.label}
              >
                <div className="flex items-center gap-2">
                  <span className="block truncate" style={{ maxWidth: '100%' }}>
                    {col.label}
                  </span>
                  {sortKey === col.key && <span className="text-xs">{sortDir === 'asc' ? '▲' : '▼'}</span>}
                </div>
              </div>

              {/* resizer */}
              <div
                onPointerDown={(e) => handleStartResize(e, idx)}
                onDoubleClick={() =>
                  setColWidths((w) => w.map((val, i) => (i === idx ? (columns[i].width ?? 140) : val)))
                }
                className="absolute right-0 top-0 h-full w-2 -mr-2 cursor-col-resize touch-manipulation"
                style={{ zIndex: 10 }}
                role="separator"
                aria-orientation="horizontal"
              />
            </div>
          ))}
        </div>

        {/* Body rows */}
        {paginated.map((row, rI) => (
          <div key={rI} className={`flex items-center ${rI < paginated.length - 1 ? 'border-b border-black/10' : ''}`}>
            {columns.map((col, cI) => {
              // allow overflow if column explicitly allows it (or if key === 'action' for compatibility)
              const allowOverflow = col.allowOverflow ?? (col.key === 'action');
              return (
                <div
                  key={col.key}
                  className="px-4 py-4 text-base"
                  style={{ width: colWidths[cI], minWidth: col.minWidth ?? 60, overflow: allowOverflow ? 'visible' : 'hidden' }}
                >
                  <div className={`${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}`}>
                    {col.render ? (
                      <div className="truncate block" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {col.render(row)}
                      </div>
                    ) : (
                      <span className="truncate block" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {(row as any)[col.key]}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer / pagination */}
      <div className="px-6 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-xs text-gray-400">
          <span>Showing</span>
          <div className="flex items-center gap-1 px-2 py-1.5 bg-black/4">
            <span className="text-mentoos-text-primary font-medium">{paginated.length}</span>
            <svg className="w-3 h-3 text-mentoos-text-primary/70" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span>out of {rows.length}</span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="p-1.5 bg-black/4 hover:bg-black/8 transition-colors">
            <svg className="w-3.5 h-3.5 text-gray-300" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-[30px] py-1.5 text-xs font-medium ${page === i + 1 ? 'bg-mentoos-text-primary text-white' : 'bg-black/4 text-mentoos-text-primary'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="p-1.5 bg-black/4 hover:bg-black/8 transition-colors">
            <svg className="w-3.5 h-3.5 text-mentoos-text-primary" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataGrid;
