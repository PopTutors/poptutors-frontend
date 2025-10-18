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

interface RecentUpdatesSectionProps {
    updatesLoading: boolean;
    updates: Update[];
    debouncedSearch: string;
    search: string;
    onSearchChange: (search: string) => void;
}

export default function RecentUpdatesSection({
    updatesLoading,
    updates,
    debouncedSearch,
    search,
    onSearchChange,
}: RecentUpdatesSectionProps) {
    return (
        <section className="bg-white shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Recent Updates</h2>
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search..."
                            className="pl-10 pr-3 py-2 rounded-md border border-gray-200 w-64 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                            aria-label="Search updates"
                        />
                    </div>
                    <button className="px-3 py-1 rounded-md border border-gray-200 text-sm hover:bg-gray-50">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left">Teacher</th>
                            <th className="px-6 py-3">Action Taker</th>
                            <th className="px-6 py-3">Action</th>
                            <th className="px-6 py-3">Date & Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {(updatesLoading ? [] : updates ?? [])
                            .filter((u: Update) =>
                                (u.teacher || "").toLowerCase().includes(debouncedSearch.toLowerCase())
                            )
                            .map((u: Update) => (
                                <tr
                                    key={u.id}
                                    className="hover:bg-gray-50 group cursor-pointer h-[80px] text-[16px] text-center text-[#141414]"
                                >
                                    <td className="py-4 px-4 align-top text-left">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-left">
                                                <span className="text-xs text-gray-600">ML</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-left">{u.teacher}</p>
                                                <p className="text-xs text-gray-500 text-left">
                                                    {u.location} • {u.type}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-sm align-top">{u.actionTaker}</td>
                                    <td className="py-4 px-4 align-top">
                                        <span
                                            className={`${u.actionColorClass} inline-block px-3 py-1 text-xs rounded-full font-medium`}
                                        >
                                            {u.action}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 align-top text-sm">
                                        <div>
                                            <p>{u.date}</p>
                                            <p className="text-gray-500">{u.time}</p>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}