import React from "react"
import { Button } from "../../../components/ui/button"
import { Avatar } from "../../../components/ui/avatar"
import { Plus, ChevronLeft, ChevronRight, ChevronDown, Trash2, Play, MessageCircle } from "lucide-react"

import type { ScheduleItem, Category } from "./types"


type CalendarViewProps = {
    viewMode: "daily" | "weekly" | "monthly"
    setViewMode: (m: "daily" | "weekly" | "monthly") => void
    monthOffset: number
    setMonthOffset: (n: number) => void
    monthLabel: string
    filteredItems: ScheduleItem[]
    onAddClick: () => void
    handlers: any
}

export function CalendarView({ viewMode, setViewMode, monthOffset, setMonthOffset, monthLabel, filteredItems, onAddClick, handlers }: CalendarViewProps) {
    const timeSlots = React.useMemo(() => [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20], [])

    const formatHour = (hour: number) => {
        if (hour === 12) return "12PM"
        if (hour > 12) return `${hour - 12}PM`
        return `${hour}AM`
    }

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const monthDays = Array.from({ length: 31 }, (_, i) => i + 1)

    return (
        <div className="grid gap-6 lg:grid-cols-1">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center justify-between">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <button onClick={() => setMonthOffset((m) => m - 1)} className="rounded-lg p-1 hover:bg-gray-100">
                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <span className="text-sm font-medium text-gray-900 min-w-[140px] text-center">{monthLabel}</span>
                    <button onClick={() => setMonthOffset((m) => m + 1)} className="rounded-lg p-1 hover:bg-gray-100">
                        <ChevronRight className="h-5 w-5 text-gray-600" />
                    </button>
                </div>

                <div className="flex gap-2 rounded-lg border border-gray-200 p-[4px]">
                    {(["daily", "weekly", "monthly"] as const).map((mode) => (
                        <button key={mode} onClick={() => setViewMode(mode)} className={`rounded px-3 py-1 text-[14px] font-inter text-[#8E8E93] font-medium capitalize transition-colors ${viewMode === mode ? "bg-white text-primary" : "text-gray-600 hover:bg-gray-100"}`}>
                            {mode}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2">
                    <Button onClick={onAddClick} className="text-[14px] lg:text-[16px] font-inter flex items-center gap-2 px-[12px] py-[12px] bg-primary text-white hover:bg-cyan-600">
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Schedule Meeting</span>
                        <span className="sm:hidden">Add</span>
                    </Button>
                </div>
            </div>

            {viewMode === "daily" && (
                <div className="space-y-3">
                    {timeSlots.map((hour) => (
                        <div key={hour}>
                            <div className="flex items-center gap-4">
                                <span className="w-12 lg:w-16 text-xs font-medium text-gray-500">{formatHour(hour)}</span>
                                <div className="h-px flex-1 bg-gray-200" />
                            </div>

                            {filteredItems.filter((si) => si.hour === hour).map((item) => (
                                <div key={item.id} className={`mt-3 flex flex-col gap-4 rounded-lg ${item.color} p-4 transition-all hover:shadow-md lg:flex-row lg:items-center`}>
                                    <Avatar className="h-[44px] w-[44px] bg-gray-300 text-xs font-medium text-gray-700 self-start lg:self-center">{item.avatar}</Avatar>
                                    <div className="flex-1">
                                        <div className="text-xs text-gray-600">{item.time}</div>
                                        <div className="mt-1 text-sm font-medium text-gray-900">{item.title}</div>
                                        {item.expanded && <div className="mt-2 text-xs text-gray-600">{item.notes}</div>}
                                    </div>
                                    <div className="flex items-center gap-2 self-end lg:self-center">
                                        <button onClick={() => handlers.toggleExpand(item.id)} className="text-gray-400 hover:text-gray-600">
                                            <ChevronDown className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => handlers.handleDelete(item)} className="text-red-500 hover:text-red-700">
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {hour === 11 && (
                                <button onClick={onAddClick} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-600 transition-colors hover:border-gray-400 hover:bg-gray-50">
                                    <Plus className="h-4 w-4" /> Add Schedules
                                </button>
                            )}
                        </div>
                    ))}

                    {filteredItems.length === 0 && (
                        <div className="py-12 text-center">
                            <p className="text-sm text-gray-500">No schedules match the selected filters</p>
                            <p className="mt-1 text-xs text-gray-400">Try selecting different filter options</p>
                        </div>
                    )}
                </div>
            )}

            {viewMode === "weekly" && (
                <div className="overflow-x-auto">
                    <div className="grid min-w-[700px] grid-cols-7 gap-2">
                        {dayNames.map((dayName, dayIndex) => {
                            const dateNumber = 15 + dayIndex
                            return (
                                <div key={dayIndex} className="space-y-2">
                                    <div className="rounded-lg bg-gray-100 p-2 text-center">
                                        <div className="text-xs font-semibold text-gray-700">{dayName}</div>
                                        <div className="text-lg font-bold text-gray-900">{dateNumber}</div>
                                    </div>

                                    <div className="space-y-2">
                                        {filteredItems.filter((si) => si.dayOfWeek === dayIndex).map((item) => (
                                            <div key={item.id} className={`rounded-lg ${item.color} p-3 transition-all hover:shadow-md`}>
                                                <div className="mb-1 flex items-center gap-2">
                                                    <Avatar className="h-6 w-6 bg-gray-300 text-[10px] font-medium text-gray-700">{item.avatar}</Avatar>
                                                    <div className="text-[10px] text-gray-600">{item.time.split(" - ")[0]}</div>
                                                </div>
                                                <div className="text-xs font-medium leading-tight text-gray-900">{item.title}</div>
                                                <div className="mt-2 flex justify-end gap-2">
                                                    <button onClick={() => handlers.toggleExpand(item.id)} className="text-gray-600">
                                                        <ChevronDown className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => handlers.handleDelete(item)} className="text-red-500">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                {item.expanded && <div className="mt-2 text-xs text-gray-600">{item.notes}</div>}
                                            </div>
                                        ))}

                                        {!filteredItems.some((si) => si.dayOfWeek === dayIndex) && (
                                            <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 text-center">
                                                <p className="text-xs text-gray-400">No events</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {viewMode === "monthly" && (
                <div className="space-y-4">
                    <div className="grid grid-cols-7 gap-2">
                        {dayNames.map((dayName) => (
                            <div key={dayName} className="p-2 text-center text-xs font-semibold text-gray-600">
                                <span className="hidden sm:inline">{dayName}</span>
                                <span className="sm:hidden">{dayName.slice(0, 1)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1 lg:gap-2">
                        {monthDays.map((day) => {
                            const eventsForDay = filteredItems.filter((si) => si.day === day)
                            const hasEvents = eventsForDay.length > 0
                            return (
                                <div key={day} className={`min-h-[80px] lg:min-h-[100px] rounded-lg border p-2 transition-all hover:shadow-md ${hasEvents ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-50"}`}>
                                    <div className="mb-2 text-xs lg:text-sm font-semibold text-gray-900">{day}</div>

                                    <div className="space-y-1">
                                        {eventsForDay.slice(0, 2).map((item) => (
                                            <div key={item.id} className={`rounded ${item.color} px-1 lg:px-2 py-1 text-[10px] font-medium leading-tight text-gray-900`}>
                                                <div className="hidden lg:block">{item.time.split(" - ")[0]} {item.title.substring(0, 15)}...</div>
                                                <div className="lg:hidden">{item.title.substring(0, 8)}...</div>
                                            </div>
                                        ))}

                                        {eventsForDay.length > 2 && <div className="px-1 lg:px-2 text-[10px] font-medium text-gray-500">+{eventsForDay.length - 2}</div>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}