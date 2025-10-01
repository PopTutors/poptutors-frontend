"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { Card } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Avatar } from "../../../components/ui/avatar"
import { Checkbox } from "../../../components/ui/checkbox"
import {
    Calendar,
    Info,
    AlertTriangle,
    Users,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Plus,
    Trash2,
} from "lucide-react"

type Category = "interview" | "internal" | "team" | "task" | "reminder"

type ScheduleItem = {
    id: string
    time: string
    title: string
    avatar: string
    color: string
    category: Category
    hour: number
    day: number // day of month
    dayOfWeek: number // 0-6
    notes?: string
    expanded?: boolean
}

const STORAGE_KEY = "my_session_schedules_v1"

const defaultItems: ScheduleItem[] = [
    {
        id: "1",
        time: "8:00AM - 10:00AM",
        title: "Math tutoring session with Prof. Sharma (Student: Riya Patel)",
        avatar: "PS",
        color: "bg-amber-50",
        category: "task",
        hour: 8,
        day: 15,
        dayOfWeek: 1,
    },
    {
        id: "2",
        time: "12:00PM - 1:00PM",
        title: "English literature review with Dr. Mehta (Student: Aarav Singh)",
        avatar: "DM",
        color: "bg-amber-50",
        category: "task",
        hour: 12,
        day: 15,
        dayOfWeek: 1,
    },
    {
        id: "3",
        time: "2:00PM - 4:00PM",
        title: "Physics lab discussion with Prof. Verma (Student: Neha Joshi)",
        avatar: "PV",
        color: "bg-amber-50",
        category: "task",
        hour: 14,
        day: 16,
        dayOfWeek: 2,
    },
    {
        id: "4",
        time: "6:00PM - 7:00PM",
        title: "Chemistry assignment help with Dr. Rao (Student: Karan Shah)",
        avatar: "DR",
        color: "bg-amber-50",
        category: "task",
        hour: 18,
        day: 17,
        dayOfWeek: 3,
    },
    {
        id: "5",
        time: "8:00PM - 10:00PM",
        title: "History project guidance with Prof. Kapoor (Student: Ananya Desai)",
        avatar: "PK",
        color: "bg-amber-50",
        category: "task",
        hour: 20,
        day: 18,
        dayOfWeek: 4,
    },
    {
        id: "6",
        time: "9:00AM - 10:00AM",
        title: "Logo and branding guide for project 2",
        avatar: "LB",
        color: "bg-emerald-50",
        category: "team",
        hour: 9,
        day: 16,
        dayOfWeek: 2,
    },
    {
        id: "7",
        time: "9:00AM - 10:00AM",
        title: "Meeting with andia about New UX concept",
        avatar: "MA",
        color: "bg-blue-50",
        category: "internal",
        hour: 9,
        day: 17,
        dayOfWeek: 3,
    },
    {
        id: "8",
        time: "9:00AM - 10:00AM",
        title: "Interview UI Designers for new Finance SaaS idea",
        avatar: "UI",
        color: "bg-rose-50",
        category: "interview",
        hour: 9,
        day: 15,
        dayOfWeek: 1,
    },
    {
        id: "9",
        time: "9:00AM - 10:00AM",
        title: "UX testing with Senior developers",
        avatar: "UX",
        color: "bg-gray-50",
        category: "reminder",
        hour: 9,
        day: 19,
        dayOfWeek: 5,
    },
    {
        id: "10",
        time: "10:00AM - 11:00AM",
        title: "Team standup meeting",
        avatar: "TS",
        color: "bg-blue-50",
        category: "internal",
        hour: 10,
        day: 20,
        dayOfWeek: 6,
    },
    {
        id: "11",
        time: "3:00PM - 4:00PM",
        title: "Client presentation review",
        avatar: "CP",
        color: "bg-emerald-50",
        category: "team",
        hour: 15,
        day: 22,
        dayOfWeek: 1,
    },
]

