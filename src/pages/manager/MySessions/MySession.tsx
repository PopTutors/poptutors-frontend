// app/(your-route)/my-sessions/page.tsx   OR wherever you keep it
"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { Card } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Avatar } from "../../../components/ui/avatar"
import { Checkbox } from "../../../components/ui/checkbox"
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Plus,
    Trash2,
    MoreVertical,
    Play,
    MessageCircle,
    XCircle, CheckCircle,
    User,
    FileText
} from "lucide-react";

import { useFetch } from "../../../api/UseFetch"
import { useGenericMutation } from "../../../api/useGenericMutation"
import {
    ClockIcon,
    Completed,
    DateIcon,
    LeartIcon,
    ProfileIcon,
    SessionDateIcon,
    SessionMoneyIcon,
    SessionStudentIcon,
    SessionTeacherIcon,
    TimeIcon
} from "../../../assets/managers"

// Configure API prefix with env fallback so it works for either /api/sessions or /mySessions
const API_PREFIX = (typeof window !== "undefined" && (window as any).__API_PREFIX) || "/mySessions"

type Category = "interview" | "internal" | "team" | "task" | "reminder"

type ScheduleItem = {
    id: string
    time: string
    title: string
    avatar: string
    color: string
    category: Category
    hour: number
    day: number
    dayOfWeek: number
    notes?: string
    expanded?: boolean

    // backend fields
    status?: string
    teacher?: any
    student?: any
    startAt?: string
    endAt?: string
    joinUrl?: string
    recordingUrl?: string
    price?: number
    jobId?: string
}

const STORAGE_KEY = "my_session_schedules_v1"

// keep defaultItems minimal; it will be replaced by server data if available
const defaultItems: ScheduleItem[] = []

