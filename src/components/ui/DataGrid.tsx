// DataGrid.tsx
import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Button,
  Select,
  FormControl,
  Typography,
  Input,
} from "@mui/material";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { MdKeyboardArrowDown } from "react-icons/md";

export type Column<T> = {
  key: string;
  label: string;
  width?: number;
  minWidth?: number;
  align?: "left" | "center" | "right";
  render?: (row: T) => React.ReactNode;
  sortFn?: (a: T, b: T) => number;
  allowOverflow?: boolean;
};

export type GenericTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  pageSize?: number;
  pageSizeOptions?: number[];
  className?: string;
  emptyState?: React.ReactNode;
  onPageChange?: (page: number, pageSize: number) => void;
  onRowClick?: (row: T) => void;
};

type Order = "asc" | "desc";

function descendingComparator<T>(a: T, b: T, orderBy: string) {
  const va = (a as any)[orderBy];
  const vb = (b as any)[orderBy];
  if (vb == null && va == null) return 0;
  if (vb == null) return -1;
  if (va == null) return 1;
  if (typeof vb === "number" && typeof va === "number") return vb - (va as number);
  return String(vb).localeCompare(String(va));
}
function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
  columns: Column<any>[]
): (a: any, b: any) => number {
  const col = columns.find((c) => c.key === (orderBy as string));
  return (a, b) => {
    if (col?.sortFn) {
      const cmp = col.sortFn(a, b);
      return order === "asc" ? cmp : -cmp;
    }
    const cmp = descendingComparator(a, b, orderBy as string);
    return order === "asc" ? -cmp : cmp;
  };
}
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilized = array.map((el, index) => [el, index] as [T, number]);
  stabilized.sort((a, b) => {
    const cmp = comparator(a[0], b[0]);
    if (cmp !== 0) return cmp;
    return a[1] - b[1];
  });
  return stabilized.map((s) => s[0]);
}