function CategoryDropdown({
    selectedFilters,
    toggleFilter,
}: {
    selectedFilters: {
        interviewSchedule: boolean
        internalMeeting: boolean
        teamSchedule: boolean
        myTask: boolean
        reminders: boolean
    }
    toggleFilter: (k: keyof typeof selectedFilters) => void
}) {
    const [open, setOpen] = useState(false)
    const ref = useRef < HTMLDivElement | null > (null)

    useEffect(() => {
        function onDoc(e: MouseEvent) {
            if (!ref.current) return
            if (e.target instanceof Node && !ref.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", onDoc)
        return () => document.removeEventListener("mousedown", onDoc)
    }, [])

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-haspopup="true"
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                Category
                <ChevronDown className="h-4 w-4 text-gray-600" />
            </button>

            {open && (
                <div
                    role="menu"
                    aria-label="Category filters"
                    className="absolute right-0 z-40 mt-2 w-64 rounded-md border border-gray-200 bg-white shadow-lg"
                >
                    <div className="p-3 text-sm font-medium text-gray-800">Category</div>

                    <div className="divide-y divide-gray-100">
                        <div className="p-3 space-y-2 w-full">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <Checkbox
                                    checked={selectedFilters.interviewSchedule}
                                    onCheckedChange={() => toggleFilter("interviewSchedule")}
                                />
                                <span className="text-sm">Interview Schedule</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <Checkbox
                                    checked={selectedFilters.internalMeeting}
                                    onCheckedChange={() => toggleFilter("internalMeeting")}
                                />
                                <span className="text-sm">Internal Meeting</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <Checkbox
                                    checked={selectedFilters.teamSchedule}
                                    onCheckedChange={() => toggleFilter("teamSchedule")}
                                />
                                <span className="text-sm">Team Schedule</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <Checkbox
                                    checked={selectedFilters.myTask}
                                    onCheckedChange={() => toggleFilter("myTask")}
                                />
                                <span className="text-sm">My Task</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <Checkbox
                                    checked={selectedFilters.reminders}
                                    onCheckedChange={() => toggleFilter("reminders")}
                                />
                                <span className="text-sm">Reminders</span>
                            </label>
                        </div>

                        <div className="p-2">
                            <button
                                onClick={() => {
                                    // quick helper: set all filters ON (keeps behavior same as initial)
                                    ; (Object.keys(selectedFilters) as (keyof typeof selectedFilters)[]).forEach((k) => {
                                        if (!selectedFilters[k]) toggleFilter(k)
                                    })
                                }}
                                className="w-full rounded px-3 py-2 text-sm font-medium text-cyan-600 hover:bg-gray-50"
                            >
                                + Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function MySessionPage() {
    const [activeTab, setActiveTab] = useState("calendar")
    const [viewMode, setViewMode] = useState < "daily" | "weekly" | "monthly" > ("weekly")
    const [monthOffset, setMonthOffset] = useState(0)

    const [selectedFilters, setSelectedFilters] = useState({
        interviewSchedule: true,
        internalMeeting: true,
        teamSchedule: true,
        myTask: true,
        reminders: true,
    })

    const [scheduleItems, setScheduleItems] = useState < ScheduleItem[] > (() => {
        try {
            const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null
            if (raw) return JSON.parse(raw)
        } catch (e) { }
        return defaultItems
    })

    const [isModalOpen, setIsModalOpen] = useState(false)

    const [form, setForm] = useState({
        title: "",
        avatar: "",
        color: "bg-amber-50",
        category: "task" as Category,
        startHour: 9,
        endHour: 10,
        day: 15,
        notes: "",
    })

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(scheduleItems))
        } catch (e) { }
    }, [scheduleItems])

    const toggleFilter = (key: keyof typeof selectedFilters) =>
        setSelectedFilters((p) => ({ ...p, [key]: !p[key] }))

    const filteredScheduleItems = useMemo(() => {
        return scheduleItems.filter((item) => {
            if (item.category === "interview" && selectedFilters.interviewSchedule) return true
            if (item.category === "internal" && selectedFilters.internalMeeting) return true
            if (item.category === "team" && selectedFilters.teamSchedule) return true
            if (item.category === "task" && selectedFilters.myTask) return true
            if (item.category === "reminder" && selectedFilters.reminders) return true
            return false
        })
    }, [scheduleItems, selectedFilters])

    const groupedByDayOfWeek = useMemo(() => {
        const groups: Record<number, ScheduleItem[]> = {}
        filteredScheduleItems.forEach((it) => {
            groups[it.dayOfWeek] = groups[it.dayOfWeek] || []
            groups[it.dayOfWeek].push(it)
        })
        return groups
    }, [filteredScheduleItems])

    const groupedByDate = useMemo(() => {
        const groups: Record<number, ScheduleItem[]> = {}
        filteredScheduleItems.forEach((it) => {
            groups[it.day] = groups[it.day] || []
            groups[it.day].push(it)
        })
        return groups
    }, [filteredScheduleItems])

    const groupedByHour = useMemo(() => {
        const groups: Record<number, ScheduleItem[]> = {}
        filteredScheduleItems.forEach((it) => {
            groups[it.hour] = groups[it.hour] || []
            groups[it.hour].push(it)
        })
        return groups
    }, [filteredScheduleItems])

    const timeSlots = useMemo(() => [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20], [])

    const formatHour = (hour: number) => {
        if (hour === 12) return "12PM"
        if (hour > 12) return `${hour - 12}PM`
        return `${hour}AM`
    }

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const monthDays = Array.from({ length: 31 }, (_, i) => i + 1)

    const monthLabel = useMemo(() => {
        const d = new Date()
        d.setMonth(d.getMonth() + monthOffset)
        return d.toLocaleString(undefined, { month: "long", year: "numeric" })
    }, [monthOffset])

    const openAddModal = () => {
        setForm({
            title: "",
            avatar: "",
            color: "bg-amber-50",
            category: "task",
            startHour: 9,
            endHour: 10,
            day: 15,
            notes: "",
        })
        setIsModalOpen(true)
    }

    const createSchedule = () => {
        if (!form.title || form.startHour >= form.endHour) {
            alert("Please enter title and valid start/end time")
            return
        }
        const id = String(Date.now())
        const newItem: ScheduleItem = {
            id,
            time: `${formatHour(form.startHour)} - ${formatHour(form.endHour)}`,
            title: form.title,
            avatar:
                form.avatar ||
                form.title
                    .split(" ")
                    .slice(0, 2)
                    .map((s) => s[0])
                    .join("")
                    .toUpperCase() ||
                "ME",
            color: form.color,
            category: form.category,
            hour: form.startHour,
            day: form.day,
            dayOfWeek: new Date(new Date().getFullYear(), new Date().getMonth() + monthOffset, form.day).getDay(),
            notes: form.notes,
        }
        setScheduleItems((s) => [newItem, ...s])
        setIsModalOpen(false)
    }

    const deleteSchedule = (id: string) => {
        if (!confirm("Delete this schedule?")) return
        setScheduleItems((s) => s.filter((it) => it.id !== id))
    }

    const toggleExpand = (id: string) => {
        setScheduleItems((s) => s.map((it) => (it.id === id ? { ...it, expanded: !it.expanded } : it)))
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="mx-auto max-w-7xl px-4">
                {/* Header */}
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Good morning, Maria</h1>
                        <p className="text-sm text-gray-500">Here is your job listings statistic report from Jul 19 - Jul 25.</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2">
                        <span className="text-sm text-gray-700">Jul 19 - Jul 25</span>
                        <Calendar className="h-4 w-4 text-gray-500" />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-none bg-pink-100 p-6 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-3xl font-bold text-gray-900">3</div>
                                <div className="mt-1 text-sm text-gray-700">Active session</div>
                            </div>
                            <div className="rounded-lg bg-white p-2">
                                <Calendar className="h-5 w-5 text-gray-700" />
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none bg-cyan-100 p-6 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-3xl font-bold text-gray-900">2</div>
                                <div className="mt-1 text-sm text-gray-700">Pending Reschedules</div>
                            </div>
                            <div className="rounded-lg bg-white p-2">
                                <Info className="h-5 w-5 text-gray-700" />
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none bg-indigo-200 p-6 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-3xl font-bold text-gray-900">1</div>
                                <div className="mt-1 text-sm text-gray-700">Teacher Issues</div>
                            </div>
                            <div className="rounded-lg bg-white p-2">
                                <AlertTriangle className="h-5 w-5 text-gray-700" />
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none bg-pink-200 p-6 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-3xl font-bold text-gray-900">12</div>
                                <div className="mt-1 text-sm text-gray-700">Available Teachers</div>
                            </div>
                            <div className="rounded-lg bg-white p-2">
                                <Users className="h-5 w-5 text-gray-700" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex gap-6 border-b border-gray-200">
                    {["calendar", "session", "reschedule", "completed"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-sm font-medium capitalize transition-colors ${activeTab === tab ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Calendar Section */}
                <div className="grid gap-6 lg:grid-cols-1">
                    {/* Main Calendar Area */}
                    <div className="lg:col-span-2">
                        {/* Calendar Controls */}
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setMonthOffset((m) => m - 1)} className="rounded-lg p-1 hover:bg-gray-100">
                                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                                    </button>
                                    <span className="text-sm font-medium text-gray-900">{monthLabel}</span>
                                    <button onClick={() => setMonthOffset((m) => m + 1)} className="rounded-lg p-1 hover:bg-gray-100">
                                        <ChevronRight className="h-5 w-5 text-gray-600" />
                                    </button>
                                </div>

                                <div className="flex gap-2 rounded-lg border border-gray-200 bg-white p-1">
                                    {["daily", "weekly", "monthly"].map((mode) => (
                                        <button
                                            key={mode}
                                            onClick={() => setViewMode(mode as any)}
                                            className={`rounded px-3 py-1 text-xs font-medium capitalize transition-colors ${viewMode === mode ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                        >
                                            {mode}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <CategoryDropdown selectedFilters={selectedFilters} toggleFilter={toggleFilter} />
                                <Button onClick={openAddModal} className="flex items-center gap-2 bg-cyan-500 text-white hover:bg-cyan-600">
                                    <Plus className="h-4 w-4" />
                                    Schedule Meeting
                                </Button>
                            </div>
                        </div>

                        {/* Views */}
                        {viewMode === "daily" && (
                            <div className="space-y-3">
                                {timeSlots.map((hour) => (
                                    <div key={hour}>
                                        <div className="flex items-center gap-4">
                                            <span className="w-16 text-xs font-medium text-gray-500">{formatHour(hour)}</span>
                                            <div className="h-px flex-1 bg-gray-200" />
                                        </div>

                                        {groupedByHour[hour]?.map((item) => (
                                            <div key={item.id} className={`mt-3 flex items-center gap-4 rounded-lg ${item.color} p-4 transition-all hover:shadow-md`}>
                                                <Avatar className="h-8 w-8 bg-gray-300 text-xs font-medium text-gray-700">{item.avatar}</Avatar>
                                                <div className="flex-1">
                                                    <div className="text-xs text-gray-600">{item.time}</div>
                                                    <div className="mt-1 text-sm font-medium text-gray-900">{item.title}</div>
                                                    {item.expanded && <div className="mt-2 text-xs text-gray-600">{item.notes}</div>}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => toggleExpand(item.id)} className="text-gray-400 hover:text-gray-600">
                                                        <ChevronDown className="h-5 w-5" />
                                                    </button>
                                                    <button onClick={() => deleteSchedule(item.id)} className="text-red-500 hover:text-red-700">
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {hour === 11 && (
                                            <button onClick={openAddModal} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-600 transition-colors hover:border-gray-400 hover:bg-gray-50">
                                                <Plus className="h-4 w-4" />
                                                Add Schedules
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {filteredScheduleItems.length === 0 && (
                                    <div className="py-12 text-center">
                                        <p className="text-sm text-gray-500">No schedules match the selected filters</p>
                                        <p className="mt-1 text-xs text-gray-400">Try selecting different filter options</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {viewMode === "weekly" && (
                            <div className="overflow-x-auto">
                                <div className="grid min-w-[800px] grid-cols-7 gap-2">
                                    {dayNames.map((dayName, dayIndex) => {
                                        const dateNumber = 15 + dayIndex
                                        return (
                                            <div key={dayIndex} className="space-y-2">
                                                <div className="rounded-lg bg-gray-100 p-2 text-center">
                                                    <div className="text-xs font-semibold text-gray-700">{dayName}</div>
                                                    <div className="text-lg font-bold text-gray-900">{dateNumber}</div>
                                                </div>

                                                <div className="space-y-2">
                                                    {groupedByDayOfWeek[dayIndex]?.map((item) => (
                                                        <div key={item.id} className={`rounded-lg ${item.color} p-3 transition-all hover:shadow-md`}>
                                                            <div className="mb-1 flex items-center gap-2">
                                                                <Avatar className="h-6 w-6 bg-gray-300 text-[10px] font-medium text-gray-700">{item.avatar}</Avatar>
                                                                <div className="text-[10px] text-gray-600">{item.time.split(" - ")[0]}</div>
                                                            </div>
                                                            <div className="text-xs font-medium leading-tight text-gray-900">{item.title}</div>
                                                            <div className="mt-2 flex justify-end gap-2">
                                                                <button onClick={() => toggleExpand(item.id)} className="text-gray-600">
                                                                    <ChevronDown className="h-4 w-4" />
                                                                </button>
                                                                <button onClick={() => deleteSchedule(item.id)} className="text-red-500">
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                            {item.expanded && <div className="mt-2 text-xs text-gray-600">{item.notes}</div>}
                                                        </div>
                                                    ))}

                                                    {(!groupedByDayOfWeek[dayIndex] || groupedByDayOfWeek[dayIndex].length === 0) && (
                                                        <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 text-center">
                                                            <p className="text-xs text-gray-400">No events</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {filteredScheduleItems.length === 0 && (
                                    <div className="py-12 text-center">
                                        <p className="text-sm text-gray-500">No schedules match the selected filters</p>
                                        <p className="mt-1 text-xs text-gray-400">Try selecting different filter options</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {viewMode === "monthly" && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-7 gap-2">
                                    {dayNames.map((dayName) => (
                                        <div key={dayName} className="p-2 text-center text-xs font-semibold text-gray-600">
                                            {dayName}
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-2">
                                    {monthDays.map((day) => {
                                        const hasEvents = !!(groupedByDate[day] && groupedByDate[day].length > 0)
                                        return (
                                            <div
                                                key={day}
                                                className={`min-h-[100px] rounded-lg border p-2 transition-all hover:shadow-md ${hasEvents ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-50"
                                                    }`}
                                            >
                                                <div className="mb-2 text-sm font-semibold text-gray-900">{day}</div>

                                                <div className="space-y-1">
                                                    {groupedByDate[day]?.slice(0, 3).map((item) => (
                                                        <div key={item.id} className={`rounded ${item.color} px-2 py-1 text-[10px] font-medium leading-tight text-gray-900`}>
                                                            {item.time.split(" - ")[0]} {item.title.substring(0, 20)}...
                                                        </div>
                                                    ))}

                                                    {groupedByDate[day] && groupedByDate[day].length > 3 && (
                                                        <div className="px-2 text-[10px] font-medium text-gray-500">+{groupedByDate[day].length - 3} more</div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {filteredScheduleItems.length === 0 && (
                                    <div className="py-12 text-center">
                                        <p className="text-sm text-gray-500">No schedules match the selected filters</p>
                                        <p className="mt-1 text-xs text-gray-400">Try selecting different filter options</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal: Schedule Meeting */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Schedule Meeting</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500">Close</button>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3">
                            <label className="text-xs font-medium text-gray-700">Title</label>
                            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded border p-2" />

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-700">Start hour</label>
                                    <select value={form.startHour} onChange={(e) => setForm({ ...form, startHour: Number(e.target.value) })} className="w-full rounded border p-2">
                                        {Array.from({ length: 15 }, (_, i) => i + 6).map((h) => <option key={h} value={h}>{formatHour(h)}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-700">End hour</label>
                                    <select value={form.endHour} onChange={(e) => setForm({ ...form, endHour: Number(e.target.value) })} className="w-full rounded border p-2">
                                        {Array.from({ length: 15 }, (_, i) => i + 6).map((h) => <option key={h} value={h}>{formatHour(h)}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-700">Day (date)</label>
                                    <input type="number" min={1} max={31} value={form.day} onChange={(e) => setForm({ ...form, day: Number(e.target.value) })} className="w-full rounded border p-2" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-700">Category</label>
                                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })} className="w-full rounded border p-2">
                                        <option value="interview">Interview</option>
                                        <option value="internal">Internal</option>
                                        <option value="team">Team</option>
                                        <option value="task">Task</option>
                                        <option value="reminder">Reminder</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-gray-700">Avatar initials</label>
                                <input value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} className="w-full rounded border p-2" placeholder="Optional: e.g. AB" />
                            </div>

                            <div>
                                <label className="text-xs font-medium text-gray-700">Notes</label>
                                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full rounded border p-2" />
                            </div>

                            <div className="mt-3 flex items-center justify-end gap-2">
                                <Button onClick={() => setIsModalOpen(false)} className="bg-gray-100 text-gray-700">Cancel</Button>
                                <Button onClick={createSchedule} className="bg-cyan-500 text-white">Create</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
