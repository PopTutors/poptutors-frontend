"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
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
    XCircle,
    CheckCircle,
    User,
    FileText,
    Menu
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

// API prefix for livehelps
const API_PREFIX = "/myLivehelp"

type LiveHelpCategory = "assignment" | "project" | "consultation" | "other"

type LiveHelpItem = {
    id: string
    title: string
    description?: string
    studentId?: string
    student?: any
    teacher?: any
    pricePerHour?: number
    liveHelpHours?: number
    status?: string
    metadata?: any
    createdAt?: string
    scheduledAt?: string | null
    startAt?: string | null // derived from metadata.scheduledDateTime when available
}

const STORAGE_KEY = "my_livehelp_items_v1"
const defaultItems: LiveHelpItem[] = []

// CategoryDropdown component with mobile optimization
function CategoryDropdown({ selectedFilters, toggleFilter }: { selectedFilters: Record<string, boolean>; toggleFilter: (k: string) => void }) {
    const [open, setOpen] = useState(false)
    const [dropdownPosition, setDropdownPosition] = useState < 'left' | 'right' > ('right')
    const ref = useRef < HTMLDivElement | null > (null)
    const buttonRef = useRef < HTMLButtonElement > (null)

    useEffect(() => {
        function onDoc(e: MouseEvent) {
            if (!ref.current) return
            if (e.target instanceof Node && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener("mousedown", onDoc)
        return () => document.removeEventListener("mousedown", onDoc)
    }, [])

    const handleDropdownToggle = () => {
        if (!open && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            const spaceRight = window.innerWidth - rect.right
            const dropdownWidth = 256 // w-64 = 256px

            setDropdownPosition(spaceRight < dropdownWidth ? 'left' : 'right')
        }
        setOpen((v) => !v)
    }

    return (
        <div className="relative" ref={ref}>
            <button
                ref={buttonRef}
                onClick={handleDropdownToggle}
                aria-expanded={open}
                aria-haspopup="true"
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                Category
                <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div
                    role="menu"
                    aria-label="Category filters"
                    className={`absolute z-40 mt-2 w-64 border border-gray-200 bg-white shadow-lg rounded-lg ${dropdownPosition === 'left' ? 'left-0' : 'right-0'
                        }`}
                >
                    <div className="p-3 text-sm font-medium text-gray-800">Category</div>
                    <div className="divide-y divide-gray-100">
                        <div className="p-3 space-y-2 w-full">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <Checkbox checked={selectedFilters.assignment} onCheckedChange={() => toggleFilter('assignment')} />
                                <span className="text-sm">Assignment</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <Checkbox checked={selectedFilters.project} onCheckedChange={() => toggleFilter('project')} />
                                <span className="text-sm">Project</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <Checkbox checked={selectedFilters.consultation} onCheckedChange={() => toggleFilter('consultation')} />
                                <span className="text-sm">Consultation</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <Checkbox checked={selectedFilters.other} onCheckedChange={() => toggleFilter('other')} />
                                <span className="text-sm">Other</span>
                            </label>
                        </div>
                        <div className="p-2">
                            <button
                                onClick={() => { (Object.keys(selectedFilters) as string[]).forEach((k) => { if (!selectedFilters[k]) toggleFilter(k) }) }}
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

// RescheduleCard component with mobile optimization
function RescheduleCard({ item, onApprove, onDecline, onReschedule, onChat }: { item: any; onApprove: (s: any) => void; onDecline: (s: any) => void; onReschedule: (s: any) => void; onChat: (s: any) => void }) {
    const formatDateTime = (iso?: string) => {
        if (!iso) return "—"
        const date = new Date(iso)
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        })
    }

    return (
        <div className="border-l-4 border-primary bg-white shadow-sm p-4 rounded-lg">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2">
                <div className="text-sm font-semibold text-gray-800">{item.title}</div>
                <div className="text-xs text-gray-500">{formatDateTime(item.scheduledAt)}</div>
            </div>

            {/* Time slot rows - Mobile optimized */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                    <div className="flex-shrink-0 h-8 w-8 bg-white border border-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{formatDateTime(item.scheduledAt)}</div>
                            <div className="text-xs text-gray-400">Current</div>
                        </div>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-400 flex-shrink-0 hidden sm:block">
                            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{formatDateTime(item.requestedAt)}</div>
                            <div className="text-xs text-gray-400">Requested</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reason and Actions row - Mobile optimized */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {item.reason && (
                    <div className="text-sm text-rose-600">
                        <span className="font-medium">Reason: </span>
                        <span>{item.reason}</span>
                    </div>
                )}
                <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => onChat(item)} className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white p-2 hover:bg-gray-50">
                        <MessageCircle className="h-4 w-4 text-gray-600" />
                    </button>
                    <button onClick={() => onDecline(item)} className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white p-2 hover:bg-gray-50">
                        <XCircle className="h-4 w-4 text-gray-600" />
                    </button>
                    <button onClick={() => onApprove(item)} className="bg-[rgba(52, 199, 89, 0.1)] inline-flex items-center justify-center rounded-full border border-gray-200 bg-white p-2 hover:bg-gray-50">
                        <CheckCircle className="h-4 w-4 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function MyLiveHelpPage() {
    const [activeTab, setActiveTab] = useState("calendar")
    const [viewMode, setViewMode] = useState < "daily" | "weekly" | "monthly" > ("weekly")
    const [monthOffset, setMonthOffset] = useState(0)
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

    const [selectedFilters, setSelectedFilters] = useState({ assignment: true, project: true, consultation: true, other: true })

    const [items, setItems] = useState < LiveHelpItem[] > (() => {
        try { const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null; if (raw) return JSON.parse(raw) } catch (e) { }
        return defaultItems
    })

    const [completedItems, setCompletedItems] = useState < LiveHelpItem[] > ([])
    const [rescheduleItems, setRescheduleItems] = useState < LiveHelpItem[] > ([])

    const [stats, setStats] = useState({ requested: 0, scheduled: 0, inProgress: 0, completed: 0, activeTeachers: 0 })

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [form, setForm] = useState({ title: "", description: "", pricePerHour: 0, liveHelpHours: 1, timezone: "Asia/Kolkata", scheduledDate: "", scheduledHour: 9 })

    // Helper function to map live help data
    const mapLiveHelpToItem = useCallback((s: any): LiveHelpItem => {
        const scheduled = s.scheduledAt ?? s.metadata?.scheduledDateTime ?? null
        return {
            id: s._id ?? s.id ?? String(Math.random()),
            title: s.title ?? "Untitled",
            description: s.description ?? "",
            student: s.studentId ?? s.student ?? null,
            teacher: s.teacherId ?? s.teacher ?? null,
            pricePerHour: s.pricePerHour ?? s.finalPrice ?? s.negotiationPrice ?? 0,
            liveHelpHours: s.liveHelpHours ?? 1,
            status: s.status ?? "requested",
            metadata: s.metadata ?? {},
            createdAt: s.createdAt,
            scheduledAt: scheduled,
            startAt: scheduled,
        }
    }, [])

    // Memoized success callbacks to prevent infinite loop
    const handleStatsSuccess = useCallback((data: any) => {
        if (!data) return
        const payload = Array.isArray(data) ? data[0] : data
        setStats({
            requested: payload.requested ?? 0,
            scheduled: payload.scheduled ?? 0,
            inProgress: payload.inProgress ?? 0,
            completed: payload.completed ?? 0,
            activeTeachers: payload.activeTeachers ?? 0
        })
    }, [])

    const handleItemsSuccess = useCallback((data: any) => {
        const arr = Array.isArray(data) ? data : (data?.data ?? [])
        if (Array.isArray(arr)) setItems(arr.map(mapLiveHelpToItem))
    }, [mapLiveHelpToItem])

    const handleCompletedSuccess = useCallback((data: any) => {
        const arr = Array.isArray(data) ? data : (data?.data ?? [])
        if (Array.isArray(arr)) setCompletedItems(arr.map(mapLiveHelpToItem))
    }, [mapLiveHelpToItem])

    const handleRescheduleSuccess = useCallback((data: any) => {
        const arr = Array.isArray(data) ? data : (data?.data ?? [])
        if (Array.isArray(arr)) setRescheduleItems(arr.map(mapLiveHelpToItem))
    }, [mapLiveHelpToItem])

    const handleError = useCallback((err: any) => {
        console.error("LiveHelp fetch error:", err?.message)
    }, [])

    // fetch stats
    useFetch < { requested: number; scheduled: number; inProgress: number; completed: number; activeTeachers: number } > (
        ["livehelps", "stats"],
        `${API_PREFIX}/stats`,
        true,
        {
            onSuccessCallback: handleStatsSuccess,
            onErrorCallback: handleError,
        }
    )

    // list
    useFetch < any[] > (
        ["livehelps", monthOffset],
        `${API_PREFIX}?monthOffset=${monthOffset}`,
        true,
        {
            onSuccessCallback: handleItemsSuccess,
            onErrorCallback: handleError,
        }
    )

    // completed
    useFetch < any[] > (
        ["livehelps", "completed", monthOffset],
        `${API_PREFIX}?status=completed&monthOffset=${monthOffset}`,
        true,
        {
            onSuccessCallback: handleCompletedSuccess,
            onErrorCallback: handleError,
        }
    )

    // pending reschedules
    useFetch < any[] > (
        ["livehelps", "pending-reschedule", monthOffset],
        `${API_PREFIX}?status=pending-reschedule&monthOffset=${monthOffset}`,
        true,
        {
            onSuccessCallback: handleRescheduleSuccess,
            onErrorCallback: handleError,
        }
    )

    useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch (e) { } }, [items])

    const toggleFilter = (k: keyof typeof selectedFilters) => setSelectedFilters(p => ({ ...p, [k]: !p[k] }))

    const filteredItems = useMemo(() => items.filter(it => {
        // use metadata.helpType or other to map categories if available
        const cat = it.metadata?.helpType ?? "other"
        if (cat === "Assignment" || cat === "assignment") return selectedFilters.assignment
        if (cat === "Project" || cat === "project") return selectedFilters.project
        if (cat === "Consultation" || cat === "consultation") return selectedFilters.consultation
        return selectedFilters.other
    }), [items, selectedFilters])

    const filteredCompleted = useMemo(() => completedItems.filter(it => true), [completedItems])

    const timeSlots = useMemo(() => [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20], [])
    const formatHour = (hour: number) => { if (hour === 12) return "12PM"; if (hour > 12) return `${hour - 12}PM`; return `${hour}AM` }
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const monthDays = Array.from({ length: 31 }, (_, i) => i + 1)

    const monthLabel = useMemo(() => { const d = new Date(); d.setMonth(d.getMonth() + monthOffset); return d.toLocaleString(undefined, { month: "long", year: "numeric" }) }, [monthOffset])

    const openAddModal = () => { setForm({ title: "", description: "", pricePerHour: 0, liveHelpHours: 1, timezone: "Asia/Kolkata", scheduledDate: "", scheduledHour: 9 }); setIsModalOpen(true) }

    // mutations
    const patchMutation = useGenericMutation()
    const createMutation = useGenericMutation()
    const deleteMutation = useGenericMutation()

    const createBusy = (createMutation as any)?.isLoading ?? false
    const patchBusy = (patchMutation as any)?.isLoading ?? false
    const deleteBusy = (deleteMutation as any)?.isLoading ?? false

    async function createLiveHelp() {
        if (!form.title) { alert("Please enter title"); return }
        // build scheduled ISO if provided
        let scheduledISO: string | undefined
        if (form.scheduledDate) {
            scheduledISO = new Date(`${form.scheduledDate}T${String(form.scheduledHour).padStart(2, '0')}:00:00`).toISOString()
        }

        const payload: any = {
            title: form.title,
            description: form.description,
            pricePerHour: form.pricePerHour,
            liveHelpHours: form.liveHelpHours,
            timezone: form.timezone,
            metadata: { scheduledDateTime: scheduledISO }
        }

        createMutation.mutate({
            endpoint: `${API_PREFIX}`,
            data: payload,
            method: "POST",
            successMessage: "Live help created",
            errorMessage: "Failed to create live help",
            invalidateKeys: ["livehelps", "livehelps-stats"],
            onSuccessCallback: (respData: any) => {
                const created = Array.isArray(respData) ? respData[0] : (respData?.data ?? respData)
                if (created) setItems(s => [mapLiveHelpToItem(created), ...s])
                setIsModalOpen(false)
            }
        })
    }

    function handleAssignTeacher(item: LiveHelpItem) {
        const teacherIdOrName = prompt("Enter teacher ID or name to assign:")
        if (!teacherIdOrName) return
        patchMutation.mutate({
            endpoint: `${API_PREFIX}/${item.id}`,
            data: { teacherId: teacherIdOrName },
            method: "PATCH",
            successMessage: "Teacher assigned",
            errorMessage: "Failed to assign teacher",
            invalidateKeys: ["livehelps", "livehelps-stats"],
            onSuccessCallback: (resp) => {
                const updated = Array.isArray(resp) ? resp[0] : (resp?.data ?? resp);
                if (updated) setItems(s => s.map(it => it.id === (updated._id ?? updated.id) ? mapLiveHelpToItem(updated) : it))
            }
        })
    }

    function handleRemoveTeacher(item: LiveHelpItem) {
        if (!confirm("Remove teacher from this request?")) return
        patchMutation.mutate({
            endpoint: `${API_PREFIX}/${item.id}`,
            data: { teacherId: null },
            method: "PATCH",
            successMessage: "Teacher removed",
            errorMessage: "Failed to remove teacher",
            invalidateKeys: ["livehelps", "livehelps-stats"],
            onSuccessCallback: (resp) => {
                const updated = Array.isArray(resp) ? resp[0] : (resp?.data ?? resp);
                if (updated) setItems(s => s.map(it => it.id === (updated._id ?? updated.id) ? mapLiveHelpToItem(updated) : it))
            }
        })
    }

    function handleReschedule(item: LiveHelpItem) {
        const newDateStr = prompt("Enter new date (YYYY-MM-DD):", item.scheduledAt ? item.scheduledAt.slice(0, 10) : "")
        if (!newDateStr) return
        const newHourStr = prompt("Enter new start hour (0-23):", String(item.scheduledAt ? new Date(item.scheduledAt).getHours() : 9))
        if (!newHourStr) return
        const newHour = Number(newHourStr)
        if (Number.isNaN(newHour)) return alert("Invalid hour")

        const scheduled = new Date(`${newDateStr}T${String(newHour).padStart(2, '0')}:00:00`).toISOString()

        patchMutation.mutate({
            endpoint: `${API_PREFIX}/${item.id}`,
            data: { "metadata.scheduledDateTime": scheduled, scheduledAt: scheduled },
            method: "PATCH",
            successMessage: "Rescheduled",
            errorMessage: "Failed to reschedule",
            invalidateKeys: ["livehelps", "livehelps-stats"],
            onSuccessCallback: (resp) => {
                const updated = Array.isArray(resp) ? resp[0] : (resp?.data ?? resp);
                if (updated) {
                    setItems(s => s.map(it => it.id === (updated._id ?? updated.id) ? mapLiveHelpToItem(updated) : it));
                    setRescheduleItems(s => s.filter(r => r.id !== item.id))
                }
            }
        })
    }

    function handleViewDetails(item: LiveHelpItem) {
        alert(JSON.stringify(item, null, 2))
    }

    function handleDelete(item: LiveHelpItem) {
        if (!confirm("Delete this live help request?")) return
        deleteMutation.mutate({
            endpoint: `${API_PREFIX}/${item.id}`,
            data: {},
            method: "DELETE",
            successMessage: "Deleted",
            errorMessage: "Failed to delete",
            invalidateKeys: ["livehelps", "livehelps-stats"],
            onSuccessCallback: () => {
                setItems(s => s.filter(i => i.id !== item.id));
                setCompletedItems(s => s.filter(i => i.id !== item.id));
                setRescheduleItems(s => s.filter(i => i.id !== item.id))
            }
        })
    }

    function approveReschedule(item: LiveHelpItem) {
        if (!confirm("Approve this reschedule and make it scheduled?")) return
        patchMutation.mutate({
            endpoint: `${API_PREFIX}/${item.id}`,
            data: { status: "scheduled" },
            method: "PATCH",
            successMessage: "Approved",
            errorMessage: "Failed to approve",
            invalidateKeys: ["livehelps", "livehelps-stats"],
            onSuccessCallback: (resp) => {
                const updated = Array.isArray(resp) ? resp[0] : (resp?.data ?? resp);
                if (updated) {
                    setItems(s => [mapLiveHelpToItem(updated), ...s]);
                    setRescheduleItems(s => s.filter(r => r.id !== (updated._id ?? updated.id)))
                }
            }
        })
    }

    function declineReschedule(item: LiveHelpItem) {
        if (!confirm("Decline this reschedule request?")) return
        patchMutation.mutate({
            endpoint: `${API_PREFIX}/${item.id}`,
            data: { status: "requested" },
            method: "PATCH",
            successMessage: "Declined",
            errorMessage: "Failed to decline",
            invalidateKeys: ["livehelps", "livehelps-stats"],
            onSuccessCallback: (resp) => {
                const updated = Array.isArray(resp) ? resp[0] : (resp?.data ?? resp);
                if (updated) {
                    setRescheduleItems(s => s.filter(r => r.id !== (updated._id ?? updated.id)));
                    setItems(s => s.map(it => it.id === (updated._id ?? updated.id) ? mapLiveHelpToItem(updated) : it))
                }
            }
        })
    }

    function toggleExpand(id: string) {
        setItems(s => s.map(it => it.id === id ? { ...it, expanded: !it.expanded } : it))
    }

    // LiveHelp Card component - Mobile optimized with working menu
    const LiveHelpCard = ({ item, showActions = true }: { item: LiveHelpItem; showActions?: boolean }) => {
        const [isMenuOpen, setIsMenuOpen] = useState(false);
        const [menuPosition, setMenuPosition] = useState < 'left' | 'right' > ('right');
        const menuRef = useRef < HTMLDivElement > (null);
        const buttonRef = useRef < HTMLButtonElement > (null);
        const isPendingReschedule = item.status === "pending-reschedule"

        // Close menu when clicking outside
        useEffect(() => {
            function handleClickOutside(event: MouseEvent) {
                if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                    setIsMenuOpen(false);
                }
            }

            if (isMenuOpen) {
                document.addEventListener('mousedown', handleClickOutside);
                return () => document.removeEventListener('mousedown', handleClickOutside);
            }
        }, [isMenuOpen]);

        const handleMenuToggle = () => {
            if (!isMenuOpen && buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                const spaceRight = window.innerWidth - rect.right;
                const menuWidth = 176; // approximate menu width

                setMenuPosition(spaceRight < menuWidth ? 'left' : 'right');
            }
            setIsMenuOpen(!isMenuOpen);
        };

        const handleMenuItemClick = (action: () => void) => {
            action();
            setIsMenuOpen(false);
        };

        return (
            <Card className="p-0 overflow-hidden">
                <div className="flex">
                    <div className="w-1 bg-primary" />
                    <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-base font-semibold text-gray-900 pr-2">{item.title}</h3>
                            {showActions && (
                                <div className="relative" ref={menuRef}>
                                    <button
                                        ref={buttonRef}
                                        onClick={handleMenuToggle}
                                        aria-label="open menu"
                                        className="p-1 rounded hover:bg-gray-50 transition-colors"
                                    >
                                        <MoreVertical className="h-5 w-5 text-gray-600" />
                                    </button>
                                    {isMenuOpen && (
                                        <div className={`absolute top-8 z-50 w-44 rounded-lg border bg-white shadow-lg ${menuPosition === 'left' ? 'left-0' : 'right-0'
                                            }`}>
                                            <div className="py-1">
                                                <button
                                                    onClick={() => handleMenuItemClick(() => handleViewDetails(item))}
                                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    <Play className="h-4 w-4" /> View details
                                                </button>
                                                <button
                                                    onClick={() => handleMenuItemClick(() => handleAssignTeacher(item))}
                                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    <User className="h-4 w-4" /> Assign teacher
                                                </button>
                                                <button
                                                    onClick={() => handleMenuItemClick(() => handleRemoveTeacher(item))}
                                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    <XCircle className="h-4 w-4" /> Remove teacher
                                                </button>
                                                <div className="border-t border-gray-100 my-1"></div>
                                                <button
                                                    onClick={() => handleMenuItemClick(() => handleDelete(item))}
                                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                                                >
                                                    <Trash2 className="h-4 w-4" /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4">
                            {/* Left column */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-[44px] w-[44px] rounded-full bg-slate-100 flex items-center justify-center text-sm text-slate-700 flex-shrink-0">
                                        {(item.student?.name ?? "S").slice(0, 2)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-[16px] font-inter font-medium text-[#141414] truncate">{item.student?.name ?? "Student"}</div>
                                        <div className="text-[14px] text-[#8E8E93]">Student id: {item.student?.id ?? item.student ?? "—"}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-[44px] w-[44px] flex items-center justify-center text-sm text-slate-700 flex-shrink-0">
                                        <img src={SessionDateIcon} alt="Date/Time" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-[16px] font-inter font-medium text-[#141414]">{item.scheduledAt ? new Date(item.scheduledAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) : "—"}</div>
                                        <div className="text-[14px] text-[#8E8E93]">{item.scheduledAt ? new Date(item.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-[44px] w-[44px] rounded-full bg-slate-100 flex items-center justify-center text-sm text-slate-700 flex-shrink-0">
                                        <img src={ClockIcon} alt="Clock" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-[16px] font-inter font-medium text-[#141414]">{item.liveHelpHours ?? 1} hrs</div>
                                        <div className="text-[14px] text-[#8E8E93]">Duration</div>
                                    </div>
                                </div>
                            </div>

                            {/* Right column */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-[44px] w-[44px] rounded-full bg-pink-50 flex items-center justify-center text-sm text-pink-700 flex-shrink-0">
                                        <img src={SessionTeacherIcon} alt="Teacher" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-[16px] font-inter font-medium text-[#141414] truncate">{typeof item.teacher === "string" ? item.teacher : item.teacher?.name ?? "—"}</div>
                                        <div className="text-[14px] text-[#8E8E93]">Teacher</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-[44px] w-[44px] rounded-full bg-amber-50 flex items-center justify-center text-sm text-amber-700 flex-shrink-0">
                                        <img src={SessionMoneyIcon} alt="Price" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-[16px] font-inter font-medium text-[#141414]">${item.pricePerHour ?? 0}</div>
                                        <div className="text-[14px] text-[#8E8E93]">${item.pricePerHour ?? 0}/hr</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-[44px] w-[44px] rounded-full bg-rose-50 flex items-center justify-center text-sm text-rose-700 flex-shrink-0">
                                        <img src={Completed} alt="Status" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-[16px] font-inter font-medium text-[#141414]">{item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Requested"}</div>
                                        <div className="text-[14px] text-[#8E8E93]">Status</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom actions - Mobile responsive */}
                        {showActions && (
                            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center justify-between">
                                <div className="flex gap-2">
                                    <button title="Chat" className="rounded border py-[12px] px-[16px] text-gray-600 hover:bg-gray-50">
                                        <MessageCircle className="h-[24px] w-[24px]" />
                                    </button>
                                </div>

                                {isPendingReschedule ? (
                                    <div className="flex flex-wrap gap-2 justify-end">
                                        <button onClick={() => approveReschedule(item)} className="px-3 py-2 rounded bg-emerald-600 text-white text-sm hover:bg-emerald-700">Approve</button>
                                        <button onClick={() => declineReschedule(item)} className="px-3 py-2 rounded border text-sm">Decline</button>
                                        <button onClick={() => handleReschedule(item)} className="px-3 py-2 rounded border text-sm">Reschedule</button>
                                        <button onClick={() => handleDelete(item)} className="px-3 py-2 rounded bg-red-600 text-white text-sm hover:bg-red-700">Delete</button>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2 justify-end">
                                        <button onClick={() => handleReschedule(item)} className="py-[12px] px-[24px] border text-[16px] font-inter font-medium hover:bg-gray-50 flex items-center gap-2">
                                            <img src={DateIcon} alt="Date" /> Reschedule
                                        </button>
                                        <button onClick={() => alert('Start session flow')} className="py-[12px] px-[24px] border text-[16px] font-inter flex items-center gap-2 bg-primary font-medium text-white hover:bg-cyan-700">
                                            <Play className="h-4 w-4" /> Start
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        )
    }

    // Mobile tabs
    const mobileTabs = [
        { key: "calendar", label: "Calendar" },
        { key: "list", label: "Requests" },
        { key: "reschedule", label: "Reschedule" },
        { key: "completed", label: "Completed" }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Live Help</h1>
                    <button
                        onClick={() => setIsMobileSidebarOpen(true)}
                        className="p-2 hover:bg-gray-100 rounded-md"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="py-4 lg:py-8 px-4 lg:px-6">
                <div className="mx-auto">
                    {/* Header - Hidden on mobile, shown on desktop */}
                    <div className="hidden lg:block mb-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-[24px] font-poppins text-[#141414] font-bold">Good morning, Maria</h1>
                                <p className="text-[16px] text-[rgba(20, 20, 20, 0.6)] font-inter">Here is your live help request dashboard.</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                        <Card className="border-none bg-[#FFCED4] p-4 lg:p-6 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-2xl lg:text-[32px] font-bold text-[#141414]">{stats?.scheduled ?? 0}</div>
                                    <div className="mt-1 text-sm lg:text-[16px] text-[#141414]">Scheduled</div>
                                </div>
                                <div className="p-1 lg:p-2">
                                    <Calendar className="h-4 w-4 lg:h-5 lg:w-5 text-gray-700" />
                                </div>
                            </div>
                        </Card>

                        <Card className="border-none bg-[#BCEFFF] p-4 lg:p-6 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-2xl lg:text-[32px] font-bold text-[#141414]">{stats?.requested ?? 0}</div>
                                    <div className="mt-1 text-sm lg:text-[16px] text-[#141414]">Requested</div>
                                </div>
                                <div className="p-1 lg:p-2">
                                    <img src={TimeIcon} alt="Time Icon" className="w-4 h-4 lg:w-5 lg:h-5" />
                                </div>
                            </div>
                        </Card>

                        <Card className="border-none bg-[#C4CAFF] p-4 lg:p-6 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-2xl lg:text-[32px] font-bold text-[#141414]">{stats?.inProgress ?? 0}</div>
                                    <div className="mt-1 text-sm lg:text-[16px] text-[#141414]">In Progress</div>
                                </div>
                                <div className="p-1 lg:p-2">
                                    <img src={LeartIcon} alt="Leart Icon" className="w-4 h-4 lg:w-5 lg:h-5" />
                                </div>
                            </div>
                        </Card>

                        <Card className="border-none bg-[#FFBDE8] p-4 lg:p-6 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-2xl lg:text-[32px] font-bold text-[#141414]">{stats?.activeTeachers ?? 0}</div>
                                    <div className="mt-1 text-sm lg:text-[16px] text-[#141414]">Active Teachers</div>
                                </div>
                                <div className="p-1 lg:p-2">
                                    <img src={ProfileIcon} alt="Profile Icon" className="w-4 h-4 lg:w-5 lg:h-5" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Mobile Tabs */}
                    <div className="lg:hidden mb-4">
                        <div className="flex overflow-x-auto pb-2">
                            {mobileTabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 mr-4 transition-colors ${activeTab === tab.key
                                        ? "border-primary text-[#141414]"
                                        : "border-transparent text-[#8E8E93] hover:text-gray-700"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Tabs */}
                    <div className="hidden lg:flex mb-6 gap-6 border-b border-gray-200">
                        {["calendar", "list", "reschedule", "completed"].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-[16px] pt-0 pr-[24px] pl-[24px] text-[16px] font-inter font-medium capitalize transition-colors ${activeTab === tab ? "border-b-2 border-primary text-[#141414]" : "text-[#8E8E93] hover:text-gray-700"
                                    }`}
                            >
                                {tab === "list" ? "Requests" : tab}
                            </button>
                        ))}
                    </div>

                    {/* Main Content */}
                    {activeTab === "list" ? (
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            {filteredItems.length === 0 ? (
                                <div className="col-span-full py-20 text-center text-gray-500">No live help requests</div>
                            ) : (
                                filteredItems.map(it => <LiveHelpCard item={it} key={it.id} />)
                            )}
                        </div>
                    ) : activeTab === "completed" ? (
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            {filteredCompleted.length === 0 ? (
                                <div className="col-span-full py-20 text-center text-gray-500">No completed requests</div>
                            ) : (
                                filteredCompleted.map(it => <LiveHelpCard key={it.id} item={it} showActions={false} />)
                            )}
                        </div>
                    ) : activeTab === "reschedule" ? (
                        rescheduleItems.length === 0 ? (
                            <div className="py-12 text-center text-gray-500">No pending reschedules</div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {rescheduleItems.map(it => (
                                    <RescheduleCard
                                        key={it.id}
                                        item={it}
                                        onApprove={approveReschedule}
                                        onDecline={declineReschedule}
                                        onReschedule={handleReschedule}
                                        onChat={(s: any) => alert('Open chat for ' + (s.title ?? s.id))}
                                    />
                                ))}
                            </div>
                        )
                    ) : (
                        // Calendar view
                        <div className="grid gap-6 lg:grid-cols-1">
                            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center justify-between">
                                <div className="flex items-center gap-2 justify-center lg:justify-start">
                                    <button onClick={() => setMonthOffset(m => m - 1)} className="rounded-lg p-1 hover:bg-gray-100">
                                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                                    </button>
                                    <span className="text-sm font-medium text-gray-900 min-w-[140px] text-center">{monthLabel}</span>
                                    <button onClick={() => setMonthOffset(m => m + 1)} className="rounded-lg p-1 hover:bg-gray-100">
                                        <ChevronRight className="h-5 w-5 text-gray-600" />
                                    </button>
                                </div>

                                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
                                    <div className="flex gap-2 rounded-lg border border-gray-200 p-[4px]">
                                        {(["daily", "weekly", "monthly"] as const).map(mode => (
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

                                    <div className="flex gap-2">
                                        <CategoryDropdown selectedFilters={selectedFilters} toggleFilter={toggleFilter} />
                                        <Button onClick={openAddModal} className="text-[14px] lg:text-[16px] font-inter flex items-center gap-2 px-[12px] py-[12px] bg-primary text-white hover:bg-cyan-600">
                                            <Plus className="h-4 w-4" />
                                            <span className="hidden sm:inline">Request Help</span>
                                            <span className="sm:hidden">Add</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Calendar Views - Now includes DAILY view */}
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
                                                        {filteredItems.filter(si => si.scheduledAt ? new Date(si.scheduledAt).getDay() === dayIndex : false).map(item => (
                                                            <div key={item.id} className={`rounded-lg ${item.status === 'scheduled' ? 'bg-white' : 'bg-gray-50'} p-3 transition-all hover:shadow-md`}>
                                                                <div className="mb-1 flex items-center gap-2">
                                                                    <Avatar className="h-6 w-6 bg-gray-300 text-[10px] font-medium text-gray-700">
                                                                        {(item.student?.name ?? 'S').slice(0, 2)}
                                                                    </Avatar>
                                                                    <div className="text-[10px] text-gray-600">
                                                                        {item.scheduledAt ? new Date(item.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                                                                    </div>
                                                                </div>
                                                                <div className="text-xs font-medium leading-tight text-gray-900">{item.title}</div>
                                                                <div className="mt-2 flex justify-end gap-2">
                                                                    <button onClick={() => handleReschedule(item)} className="text-gray-600">
                                                                        <ChevronDown className="h-4 w-4" />
                                                                    </button>
                                                                    <button onClick={() => handleDelete(item)} className="text-red-500">
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {!filteredItems.some(si => si.scheduledAt ? new Date(si.scheduledAt).getDay() === dayIndex : false) && (
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
                                        {dayNames.map(d => (
                                            <div key={d} className="p-2 text-center text-xs font-semibold text-gray-600">
                                                <span className="hidden sm:inline">{d}</span>
                                                <span className="sm:hidden">{d.slice(0, 1)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 lg:gap-2">
                                        {monthDays.map(day => {
                                            const eventsForDay = filteredItems.filter(si => si.scheduledAt ? new Date(si.scheduledAt).getDate() === day : false);
                                            const hasEvents = eventsForDay.length > 0;
                                            return (
                                                <div key={day} className={`min-h-[80px] lg:min-h-[100px] rounded-lg border p-2 transition-all hover:shadow-md ${hasEvents ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'}`}>
                                                    <div className="mb-2 text-xs lg:text-sm font-semibold text-gray-900">{day}</div>
                                                    <div className="space-y-1">
                                                        {eventsForDay.slice(0, 2).map(item => (
                                                            <div key={item.id} className={`rounded ${item.status === 'scheduled' ? 'bg-cyan-50' : 'bg-amber-50'} px-1 lg:px-2 py-1 text-[10px] font-medium leading-tight text-gray-900`}>
                                                                <div className="hidden lg:block">{item.scheduledAt ? new Date(item.scheduledAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''} {item.title.substring(0, 15)}...</div>
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
                    )}
                </div>
            </div>

            {/* Modal: Request Live Help - Responsive */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-xl rounded-lg bg-white p-4 lg:p-6 shadow-lg max-h-[90vh] overflow-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Request Live Help</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 p-2">
                                <XCircle className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full rounded border border-gray-300 p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={3}
                                    className="w-full rounded border border-gray-300 p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price/hr</label>
                                    <input
                                        type="number"
                                        value={form.pricePerHour}
                                        onChange={(e) => setForm({ ...form, pricePerHour: Number(e.target.value) })}
                                        className="w-full rounded border border-gray-300 p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
                                    <input
                                        type="number"
                                        value={form.liveHelpHours}
                                        onChange={(e) => setForm({ ...form, liveHelpHours: Number(e.target.value) })}
                                        className="w-full rounded border border-gray-300 p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        value={form.scheduledDate}
                                        onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                                        className="w-full rounded border border-gray-300 p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hour</label>
                                    <select
                                        value={form.scheduledHour}
                                        onChange={(e) => setForm({ ...form, scheduledHour: Number(e.target.value) })}
                                        className="w-full rounded border border-gray-300 p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        {Array.from({ length: 15 }, (_, i) => i + 6).map(h => (
                                            <option key={h} value={h}>{formatHour(h)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-4 border-t">
                                <Button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-full sm:w-auto px-[24px] py-[12px] bg-gray-100 text-gray-700 hover:bg-gray-200"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={createLiveHelp}
                                    className="w-full sm:w-auto px-[24px] py-[12px] bg-primary text-white hover:bg-cyan-700"
                                    disabled={createBusy || patchBusy}
                                >
                                    {createBusy ? 'Creating…' : 'Request'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
