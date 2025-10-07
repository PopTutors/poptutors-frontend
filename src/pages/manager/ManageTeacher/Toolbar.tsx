// src/pages/manager/ManageTeacher/components/Toolbar.tsx
import React from "react";
import { Search, Filter, Grid, Menu } from "lucide-react";

interface ToolbarProps {
    query: string;
    onQueryChange: (q: string) => void;
    onOpenFilter: () => void;
    activeFilterCount?: number;
    onAdd: () => void;
    addBusy?: boolean;
    // optional: grid toggle hooks (if you want to control list/grid view from toolbar)
    grid?: boolean;
    onToggleGrid?: () => void;
}

const saveButtonClass = "m-0 w-[164px] h-[37px] rounded-none text-[16px] font-semibold bg-[#019ACB]";

export default function Toolbar({
    query,
    onQueryChange,
    onOpenFilter,
    activeFilterCount = 0,
    onAdd,
    addBusy = false,
    grid,
    onToggleGrid,
}: ToolbarProps) {
    return (
        <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Total Teachers</h2>

            <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                    <input
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        placeholder="Search..."
                        className="h-9 w-64 border border-border bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-primary)]"
                        aria-label="Search teachers"
                    />
                </div>

                {/* Filter button */}
                <button
                    type="button"
                    aria-label="Filter"
                    onClick={onOpenFilter}
                    className="relative h-9 border border-border bg-card px-3 text-sm hover:bg-muted flex items-center gap-2"
                >
                    <Filter className="size-4" />
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 rounded-full text-xs bg-[var(--brand-primary)] text-white">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                {/* Optional grid / list toggle */}
                {typeof onToggleGrid === "function" && (
                    <button
                        type="button"
                        aria-label="Toggle grid/list"
                        onClick={onToggleGrid}
                        className="h-9 w-9 border border-border bg-card flex items-center justify-center hover:bg-muted"
                        title={grid ? "Switch to list view" : "Switch to grid view"}
                    >
                        {grid ? <Grid className="size-4" /> : <Menu className="size-4" />}
                    </button>
                )}

                {/* Add Teacher */}
                <div className="flex bg-muted items-center h-[48px]">
                    <button
                        type="button"
                        onClick={onAdd}
                        className={`${saveButtonClass} text-white`}
                        disabled={addBusy}
                        aria-disabled={addBusy}
                    >
                        {addBusy ? "Adding…" : "+ Add Teacher"}
                    </button>
                </div>
            </div>
        </div>
    );
}