export default function DataGrid<T extends Record<string, any>>({
  columns,
  rows,
  pageSize = 12,
  className = "",
  emptyState,
  onPageChange,
  onRowClick
}: GenericTableProps<T>) {
  const [order, setOrder] = React.useState < Order > ("asc");
  const [orderBy, setOrderBy] = React.useState < string > (columns[0]?.key ?? "");
  const [page, setPage] = React.useState < number > (0);
  const [rowsPerPage, setRowsPerPage] = React.useState < number > (pageSize);

  // ---------- Column widths for resizing ----------
  // Map column.key -> width in px
  const initWidths = React.useMemo(() => {
    const map: Record<string, number> = {};
    for (const col of columns) {
      map[col.key] = col.width ?? col.minWidth ?? 120;
    }
    return map;
  }, [columns]);

  const [columnWidths, setColumnWidths] = React.useState < Record < string, number>> (initWidths);

  // If columns change (new keys), sync widths preserving existing
  React.useEffect(() => {
    setColumnWidths((prev) => {
      const next: Record<string, number> = {};
      for (const col of columns) {
        next[col.key] = prev[col.key] ?? col.width ?? col.minWidth ?? 150;
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns.map((c) => c.key).join(",")]); // dependency: column keys

  // Dragging state
  const dragState = React.useRef < {
    dragging: boolean;
    key?: string;
    startX?: number;
    startWidth?: number;
  } > ({ dragging: false });

  // Helper to get minWidth for a column
  const getMinWidth = (key: string) => {
    const col = columns.find((c) => c.key === key);
    return col?.minWidth ?? 60;
  };

  // Mouse handlers
  React.useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragState.current.dragging || !dragState.current.key) return;
      e.preventDefault();
      const delta = e.clientX - (dragState.current.startX ?? 0);
      const newWidth = Math.max(getMinWidth(dragState.current.key), (dragState.current.startWidth ?? 0) + delta);
      setColumnWidths((prev) => ({ ...prev, [dragState.current!.key!]: newWidth }));
    }
    function onMouseUp() {
      if (!dragState.current.dragging) return;
      dragState.current.dragging = false;
      dragState.current.key = undefined;
      dragState.current.startX = undefined;
      dragState.current.startWidth = undefined;
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }
    // Attach only when dragging starts; we'll add/remove listeners from startDrag
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [columns]);

  const startDrag = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    dragState.current.dragging = true;
    dragState.current.key = key;
    dragState.current.startX = e.clientX;
    dragState.current.startWidth = columnWidths[key] ?? (columns.find((c) => c.key === key)?.minWidth ?? 150);

    // attach listeners
    function onMouseMove(e: MouseEvent) {
      if (!dragState.current.dragging || !dragState.current.key) return;
      e.preventDefault();
      const delta = e.clientX - (dragState.current.startX ?? 0);
      const newWidth = Math.max(getMinWidth(dragState.current.key), (dragState.current.startWidth ?? 0) + delta);
      setColumnWidths((prev) => ({ ...prev, [dragState.current!.key!]: newWidth }));
    }
    function onMouseUp() {
      if (!dragState.current.dragging) return;
      dragState.current.dragging = false;
      dragState.current.key = undefined;
      dragState.current.startX = undefined;
      dragState.current.startWidth = undefined;
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }
    document.body.style.cursor = "col-resize";
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // Touch support (basic)
  const startTouchDrag = (e: React.TouchEvent, key: string) => {
    const t = e.touches[0];
    if (!t) return;
    dragState.current.dragging = true;
    dragState.current.key = key;
    dragState.current.startX = t.clientX;
    dragState.current.startWidth = columnWidths[key] ?? (columns.find((c) => c.key === key)?.minWidth ?? 150);

    function onTouchMove(ev: TouchEvent) {
      if (!dragState.current.dragging || !dragState.current.key) return;
      const touch = ev.touches[0];
      const delta = touch.clientX - (dragState.current.startX ?? 0);
      const newWidth = Math.max(getMinWidth(dragState.current.key), (dragState.current.startWidth ?? 0) + delta);
      setColumnWidths((prev) => ({ ...prev, [dragState.current!.key!]: newWidth }));
    }
    function onTouchEnd() {
      dragState.current.dragging = false;
      dragState.current.key = undefined;
      dragState.current.startX = undefined;
      dragState.current.startWidth = undefined;
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    }
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);
  };

  // ---------- Sorting & pagination ----------
  const comparator = React.useMemo(() => getComparator(order, orderBy as any, columns), [order, orderBy, columns]);
  const sorted = React.useMemo(() => stableSort(rows, comparator), [rows, comparator]);

  React.useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage));
    setPage((p) => Math.min(p, totalPages - 1));
  }, [rows.length, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage));
  const paginated = React.useMemo(() => {
    const start = page * rowsPerPage;
    return sorted.slice(start, start + rowsPerPage);
  }, [sorted, page, rowsPerPage]);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const gotoPage = (p: number) => {
    const next = Math.max(0, Math.min(totalPages - 1, p));
    setPage(next);
    onPageChange?.(next, rowsPerPage);
  };

  const handlePageSelect = (e: React.ChangeEvent<{ value: unknown }>) => {
    const selected = Number(e.target.value);
    if (!Number.isNaN(selected)) gotoPage(selected - 1);
  };

  const visiblePageNumbers = React.useMemo(() => {
    const maxButtons = 7;
    if (totalPages <= maxButtons) return Array.from({ length: totalPages }, (_, i) => i);
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(0, page - half);
    let end = start + maxButtons - 1;
    if (end >= totalPages) {
      end = totalPages - 1;
      start = end - (maxButtons - 1);
    }
    return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
  }, [totalPages, page]);

  return (
    <Box
      className={className}
      sx={{
        boxShadow: "none",
        fontFamily: "Inter, sans-serif",
        fontSize: 16,
        color: "#141414",
      }}
    >
      <TableContainer
        // component={Box}
        sx={{
          borderRadius: 0,
          border: "1px solid #e6e6e6",
        }}
        className="shadow-sm"
      >
        <Table sx={{ width: "100%", minWidth: 0, overflow: "scroll" }} size="medium">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#fafafa", cursor: onRowClick ? "pointer" : "default" }} onClick={() => onRowClick?.(row)} >
              {columns.map((col, index) => {
                const width = columnWidths[col.key];
                return (
                  <TableCell
                    key={col.key}
                    align={col.align ?? "left"}
                    sx={{
                      position: "relative",
                      fontFamily: "Inter, sans-serif",
                      fontSize: 16,
                      width: width ? `${width}px` : "auto",
                      minWidth: col.minWidth ? `${col.minWidth}px` : undefined,
                      whiteSpace: "nowrap",
                      px: 2,
                      color: "#141414",
                      userSelect: "none",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <TableSortLabel
                        active={orderBy === col.key}
                        direction={orderBy === col.key ? order : "asc"}
                        onClick={() => handleRequestSort(col.key)}
                        hideSortIcon={true}
                      >
                        <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: 16, fontWeight: 500, color: "#141414" }}>
                          {col.label}
                        </Typography>
                      </TableSortLabel>
                    </Box>

                    {/* Resize handle at right edge */}
                    {
                      index < columns.length - 1 && < div
                        onMouseDown={(e) => startDrag(e, col.key)}
                        onTouchStart={(e) => startTouchDrag(e, col.key)}
                        style={{
                          position: "absolute",
                          right: 0,
                          top: 0,
                          height: "100%",
                          width: 8,
                          transform: "translateX(50%)",
                          cursor: "col-resize",
                          zIndex: 30,
                          // make a bigger hit area but visually small
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            width: 2,
                            height: "60%",
                            background: "rgba(0,0,0,0.12)",
                            borderRadius: 1,
                            pointerEvents: "none",
                          }}
                        />
                      </div>
                    }
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6, color: "#ffff", fontFamily: "Inter, sans-serif" }}>
                  {emptyState ?? "No records"}
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((row, idx) => (
                <TableRow key={(row && (row.id ?? row.jobId ?? idx)) as React.Key} hover sx={{ backgroundColor: "#ffff", cursor: onRowClick ? "pointer" : "default" }} onClick={() => onRowClick?.(row)}>
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      align={col.align ?? "left"}
                      sx={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: 16,
                        px: 2,
                        color: "#141414",
                        whiteSpace: col.allowOverflow ? "normal" : "nowrap",
                        overflow: col.allowOverflow ? "visible" : "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: col.width ? `${col.width}px` : undefined,
                        width: columnWidths[col.key] ? `${columnWidths[col.key]}px` : undefined,
                        fontWeight: 500
                      }}
                    >
                      {col.render ? col.render(row) : String((row as any)[col.key] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 4,
          mt: 2,
          px: 2,
          fontFamily: "Inter, sans-serif",
          fontSize: 16,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, color: "#6b7280" }}>
          <span>Showing</span>
          <FormControl
            variant="standard"
            size="small"
            sx={{
              width: 40,
              background: "#f6f6f6",
              padding: "8px 6px 6px 6px",
              fontFamily: "Inter, sans-serif",
              fontSize: 16,
            }}
          >
            <Select
              value={page + 1}
              onChange={handlePageSelect}
              sx={{
                fontSize: 16,
                fontFamily: "Inter, sans-serif",
                border: 0,
                color: "#141414",
              }}
              native
              input={<Input disableUnderline />}
              IconComponent={MdKeyboardArrowDown}
            >
              {Array.from({ length: totalPages }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </Select>
          </FormControl>
          <span>out of {totalPages}</span>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: 16, color: "#6b7280" }}>
            Page {page + 1} of {totalPages}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="text"
              size="small"
              onClick={() => gotoPage(Math.max(0, page - 1))}
              disabled={page === 0}
              sx={{ minWidth: 32, height: 32, background: "#f6f6f6", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 0 }}
            >
              <ChevronLeft className={`text-[${page === 0 ? "#BEBFC2" : "#141414"}]`} />
            </Button>
            <Box sx={{ display: "flex", gap: 1 }}>
              {visiblePageNumbers.map((p) => {
                const active = p === page;
                return (
                  <Button
                    key={p}
                    onClick={() => gotoPage(p)}
                    variant={active ? "contained" : "text"}
                    size="small"
                    sx={{
                      minWidth: 32,
                      height: 32,
                      bgcolor: active ? "#111827" : "#f6f6f6",
                      color: active ? "#fff" : "#111827",
                      "&:hover": { bgcolor: active ? "#111827" : "rgba(0,0,0,0.04)" },
                      borderRadius: 0,
                      fontFamily: "Inter, sans-serif",
                      fontSize: 16,
                      boxShadow: 0,
                    }}
                  >
                    {p + 1}
                  </Button>
                );
              })}
            </Box>
            <Button
              variant="text"
              size="small"
              onClick={() => gotoPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              sx={{ minWidth: 32, height: 32, background: "#f6f6f6", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 0 }}
            >
              <ChevronRight className={`text-[${page >= totalPages - 1 ? "#BEBFC2" : "#141414"}]`} />
            </Button>
          </Box>
        </Box>
      </Box>
    </Box >
  );
}