// ------------- CategoryDropdown (unchanged behavior) -------------
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
                    className="absolute right-0 z-40 mt-2 w-64 border border-gray-200 bg-white shadow-lg"
                >
                    <div className="p-3 text-sm font-medium text-gray-800">Category</div>

                    <div className="divide-y divide-gray-100">
                        <div className="p-3 space-y-2 w-full">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <Checkbox checked={selectedFilters.interviewSchedule} onCheckedChange={() => toggleFilter("interviewSchedule")} />
                                <span className="text-sm">Interview Schedule</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <Checkbox checked={selectedFilters.internalMeeting} onCheckedChange={() => toggleFilter("internalMeeting")} />
                                <span className="text-sm">Internal Meeting</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <Checkbox checked={selectedFilters.teamSchedule} onCheckedChange={() => toggleFilter("teamSchedule")} />
                                <span className="text-sm">Team Schedule</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <Checkbox checked={selectedFilters.myTask} onCheckedChange={() => toggleFilter("myTask")} />
                                <span className="text-sm">My Task</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <Checkbox checked={selectedFilters.reminders} onCheckedChange={() => toggleFilter("reminders")} />
                                <span className="text-sm">Reminders</span>
                            </label>
                        </div>

                        <div className="p-2">
                            <button
                                onClick={() => {
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

function RescheduleCard({
    item,
    onApprove,
    onDecline,
    onReschedule,
    onChat,
}: {
    item: any;
    onApprove: (s: any) => void;
    onDecline: (s: any) => void;
    onReschedule: (s: any) => void;
    onChat: (s: any) => void;
}) {
    const formatDate = (iso?: string) =>
        iso ? new Date(iso).toLocaleDateString(undefined, { day: "2-digit", month: "2-digit", year: "numeric" }) : "—";

    const formatTime = (iso?: string) =>
        iso ? new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "—";

    const formatDateTime = (iso?: string) => {
        if (!iso) return "—";
        const date = new Date(iso);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    };

    return (
        <div className="border-l-4 border-primary bg-white shadow-sm p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="text-sm font-semibold text-gray-800">
                    {item.title ?? "Computer science"} • Jb#{item.jobId ?? "34733"}
                </div>
                <div className="text-xs text-gray-500">{formatDate(item.startAt)}</div>
            </div>

            {/* Time slot rows */}
            <div className="space-y-2 mb-4">
                {/* First row - with person icon */}
                <div className="flex items-center gap-3 bg-gray-50 p-3">
                    <div className="flex-shrink-0 h-8 w-8 bg-white border border-gray-200 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1 flex items-center gap-3">
                        <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                                {formatDateTime(item.startAt)}
                            </div>
                            <div className="text-xs text-gray-400">Current</div>
                        </div>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="text-gray-400 flex-shrink-0"
                        >
                            <path
                                d="M9 6l6 6-6 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                                {formatDateTime(item.requestedStart ?? item.endAt)}
                            </div>
                            <div className="text-xs text-gray-400">Requested</div>
                        </div>
                    </div>
                </div>

                {/* Second row - with document icon */}
                <div className="flex items-center gap-3 bg-sky-50 p-3">
                    <div className="flex-shrink-0 h-8 w-8 bg-white border border-sky-200 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-sky-600" />
                    </div>
                    <div className="flex-1 flex items-center gap-3">
                        <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                                {formatDateTime(item.startAt)}
                            </div>
                            <div className="text-xs text-gray-400">Current</div>
                        </div>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="text-gray-400 flex-shrink-0"
                        >
                            <path
                                d="M9 6l6 6-6 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                                {formatDateTime(item.requestedStart ?? item.endAt)}
                            </div>
                            <div className="text-xs text-gray-400">Requested</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reason and Actions row */}
            <div className="flex items-center justify-between">
                {/* Reason */}
                {item.reason && (
                    <div className="text-sm text-rose-600">
                        <span className="font-medium">Reason: </span>
                        <span>{item.reason}</span>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 ml-auto">
                    <button
                        onClick={() => onChat(item)}
                        className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white p-2 hover:bg-gray-50"
                    >
                        <MessageCircle className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                        onClick={() => onDecline(item)}
                        className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white p-2 hover:bg-gray-50"
                    >
                        <XCircle className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                        onClick={() => onApprove(item)}
                        className="bg-[rgba(52, 199, 89, 0.1)] inline-flex items-center justify-center rounded-full border border-gray-200 bg-white p-2 hover:bg-gray-50"
                    >
                        <CheckCircle className="h-4 w-4 text-gray-600 " />
                    </button>
                </div>
            </div>
        </div>
    );
}


// ---------------- Main component ----------------
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

    const [completedItems, setCompletedItems] = useState < ScheduleItem[] > ([])
    const [rescheduleItems, setRescheduleItems] = useState < ScheduleItem[] > ([])

    const [stats, setStats] = useState({
        active: 0,
        pendingReschedules: 0,
        issues: 0,
        availableTeachers: 0,
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

    const [openMenuFor, setOpenMenuFor] = useState < string | null > (null)

    // --- fetch stats ---
    useFetch < { active: number; pendingReschedules: number; issues: number; availableTeachers: number } > (
        ["sessions", "stats"],
        `${API_PREFIX}/stats`,
        true,
        {
            onSuccessCallback: (data) => {
                if (!data) return
                // handle both array/object shapes
                const payload = Array.isArray(data) ? data[0] : (data as any)
                setStats({
                    active: payload?.active ?? payload,
                    pendingReschedules: payload?.pendingReschedules ?? 0,
                    issues: payload?.issues ?? 0,
                    availableTeachers: payload?.availableTeachers ?? 0,
                })
            },
            onErrorCallback: (err) => console.error("Stats error", err?.message),
        }
    )

    // --- fetch sessions (list) ---
    useFetch < any[] > (
        ["sessions", monthOffset],
        `${API_PREFIX}?monthOffset=${monthOffset}`,
        true,
        {
            onSuccessCallback: (data) => {
                if (!data) return
                // relax shape handling: data may be [] or { data: [] }
                const arr = Array.isArray(data) ? data : (data?.data ?? [])
                if (Array.isArray(arr)) {
                    const mapped = arr.map(mapSessionToScheduleItem)
                    setScheduleItems(mapped)
                }
            },
            onErrorCallback: (err) => {
                console.error("Sessions fetch error:", err?.message)
            },
        }
    )

    // --- completed ---
    useFetch < any[] > (
        ["sessions", "completed", monthOffset],
        `${API_PREFIX}?status=completed&monthOffset=${monthOffset}`,
        true,
        {
            onSuccessCallback: (data) => {
                const arr = Array.isArray(data) ? data : (data?.data ?? [])
                if (Array.isArray(arr)) setCompletedItems(arr.map(mapSessionToScheduleItem))
            },
            onErrorCallback: (err) => console.error("Completed fetch error", err?.message),
        }
    )

    // --- pending reschedules ---
    useFetch < any[] > (
        ["sessions", "pending-reschedule", monthOffset],
        `${API_PREFIX}?status=pending-reschedule&monthOffset=${monthOffset}`,
        true,
        {
            onSuccessCallback: (data) => {
                const arr = Array.isArray(data) ? data : (data?.data ?? [])
                if (Array.isArray(arr)) setRescheduleItems(arr.map(mapSessionToScheduleItem))
            },
            onErrorCallback: (err) => console.error("Reschedule fetch error", err?.message),
        }
    )

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(scheduleItems))
        } catch (e) { }
    }, [scheduleItems])

    const toggleFilter = (key: keyof typeof selectedFilters) => setSelectedFilters((p) => ({ ...p, [key]: !p[key] }))

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

    const filteredCompletedItems = useMemo(() => {
        return completedItems.filter((item) => {
            if (item.category === "interview" && selectedFilters.interviewSchedule) return true
            if (item.category === "internal" && selectedFilters.internalMeeting) return true
            if (item.category === "team" && selectedFilters.teamSchedule) return true
            if (item.category === "task" && selectedFilters.myTask) return true
            if (item.category === "reminder" && selectedFilters.reminders) return true
            return false
        })
    }, [completedItems, selectedFilters])

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

    // ----------------- Mutations -----------------
    const patchMutation = useGenericMutation()
    const createMutation = useGenericMutation()
    const deleteMutation = useGenericMutation()

    const createBusy = (createMutation as any)?.isLoading ?? false
    const patchBusy = (patchMutation as any)?.isLoading ?? false
    const deleteBusy = (deleteMutation as any)?.isLoading ?? false

    async function createSchedule() {
        if (!form.title || form.startHour >= form.endHour) {
            alert("Please enter title and valid start/end time")
            return
        }

        const now = new Date()
        const year = now.getFullYear()
        const month = now.getMonth() + monthOffset
        const startAt = new Date(year, month, form.day, form.startHour, 0, 0).toISOString()
        const endAt = new Date(year, month, form.day, form.endHour, 0, 0).toISOString()

        const payload: any = {
            title: form.title,
            avatar: form.avatar || undefined,
            color: form.color,
            category: form.category,
            hour: form.startHour,
            day: form.day,
            notes: form.notes,
            startAt,
            endAt,
            status: "active",
        }

        createMutation.mutate({
            endpoint: `${API_PREFIX}`,
            data: payload,
            method: "POST",
            successMessage: "Session created",
            errorMessage: "Failed to create session",
            invalidateKeys: ["sessions", "sessions-stats"],
            onSuccessCallback: (respData: any) => {
                const created = Array.isArray(respData) ? respData[0] : (respData?.data ?? respData)
                if (created) {
                    const mapped = mapSessionToScheduleItem(created)
                    setScheduleItems((s) => [mapped, ...s])
                }
                setIsModalOpen(false)
            },
        })
    }

    function handleAssignTeacher(session: ScheduleItem) {
        const teacherIdOrName = prompt("Enter teacher ID or name to assign:")
        if (!teacherIdOrName) return

        patchMutation.mutate({
            endpoint: `${API_PREFIX}/${session.id}`,
            data: { teacher: teacherIdOrName },
            method: "PATCH",
            successMessage: "Teacher assigned",
            errorMessage: "Failed to assign teacher",
            invalidateKeys: ["sessions", "sessions-stats"],
            onSuccessCallback: (resp) => {
                const updated = Array.isArray(resp) ? resp[0] : (resp?.data ?? resp)
                if (updated) {
                    const mapped = mapSessionToScheduleItem(updated)
                    setScheduleItems((s) => s.map((it) => (it.id === mapped.id ? mapped : it)))
                    setCompletedItems((s) => s.map((it) => (it.id === mapped.id ? mapped : it)))
                    setRescheduleItems((s) => s.map((it) => (it.id === mapped.id ? mapped : it)))
                }
            },
        })
        setOpenMenuFor(null)
    }

    function handleRemoveTeacher(session: ScheduleItem) {
        if (!confirm("Remove teacher from this session?")) return
        patchMutation.mutate({
            endpoint: `${API_PREFIX}/${session.id}`,
            data: { teacher: null },
            method: "PATCH",
            successMessage: "Teacher removed",
            errorMessage: "Failed to remove teacher",
            invalidateKeys: ["sessions", "sessions-stats"],
            onSuccessCallback: (resp) => {
                const updated = Array.isArray(resp) ? resp[0] : (resp?.data ?? resp)
                if (updated) {
                    const mapped = mapSessionToScheduleItem(updated)
                    setScheduleItems((s) => s.map((it) => (it.id === mapped.id ? mapped : it)))
                    setCompletedItems((s) => s.map((it) => (it.id === mapped.id ? mapped : it)))
                    setRescheduleItems((s) => s.map((it) => (it.id === mapped.id ? mapped : it)))
                }
            },
        })
        setOpenMenuFor(null)
    }

    function handleReschedule(session: ScheduleItem) {
        const newDateStr = prompt("Enter new date (YYYY-MM-DD):", session.startAt ? session.startAt.slice(0, 10) : "")
        if (!newDateStr) return
        const newHourStr = prompt("Enter new start hour (0-23):", String(session.hour ?? 9))
        if (!newHourStr) return
        const newHour = Number(newHourStr)
        if (Number.isNaN(newHour)) return alert("Invalid hour")

        const startAt = new Date(`${newDateStr}T${String(newHour).padStart(2, "0")}:00:00Z`).toISOString()
        const endAt = new Date(new Date(startAt).getTime() + 60 * 60 * 1000).toISOString()

        patchMutation.mutate({
            endpoint: `${API_PREFIX}/${session.id}`,
            data: { startAt, endAt, day: new Date(startAt).getDate(), hour: newHour, status: "active" },
            method: "PATCH",
            successMessage: "Session rescheduled",
            errorMessage: "Failed to reschedule",
            invalidateKeys: ["sessions", "sessions-stats"],
            onSuccessCallback: (resp) => {
                const updated = Array.isArray(resp) ? resp[0] : (resp?.data ?? resp)
                if (updated) {
                    const mapped = mapSessionToScheduleItem(updated)
                    setScheduleItems((s) => s.map((it) => (it.id === mapped.id ? mapped : it)))
                    setRescheduleItems((s) => s.filter((it) => it.id !== mapped.id))
                }
            },
        })
        setOpenMenuFor(null)
    }

    function handleViewRecording(session: ScheduleItem) {
        if (session.recordingUrl) window.open(session.recordingUrl, "_blank")
        else alert("Recording not available")
        setOpenMenuFor(null)
    }

    function handleJoinMeeting(session: ScheduleItem) {
        if (session.joinUrl) window.open(session.joinUrl, "_blank")
        else alert("Join URL not available")
    }

    function handleDelete(session: ScheduleItem) {
        if (!confirm("Delete this session?")) return
        deleteMutation.mutate({
            endpoint: `${API_PREFIX}/${session.id}`,
            data: {},
            method: "DELETE",
            successMessage: "Session deleted",
            errorMessage: "Failed to delete session",
            invalidateKeys: ["sessions", "sessions-stats"],
            onSuccessCallback: () => {
                setScheduleItems((s) => s.filter((it) => it.id !== session.id))
                setCompletedItems((s) => s.filter((it) => it.id !== session.id))
                setRescheduleItems((s) => s.filter((it) => it.id !== session.id))
            },
        })
    }

    function approveReschedule(session: ScheduleItem) {
        if (!confirm("Approve this reschedule and make it active?")) return
        patchMutation.mutate({
            endpoint: `${API_PREFIX}/${session.id}`,
            data: { status: "active" },
            method: "PATCH",
            successMessage: "Reschedule approved",
            errorMessage: "Failed to approve reschedule",
            invalidateKeys: ["sessions", "sessions-stats"],
            onSuccessCallback: (resp) => {
                const updated = Array.isArray(resp) ? resp[0] : (resp?.data ?? resp)
                if (updated) {
                    const mapped = mapSessionToScheduleItem(updated)
                    setScheduleItems((s) => [mapped, ...s])
                    setRescheduleItems((s) => s.filter((it) => it.id !== mapped.id))
                }
            },
        })
    }

    function declineReschedule(session: ScheduleItem) {
        if (!confirm("Decline this reschedule request?")) return
        patchMutation.mutate({
            endpoint: `${API_PREFIX}/${session.id}`,
            data: { status: "scheduled" },
            method: "PATCH",
            successMessage: "Reschedule declined",
            errorMessage: "Failed to decline reschedule",
            invalidateKeys: ["sessions", "sessions-stats"],
            onSuccessCallback: (resp) => {
                const updated = Array.isArray(resp) ? resp[0] : (resp?.data ?? resp)
                if (updated) {
                    const mapped = mapSessionToScheduleItem(updated)
                    setRescheduleItems((s) => s.filter((it) => it.id !== mapped.id))
                    setScheduleItems((s) => s.map((it) => (it.id === mapped.id ? mapped : it)))
                }
            },
        })
    }

    function toggleExpand(id: string) {
        setScheduleItems((s) => s.map((it) => (it.id === id ? { ...it, expanded: !it.expanded } : it)))
    }

    function mapSessionToScheduleItem(s: any): ScheduleItem {
        const hour = s.hour ?? (s.startAt ? new Date(s.startAt).getHours() : 9)
        const day = s.day ?? (s.startAt ? new Date(s.startAt).getDate() : 15)
        const time =
            s.time ??
            (s.startAt && s.endAt
                ? `${new Date(s.startAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} - ${new Date(
                    s.endAt
                ).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
                : `${hour}:00`)

        return {
            id: s._id ?? s.id ?? String(Math.random()),
            time,
            title: s.title ?? "Untitled",
            avatar: s.avatar ?? (s.title ? s.title.split(" ").slice(0, 2).map((t: string) => t[0]).join("").toUpperCase() : "ME"),
            color: s.color ?? "bg-amber-50",
            category: s.category ?? "task",
            hour,
            day,
            dayOfWeek: s.dayOfWeek ?? (new Date(s.startAt ?? new Date()).getDay()),
            notes: s.notes ?? "",
            expanded: false,
            status: s.status,
            teacher: s.teacher,
            student: s.student,
            startAt: s.startAt,
            endAt: s.endAt,
            joinUrl: s.joinUrl,
            recordingUrl: s.recordingUrl,
            price: s.price,
            jobId: s.jobId,
        }
    }

    // ---------------- SessionCard ----------------
    // Replace existing SessionCard with this version
    const SessionCard = ({ item, showActions = true }: { item: ScheduleItem; showActions?: boolean }) => {
        const isPendingReschedule = item.status === "pending-reschedule"
        return (
            <Card className="p-0 overflow-hidden">
                <div className="flex">
                    {/* left accent bar */}
                    <div className="w-1 bg-primary" />

                    {/* main content */}
                    <div className="flex-1 p-4">
                        {/* Title + menu */}
                        <div className="flex items-start justify-between">
                            <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>

                            <div className="relative">
                                <button
                                    onClick={() => setOpenMenuFor((prev) => (prev === item.id ? null : item.id))}
                                    aria-label="open session menu"
                                    className="p-1 rounded hover:bg-gray-50"
                                >
                                    <MoreVertical className="h-5 w-5 text-gray-600" />
                                </button>

                                {openMenuFor === item.id && (
                                    <div className="absolute right-0 top-8 z-50 w-44 rounded border bg-white p-1 shadow">
                                        <button
                                            onClick={() => handleViewRecording(item)}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            <Play className="h-4 w-4" /> View recording
                                        </button>
                                        <button onClick={() => handleAssignTeacher(item)} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
                                            + Assign teacher
                                        </button>
                                        <button onClick={() => handleRemoveTeacher(item)} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
                                            ○ Remove teacher
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Two-column content */}
                        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                            {/* left column */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="h-[44px] w-[44px] rounded-full bg-slate-100 flex items-center justify-center text-sm text-slate-700">
                                        <img src={SessionStudentIcon} alt="Student" />
                                    </div>
                                    <div>
                                        <div className="text-[16px] font-inter font-medium text-[#141414]">{item.student?.name ?? "Alice johnson"}</div>
                                        <div className="text-[14px] text-[#8E8E93]">Student id: {item.student?.id ?? "Stu-456"}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-[44px] w-[44px] flex items-center justify-center text-sm text-slate-700">
                                        <img src={SessionDateIcon} alt="Date/Time" />
                                    </div>
                                    <div>
                                        <div className="text-[16px] font-inter font-medium text-[#141414]">{item.startAt ? new Date(item.startAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) : "15 September 2024"}</div>
                                        <div className="text-[14px] text-[#8E8E93]">{item.startAt ? new Date(item.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : item.time}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-[44px] w-[44px] rounded-full bg-slate-100 flex items-center justify-center text-sm text-slate-700">
                                        <img src={ClockIcon} />
                                    </div>
                                    <div>
                                        <div className="text-[16px] font-inter font-medium text-[#141414]">{item.jobId ?? "Jb-47584"}</div>
                                        <div className="text-[14px] text-[#8E8E93]">Job id</div>
                                    </div>
                                </div>
                            </div>

                            {/* right column */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="h-[44px] w-[44px] rounded-full bg-pink-50 flex items-center justify-center text-sm text-pink-700">
                                        <img src={SessionTeacherIcon} alt="Teacher" />
                                    </div>
                                    <div>
                                        <div className="text-[16px] font-inter font-medium text-[#141414]">{typeof item.teacher === "string" ? item.teacher : item.teacher?.name ?? "Dr.doe doe"}</div>
                                        <div className="text-[14px] text-[#8E8E93]">Teacher id: {item.teacher?.id ?? "Tch-456"}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-[44px] w-[44px] rounded-full bg-amber-50 flex items-center justify-center text-sm text-amber-700">
                                        <img src={SessionMoneyIcon} alt="Price" />
                                    </div>
                                    <div>
                                        <div className="text-[16px] font-inter font-medium text-[#141414]">${item.price ?? 250}</div>
                                        <div className="text-[14px] text-[#8E8E93]">$50/hr</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-[44px] w-[44px] rounded-full bg-rose-50 flex items-center justify-center text-sm text-rose-700">
                                        <img src={Completed} alt="Status" />
                                    </div>
                                    <div>
                                        <div className="text-[16px] font-inter font-medium text-[#141414]">{item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Completed"}</div>
                                        <div className="text-[14px] text-[#8E8E93]">Status</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* bottom actions */}
                        <div className="mt-4 flex flex-col gap-2 sm:flex-row items-stretch sm:items-center justify-between">
                            <div className="flex gap-2">
                                <button title="Chat" className="rounded border py-[12px] px-[16px] text-gray-600 hover:bg-gray-50">
                                    <MessageCircle className="h-[24px] w-[24px]" />
                                </button>
                            </div>

                            {/* if this is a pending reschedule show approve/decline + reschedule/delete */}
                            {isPendingReschedule ? (
                                <div className="flex gap-2 justify-end">
                                    <button onClick={() => approveReschedule(item)} className="px-4 py-2 rounded bg-emerald-600 text-white text-sm hover:bg-emerald-700">Approve</button>
                                    <button onClick={() => declineReschedule(item)} className="px-4 py-2 rounded border text-sm">Decline</button>
                                    <button onClick={() => handleReschedule(item)} className="px-4 py-2 rounded border text-sm">Reschedule</button>
                                    <button onClick={() => handleDelete(item)} className="px-4 py-2 rounded bg-red-600 text-white text-sm hover:bg-red-700">Delete</button>
                                </div>
                            ) : (
                                <div className="flex gap-2 justify-end">
                                    <button onClick={() => handleReschedule(item)} className="py-[12px] px-[24px] border text-[16px] font-inter font-medium hover:bg-gray-50 flex gap-2">
                                        <img src={DateIcon} /> Reschedule
                                    </button>
                                    <button onClick={() => handleJoinMeeting(item)} className="py-[12px] px-[24px] border text-[16px] font-inter flex items-center gap-2 bg-primary font-medium text-white hover:bg-cyan-700">
                                        <Play className="h-4 w-4" /> Join Meeting
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        )
    }


    // ---------------- Render ----------------
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="mx-auto max-w-7xl px-4">
                {/* Header */}
                <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-[24px] font-poppins text-[#141414] font-bold">Good morning, Maria</h1>
                        <p className="text-[16px] text-[rgba(20, 20, 20, 0.6)] font-inter">Here is your job listings statistic report.</p>
                    </div>
                    {/* <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2">
                        <span className="text-sm text-gray-700">This week</span>
                        <Calendar className="h-4 w-4 text-gray-500" />
                    </div> */}
                </div>

                {/* Stats */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-none bg-[#FFCED4] p-6 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-[32px] font-bold text-[#141414]">{stats?.active ?? 0}</div>
                                <div className="mt-1 text-[16px] text-[#141414] ">Active session</div>
                            </div>
                            <div className="p-2">
                                <Calendar className="h-5 w-5 text-gray-700" />
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none bg-[#BCEFFF] p-6 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-[32px] font-bold text-[#141414]">{stats?.pendingReschedules ?? 0}</div>
                                <div className="mt-1 text-[16px] text-[#141414] ">Pending Reschedules</div>
                            </div>
                            <div className="p-2">
                                <img src={TimeIcon} alt="Time Icon" className="w-5 h-5" />
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none bg-[#C4CAFF] p-6 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-[32px] font-bold text-[#141414]">{stats?.issues ?? 0}</div>
                                <div className="mt-1 text-[16px] text-[#141414] ">Teacher Issues</div>
                            </div>
                            <div className="p-2">
                                <img src={LeartIcon} alt="Leart Icon" className="w-5 h-5" />
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none bg-[#FFBDE8] p-6 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-[32px] font-bold text-[#141414]">{stats?.availableTeachers ?? 0}</div>
                                <div className="mt-1 text-[16px] text-[#141414] ">Available Teachers</div>
                            </div>
                            <div className="p-2">
                                <img src={ProfileIcon} alt="Profile Icon" className="w-5 h-5" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex gap-6 border-b border-gray-200 overflow-auto">
                    {["calendar", "session", "reschedule", "completed"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-[16px] pt-0 pr-[24px] pl-[24px] text-[16px] font-inter font-medium capitalize transition-colors ${activeTab === tab ? "border-b-2 border-primary text-[#141414]" : "text-[#8E8E93] hover:text-gray-700"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Main area */}
                {activeTab === "session" ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {filteredScheduleItems.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-gray-500">No sessions found</div>
                        ) : (
                            filteredScheduleItems.map((item) => <SessionCard item={item} key={item.id} />)
                        )}
                    </div>
                ) : activeTab === "completed" ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
                        {filteredCompletedItems.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-gray-500">No completed sessions</div>
                        ) : (
                            filteredCompletedItems.map((item) => <SessionCard item={item} key={item.id} showActions={false} />)
                        )}
                    </div>
                ) : activeTab === "reschedule" ? (
                    rescheduleItems.length === 0 ? (
                        <div className="py-12 text-center text-gray-500">No pending reschedules or conflicts</div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {rescheduleItems.map((it) => (
                                <RescheduleCard
                                    key={it.id}
                                    item={it}
                                    onApprove={approveReschedule}
                                    onDecline={declineReschedule}
                                    onReschedule={handleReschedule}
                                    onChat={(s) => {
                                        // use existing UI or open chat
                                        alert("Open chat for " + (s.title ?? s.id));
                                    }}
                                />
                            ))}
                        </div>
                    )
                ) : (
                    // Calendar view
                    <div className="grid gap-6 lg:grid-cols-1">
                        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <button onClick={() => setMonthOffset((m) => m - 1)} className="rounded-lg p-1 hover:bg-gray-100">
                                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                                </button>
                                <span className="text-sm font-medium text-gray-900">{monthLabel}</span>
                                <button onClick={() => setMonthOffset((m) => m + 1)} className="rounded-lg p-1 hover:bg-gray-100">
                                    <ChevronRight className="h-5 w-5 text-gray-600" />
                                </button>
                            </div>

                            {/* <div className="flex items-center gap-2"> */}
                            <div className="flex gap-2 rounded-lg border border-gray-200 p-[4px]">
                                {(["daily", "weekly", "monthly"] as const).map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => setViewMode(mode)}
                                        className={`rounded px-3 py-1 text-[14px] font-inter text-[#8E8E93] font-medium capitalize transition-colors ${viewMode === mode ? "bg-white text-primary" : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>

                            <Button onClick={openAddModal} className="text-[16px] font-inter flex items-center gap-2 px-[12px] py-[12px] bg-primary text-white hover:bg-cyan-600">
                                <Plus className="h-4 w-4" />
                                Schedule Meeting
                            </Button>
                            {/* </div> */}
                        </div>

                        {/* daily / weekly / monthly sections (kept as is but responsive) */}
                        {viewMode === "daily" && (
                            <div className="space-y-3">
                                {timeSlots.map((hour) => (
                                    <div key={hour}>
                                        <div className="flex items-center gap-4">
                                            <span className="w-16 text-xs font-medium text-gray-500">{formatHour(hour)}</span>
                                            <div className="h-px flex-1 bg-gray-200" />
                                        </div>

                                        {filteredScheduleItems.filter((si) => si.hour === hour).map((item) => (
                                            <div key={item.id} className={`mt-3 flex flex-col sm:flex-row sm:items-center gap-4 rounded-lg ${item.color} p-4 transition-all hover:shadow-md`}>
                                                <Avatar className="h-[44px] w-[44px] bg-gray-300 text-xs font-medium text-gray-700">{item.avatar}</Avatar>
                                                <div className="flex-1">
                                                    <div className="text-xs text-gray-600">{item.time}</div>
                                                    <div className="mt-1 text-sm font-medium text-gray-900">{item.title}</div>
                                                    {item.expanded && <div className="mt-2 text-xs text-gray-600">{item.notes}</div>}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => toggleExpand(item.id)} className="text-gray-400 hover:text-gray-600">
                                                        <ChevronDown className="h-5 w-5" />
                                                    </button>
                                                    <button onClick={() => handleDelete(item)} className="text-red-500 hover:text-red-700">
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {hour === 11 && (
                                            <button onClick={openAddModal} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-600 transition-colors hover:border-gray-400 hover:bg-gray-50">
                                                <Plus className="h-4 w-4" /> Add Schedules
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
                                                    {filteredScheduleItems.filter((si) => si.dayOfWeek === dayIndex).map((item) => (
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
                                                                <button onClick={() => handleDelete(item)} className="text-red-500">
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                            {item.expanded && <div className="mt-2 text-xs text-gray-600">{item.notes}</div>}
                                                        </div>
                                                    ))}

                                                    {!filteredScheduleItems.some((si) => si.dayOfWeek === dayIndex) && (
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
                                            {dayName}
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-2">
                                    {monthDays.map((day) => {
                                        const eventsForDay = filteredScheduleItems.filter((si) => si.day === day)
                                        const hasEvents = eventsForDay.length > 0
                                        return (
                                            <div key={day} className={`min-h-[100px] rounded-lg border p-2 transition-all hover:shadow-md ${hasEvents ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-50"}`}>
                                                <div className="mb-2 text-sm font-semibold text-gray-900">{day}</div>

                                                <div className="space-y-1">
                                                    {eventsForDay.slice(0, 3).map((item) => (
                                                        <div key={item.id} className={`rounded ${item.color} px-2 py-1 text-[10px] font-medium leading-tight text-gray-900`}>
                                                            {item.time.split(" - ")[0]} {item.title.substring(0, 20)}...
                                                        </div>
                                                    ))}

                                                    {eventsForDay.length > 3 && <div className="px-2 text-[10px] font-medium text-gray-500">+{eventsForDay.length - 3} more</div>}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal: Schedule Meeting (responsive) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-lg max-h-[90vh] overflow-auto">
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
                                <Button onClick={() => setIsModalOpen(false)} className="px-[24px] py-[12px] bg-gray-100 text-gray-700">Cancel</Button>
                                <Button onClick={createSchedule} className="px-[24px] py-[12px] bg-primary text-white" disabled={createBusy || patchBusy}>
                                    {createBusy ? "Creating…" : "Create"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
