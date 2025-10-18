import React from "react";
import { Search, Filter } from "lucide-react";

interface Update {
    id: string;
    teacher: string;
    location: string;
    type: string;
    actionTaker: string;
    action: string;
    actionColorClass: string;
    date: string;
    time: string;
}

interface MobileUpdatesViewProps {
    updatesLoading: boolean;
    updates: Update[];
    debouncedSearch: string;
    search: string;
    onSearchChange: (search: string) => void;
}

export default function MobileUpdatesView({
    updatesLoading,
    updates,
    debouncedSearch,
    search,
    onSearchChange,
}: MobileUpdatesViewProps) {
    return (
        <div className="space-y-6">
            <section className="bg-white shadow-sm border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Recent Updates</h2>
                    <button className="px-3 py-1 rounded-md border border-gray-200 text-sm hover:bg-gray-50">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>

                {/* Mobile Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search updates..."
                        className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                        aria-label="Search updates"
                    />
                </div>

                {/* Updates List */}
                <div className="space-y-3">
                    {(updatesLoading ? [] : updates ?? [])
                        .filter((u: Update) =>
                            (u.teacher || "").toLowerCase().includes(debouncedSearch.toLowerCase())
                        )
                        .map((u: Update) => (
                            <div
                                key={u.id}
                                className="border border-gray-200 rounded-lg p-3 space-y-2"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                                        <span className="text-xs text-gray-600">ML</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium">{u.teacher}</p>
                                        <p className="text-xs text-gray-500">
                                            {u.location} • {u.type}
                                        </p>
                                    </div>
                                </div>
                                <div className="pl-11 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-600">Action by: {u.actionTaker}</span>
                                        <span
                                            className={`${u.actionColorClass} px-2 py-1 text-xs rounded-full font-medium`}
                                        >
                                            {u.action}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {u.date} • {u.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </section>
        </div>
    );
}