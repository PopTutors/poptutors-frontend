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

// Reuse CategoryDropdown UI from sessions (keeps same look & feel)
function CategoryDropdown({ selectedFilters, toggleFilter }: { selectedFilters: Record<string, boolean>; toggleFilter: (k: string) => void }) {
    const [open, setOpen] = useState(false)
    const ref = useRef < HTMLDivElement | null > (null)

    useEffect(() => {
        function onDoc(e: MouseEvent) {
            if (!ref.current) return
            if (e.target instanceof Node && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener("mousedown", onDoc)
        return () => document.removeEventListener("mousedown", onDoc)
    }, [])

    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-haspopup="true" className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Category
                <ChevronDown className="h-4 w-4 text-gray-600" />
            </button>

            {open && (
                <div role="menu" aria-label="Category filters" className="absolute right-0 z-40 mt-2 w-64 border border-gray-200 bg-white shadow-lg">
                    <div className="p-3 text-sm font-medium text-gray-800">Category</div>
                    <div className="divide-y divide-gray-100">
                        <div className="p-3 space-y-2 w-full">
                            <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={selectedFilters.assignment} onCheckedChange={() => toggleFilter('assignment')} /><span className="text-sm">Assignment</span></label>
                            <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={selectedFilters.project} onCheckedChange={() => toggleFilter('project')} /><span className="text-sm">Project</span></label>
                            <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={selectedFilters.consultation} onCheckedChange={() => toggleFilter('consultation')} /><span className="text-sm">Consultation</span></label>
                            <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={selectedFilters.other} onCheckedChange={() => toggleFilter('other')} /><span className="text-sm">Other</span></label>
                        </div>
                        <div className="p-2"><button onClick={() => { (Object.keys(selectedFilters) as string[]).forEach((k) => { if (!selectedFilters[k]) toggleFilter(k) }) }} className="w-full rounded px-3 py-2 text-sm font-medium text-cyan-600 hover:bg-gray-50">+ Add</button></div>
                    </div>
                </div>
            )}
        </div>
    )
}

function RescheduleCard({ item, onApprove, onDecline, onReschedule, onChat }: { item: any; onApprove: (s: any) => void; onDecline: (s: any) => void; onReschedule: (s: any) => void; onChat: (s: any) => void }) {
    const formatDateTime = (iso?: string) => {
        if (!iso) return "—"
        const date = new Date(iso)
        return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    }

    return (
        <div className="border-l-4 border-primary bg-white shadow-sm p-4">
            <div className="flex items-start justify-between mb-4">
                <div className="text-sm font-semibold text-gray-800">{item.title}</div>
                <div className="text-xs text-gray-500">{formatDateTime(item.scheduledAt)}</div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-3 bg-gray-50 p-3">
                    <div className="flex-shrink-0 h-8 w-8 bg-white border border-gray-200 flex items-center justify-center"><User className="h-4 w-4 text-gray-600" /></div>
                    <div className="flex-1 flex items-center gap-3">
                        <div className="flex-1"><div className="text-sm font-medium text-gray-900">{formatDateTime(item.scheduledAt)}</div><div className="text-xs text-gray-400">Current</div></div>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-400 flex-shrink-0"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <div className="flex-1"><div className="text-sm font-medium text-gray-900">{formatDateTime(item.requestedAt)}</div><div className="text-xs text-gray-400">Requested</div></div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                {item.reason && <div className="text-sm text-rose-600"><span className="font-medium">Reason: </span>{item.reason}</div>}
                <div className="flex items-center gap-2 ml-auto">
                    <button onClick={() => onChat(item)} className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white p-2 hover:bg-gray-50"><MessageCircle className="h-4 w-4 text-gray-600" /></button>
                    <button onClick={() => onDecline(item)} className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white p-2 hover:bg-gray-50"><XCircle className="h-4 w-4 text-gray-600" /></button>
                    <button onClick={() => onApprove(item)} className="bg-[rgba(52, 199, 89, 0.1)] inline-flex items-center justify-center rounded-full border border-gray-200 bg-white p-2 hover:bg-gray-50"><CheckCircle className="h-4 w-4 text-gray-600" /></button>
                </div>
            </div>
        </div>
    )
}

export default function MyLiveHelpPage() {
    const [activeTab, setActiveTab] = useState("calendar")
    const [viewMode, setViewMode] = useState < "daily" | "weekly" | "monthly" > ("weekly")
    const [monthOffset, setMonthOffset] = useState(0)

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
    const [openMenuFor, setOpenMenuFor] = useState < string | null > (null)

    // fetch stats
    useFetch < { requested: number; scheduled: number; inProgress: number; completed: number; activeTeachers: number } > (["livehelps", "stats"], `${API_PREFIX}/stats`, true, {
        onSuccessCallback: (data) => {
            if (!data) return
            const payload = Array.isArray(data) ? data[0] : data
            setStats({ requested: payload.requested ?? 0, scheduled: payload.scheduled ?? 0, inProgress: payload.inProgress ?? 0, completed: payload.completed ?? 0, activeTeachers: payload.activeTeachers ?? 0 })
        },
        onErrorCallback: (err) => console.error("LiveHelp stats error", err?.message),
    })

    // list
    useFetch < any[] > (["livehelps", monthOffset], `${API_PREFIX}?monthOffset=${monthOffset}`, true, {
        onSuccessCallback: (data) => {
            const arr = Array.isArray(data) ? data : (data?.data ?? [])
            if (Array.isArray(arr)) setItems(arr.map(mapLiveHelpToItem))
        },
        onErrorCallback: (err) => console.error("LiveHelp fetch error", err?.message),
    })

    // completed
    useFetch < any[] > (["livehelps", "completed", monthOffset], `${API_PREFIX}?status=completed&monthOffset=${monthOffset}`, true, {
        onSuccessCallback: (data) => { const arr = Array.isArray(data) ? data : (data?.data ?? []); if (Array.isArray(arr)) setCompletedItems(arr.map(mapLiveHelpToItem)) },
        onErrorCallback: (err) => console.error("Completed fetch error", err?.message),
    })

    // pending reschedules - using status pending-reschedule if your service sets it, else adapt
    useFetch < any[] > (["livehelps", "pending-reschedule", monthOffset], `${API_PREFIX}?status=pending-reschedule&monthOffset=${monthOffset}`, true, {
        onSuccessCallback: (data) => { const arr = Array.isArray(data) ? data : (data?.data ?? []); if (Array.isArray(arr)) setRescheduleItems(arr.map(mapLiveHelpToItem)) },
        onErrorCallback: (err) => console.error("Reschedule fetch error", err?.message),
    })

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
            endpoint: `${API_PREFIX}`, data: payload, method: "POST", successMessage: "Live help created", errorMessage: "Failed to create live help", invalidateKeys: ["livehelps", "livehelps-stats"], onSuccessCallback: (respData: any) => {
                const created = Array.isArray(respData) ? respData[0] : (respData?.data ?? respData)
                if (created) setItems(s => [mapLiveHelpToItem(created), ...s])
                setIsModalOpen(false)
            }
        })
    }

    function handleAssignTeacher(item: LiveHelpItem) {
        const teacherIdOrName = prompt("Enter teacher ID or name to assign:")
        if (!teacherIdOrName) return
        patchMutation.mutate({ endpoint: `${API_PREFIX}/${item.id}`, data: { teacherId: teacherIdOrName }, method: "PATCH", successMessage: "Teacher assigned", errorMessage: "Failed to assign teacher", invalidateKeys: ["livehelps", "livehelps-stats"], onSuccessCallback: (resp) => { const updated = Array.isArray(resp) ? resp[0] : (resp?.data ?? resp); if (updated) setItems(s => s.map(it => it.id === (updated._id ?? updated.id) ? mapLiveHelpToItem(updated) : it)) } })
        setOpenMenuFor(null)
    }

    function handleRemoveTeacher(item: LiveHelpItem) {
        if (!confirm("Remove teacher from this request?")) return
        patchMutation.mutate({ endpoint: `${API_PREFIX}/${item.id}`, data: { teacherId: null }, method: "PATCH", successMessage: "Teacher removed", errorMessage: "Failed to remove teacher", invalidateKeys: ["livehelps", "livehelps-stats"], onSuccessCallback: (resp) => { const updated = Array.isArray(resp) ? resp[0] : (resp?.data ?? resp); if (updated) setItems(s => s.map(it => it.id === (updated._id ?? updated.id) ? mapLiveHelpToItem(updated) : it)) } })
        setOpenMenuFor(null)
    }

    function handleReschedule(item: LiveHelpItem) {
        const newDateStr = prompt("Enter new date (YYYY-MM-DD):", item.scheduledAt ? item.scheduledAt.slice(0, 10) : "")
        if (!newDateStr) return
        const newHourStr = prompt("Enter new start hour (0-23):", String(item.scheduledAt ? new Date(item.scheduledAt).getHours() : 9))
        if (!newHourStr) return
        const newHour = Number(newHourStr)
        if (Number.isNaN(newHour)) return alert("Invalid hour")

        const scheduled = new Date(`${newDateStr}T${String(newHour).padStart(2, '0')}:00:00`).toISOString()

        patchMutation.mutate({ endpoint: `${API_PREFIX}/${item.id}`, data: { "metadata.scheduledDateTime": scheduled, scheduledAt: scheduled }, method: "PATCH", successMessage: "Rescheduled", errorMessage: "Failed to reschedule", invalidateKeys: ["livehelps", "livehelps-stats"], onSuccessCallback: (resp) => { const updated = Array.isArray(resp) ? resp[0] : (resp?.data ?? resp); if (updated) setItems(s => s.map(it => it.id === (updated._id ?? updated.id) ? mapLiveHelpToItem(updated) : it)); setRescheduleItems(s => s.filter(r => r.id !== item.id)) } })
        setOpenMenuFor(null)
    }

    function handleViewDetails(item: LiveHelpItem) { alert(JSON.stringify(item, null, 2)) }

    function handleDelete(item: LiveHelpItem) {
        if (!confirm("Delete this live help request?")) return
        deleteMutation.mutate({ endpoint: `${API_PREFIX}/${item.id}`, data: {}, method: "DELETE", successMessage: "Deleted", errorMessage: "Failed to delete", invalidateKeys: ["livehelps", "livehelps-stats"], onSuccessCallback: () => { setItems(s => s.filter(i => i.id !== item.id)); setCompletedItems(s => s.filter(i => i.id !== item.id)); setRescheduleItems(s => s.filter(i => i.id !== item.id)) } })
    }

    function approveReschedule(item: LiveHelpItem) {
        if (!confirm("Approve this reschedule and make it scheduled?")) return
        patchMutation.mutate({ endpoint: `${API_PREFIX}/${item.id}`, data: { status: "scheduled" }, method: "PATCH", successMessage: "Approved", errorMessage: "Failed to approve", invalidateKeys: ["livehelps", "livehelps-stats"], onSuccessCallback: (resp) => { const updated = Array.isArray(resp) ? resp[0] : (resp?.data ?? resp); if (updated) { setItems(s => [mapLiveHelpToItem(updated), ...s]); setRescheduleItems(s => s.filter(r => r.id !== (updated._id ?? updated.id))) } } })
    }

    function declineReschedule(item: LiveHelpItem) {
        if (!confirm("Decline this reschedule request?")) return
        patchMutation.mutate({ endpoint: `${API_PREFIX}/${item.id}`, data: { status: "requested" }, method: "PATCH", successMessage: "Declined", errorMessage: "Failed to decline", invalidateKeys: ["livehelps", "livehelps-stats"], onSuccessCallback: (resp) => { const updated = Array.isArray(resp) ? resp[0] : (resp?.data ?? resp); if (updated) { setRescheduleItems(s => s.filter(r => r.id !== (updated._id ?? updated.id))); setItems(s => s.map(it => it.id === (updated._id ?? updated.id) ? mapLiveHelpToItem(updated) : it)) } } })
    }

    function mapLiveHelpToItem(s: any): LiveHelpItem {
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
    }

    // Session-like card for livehelp (keeps same visual arrangement)
    const LiveHelpCard = ({ item, showActions = true }: { item: LiveHelpItem; showActions?: boolean }) => {
        const isPendingReschedule = item.status === "pending-reschedule"
        return (
            <Card className="p-0 overflow-hidden">
                <div className="flex">
                    <div className="w-1 bg-primary" />
                    <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                            <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                            <div className="relative">
                                <button onClick={() => setOpenMenuFor(prev => prev === item.id ? null : item.id)} aria-label="open menu" className="p-1 rounded hover:bg-gray-50"><MoreVertical className="h-5 w-5 text-gray-600" /></button>
                                {openMenuFor === item.id && (
                                    <div className="absolute right-0 top-8 z-50 w-44 rounded border bg-white p-1 shadow">
                                        <button onClick={() => handleViewDetails(item)} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"><Play className="h-4 w-4" /> View details</button>
                                        <button onClick={() => handleAssignTeacher(item)} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">+ Assign teacher</button>
                                        <button onClick={() => handleRemoveTeacher(item)} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">○ Remove teacher</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="h-[44px] w-[44px] rounded-full bg-slate-100 flex items-center justify-center text-sm text-slate-700">{(item.student?.name ?? "S").slice(0, 2)}</div>
                                    <div>
                                        <div className="text-[16px] font-inter font-medium text-[#141414]">{item.student?.name ?? "Student"}</div>
                                        <div className="text-[14px] text-[#8E8E93]">Student id: {item.student?.id ?? item.student ?? "—"}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-[44px] w-[44px] flex items-center justify-center text-sm text-slate-700"><img src={SessionDateIcon} alt="Date/Time" /></div>
                                    <div>
                                        <div className="text-[16px] font-inter font-medium text-[#141414]">{item.scheduledAt ? new Date(item.scheduledAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) : "—"}</div>
                                        <div className="text-[14px] text-[#8E8E93]">{item.scheduledAt ? new Date(item.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-[44px] w-[44px] rounded-full bg-slate-100 flex items-center justify-center text-sm text-slate-700"><img src={ClockIcon} /></div>
                                    <div>
                                        <div className="text-[16px] font-inter font-medium text-[#141414]">{item.liveHelpHours ?? 1} hrs</div>
                                        <div className="text-[14px] text-[#8E8E93]">Duration</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="h-[44px] w-[44px] rounded-full bg-pink-50 flex items-center justify-center text-sm text-pink-700"><img src={SessionTeacherIcon} alt="Teacher" /></div>
                                    <div>
                                        <div className="text-[16px] font-inter font-medium text-[#141414]">{typeof item.teacher === "string" ? item.teacher : item.teacher?.name ?? "—"}</div>
                                        <div className="text-[14px] text-[#8E8E93]">Teacher</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-[44px] w-[44px] rounded-full bg-amber-50 flex items-center justify-center text-sm text-amber-700"><img src={SessionMoneyIcon} alt="Price" /></div>
                                    <div>
                                        <div className="text-[16px] font-inter font-medium text-[#141414]">${item.pricePerHour ?? 0}</div>
                                        <div className="text-[14px] text-[#8E8E93]">${item.pricePerHour ?? 0}/hr</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-[44px] w-[44px] rounded-full bg-rose-50 flex items-center justify-center text-sm text-rose-700"><img src={Completed} alt="Status" /></div>
                                    <div>
                                        <div className="text-[16px] font-inter font-medium text-[#141414]">{item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Requested"}</div>
                                        <div className="text-[14px] text-[#8E8E93]">Status</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-col gap-2 sm:flex-row items-stretch sm:items-center justify-between">
                            <div className="flex gap-2"><button title="Chat" className="rounded border py-[12px] px-[16px] text-gray-600 hover:bg-gray-50"><MessageCircle className="h-[24px] w-[24px]" /></button></div>

                            {isPendingReschedule ? (
                                <div className="flex gap-2 justify-end">
                                    <button onClick={() => approveReschedule(item)} className="px-4 py-2 rounded bg-emerald-600 text-white text-sm hover:bg-emerald-700">Approve</button>
                                    <button onClick={() => declineReschedule(item)} className="px-4 py-2 rounded border text-sm">Decline</button>
                                    <button onClick={() => handleReschedule(item)} className="px-4 py-2 rounded border text-sm">Reschedule</button>
                                    <button onClick={() => handleDelete(item)} className="px-4 py-2 rounded bg-red-600 text-white text-sm hover:bg-red-700">Delete</button>
                                </div>
                            ) : (
                                <div className="flex gap-2 justify-end">
                                    <button onClick={() => handleReschedule(item)} className="py-[12px] px-[24px] border text-[16px] font-inter font-medium hover:bg-gray-50 flex gap-2"><img src={DateIcon} /> Reschedule</button>
                                    <button onClick={() => alert('Start session flow')} className="py-[12px] px-[24px] border text-[16px] font-inter flex items-center gap-2 bg-primary font-medium text-white hover:bg-cyan-700"><Play className="h-4 w-4" /> Start</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="mx-auto max-w-7xl px-4">
                <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-[24px] font-poppins text-[#141414] font-bold">Good morning, Maria</h1>
                        <p className="text-[16px] text-[rgba(20, 20, 20, 0.6)] font-inter">Here is your live help request dashboard.</p>
                    </div>
                    {/* <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2"><span className="text-sm text-gray-700">This week</span><Calendar className="h-4 w-4 text-gray-500" /></div> */}
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-none bg-[#FFCED4] p-6 shadow-sm"><div className="flex items-start justify-between"><div><div className="text-[32px] font-bold text-[#141414]">{stats?.scheduled ?? 0}</div><div className="mt-1 text-[16px] text-[#141414]">Scheduled</div></div><div className="p-2"><Calendar className="h-5 w-5 text-gray-700" /></div></div></Card>

                    <Card className="border-none bg-[#BCEFFF] p-6 shadow-sm"><div className="flex items-start justify-between"><div><div className="text-[32px] font-bold text-[#141414]">{stats?.requested ?? 0}</div><div className="mt-1 text-[16px] text-[#141414]">Requested</div></div><div className="p-2"><img src={TimeIcon} alt="Time Icon" className="w-5 h-5" /></div></div></Card>

                    <Card className="border-none bg-[#C4CAFF] p-6 shadow-sm"><div className="flex items-start justify-between"><div><div className="text-[32px] font-bold text-[#141414]">{stats?.inProgress ?? 0}</div><div className="mt-1 text-[16px] text-[#141414]">In Progress</div></div><div className="p-2"><img src={LeartIcon} alt="Leart Icon" className="w-5 h-5" /></div></div></Card>

                    <Card className="border-none bg-[#FFBDE8] p-6 shadow-sm"><div className="flex items-start justify-between"><div><div className="text-[32px] font-bold text-[#141414]">{stats?.activeTeachers ?? 0}</div><div className="mt-1 text-[16px] text-[#141414]">Active Teachers</div></div><div className="p-2"><img src={ProfileIcon} alt="Profile Icon" className="w-5 h-5" /></div></div></Card>
                </div>

                <div className="mb-6 flex gap-6 border-b border-gray-200 overflow-auto">
                    {["calendar", "list", "reschedule", "completed"].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-[16px] pt-0 pr-[24px] pl-[24px] text-[16px] font-inter font-medium capitalize transition-colors ${activeTab === tab ? "border-b-2 border-primary text-[#141414]" : "text-[#8E8E93] hover:text-gray-700"}`}>{tab}</button>
                    ))}
                </div>

                {activeTab === "list" ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{filteredItems.length === 0 ? <div className="col-span-full py-20 text-center text-gray-500">No live help requests</div> : filteredItems.map(it => <LiveHelpCard item={it} key={it.id} />)}</div>
                ) : activeTab === "completed" ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">{filteredCompleted.length === 0 ? <div className="col-span-full py-20 text-center text-gray-500">No completed requests</div> : filteredCompleted.map(it => <LiveHelpCard key={it.id} item={it} showActions={false} />)}</div>
                ) : activeTab === "reschedule" ? (
                    rescheduleItems.length === 0 ? <div className="py-12 text-center text-gray-500">No pending reschedules</div> : <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{rescheduleItems.map(it => <RescheduleCard key={it.id} item={it} onApprove={approveReschedule} onDecline={declineReschedule} onReschedule={handleReschedule} onChat={(s: any) => alert('Open chat for ' + (s.title ?? s.id))} />)}</div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-1">
                        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <button onClick={() => setMonthOffset(m => m - 1)} className="rounded-lg p-1 hover:bg-gray-100"><ChevronLeft className="h-5 w-5 text-gray-600" /></button>
                                <span className="text-sm font-medium text-gray-900">{monthLabel}</span>
                                <button onClick={() => setMonthOffset(m => m + 1)} className="rounded-lg p-1 hover:bg-gray-100"><ChevronRight className="h-5 w-5 text-gray-600" /></button>
                            </div>

                            <div className="flex gap-2 rounded-lg border border-gray-200 p-[4px]">{(["daily", "weekly", "monthly"] as const).map(mode => (<button key={mode} onClick={() => setViewMode(mode)} className={`rounded px-3 py-1 text-[14px] font-inter text-[#8E8E93] font-medium capitalize transition-colors ${viewMode === mode ? "bg-white text-primary" : "text-gray-600 hover:bg-gray-100"}`}>{mode}</button>))}</div>

                            <Button onClick={openAddModal} className="text-[16px] font-inter flex items-center gap-2 px-[12px] py-[12px] bg-primary text-white hover:bg-cyan-600"><Plus className="h-4 w-4" /> Request Help</Button>
                        </div>

                        {viewMode === "weekly" && (
                            <div className="overflow-x-auto"><div className="grid min-w-[800px] grid-cols-7 gap-2">{dayNames.map((dayName, dayIndex) => {
                                const dateNumber = 15 + dayIndex
                                return (<div key={dayIndex} className="space-y-2"><div className="rounded-lg bg-gray-100 p-2 text-center"><div className="text-xs font-semibold text-gray-700">{dayName}</div><div className="text-lg font-bold text-gray-900">{dateNumber}</div></div><div className="space-y-2">{filteredItems.filter(si => si.scheduledAt ? new Date(si.scheduledAt).getDay() === dayIndex : false).map(item => (<div key={item.id} className={`rounded-lg ${item.status === 'scheduled' ? 'bg-white' : 'bg-gray-50'} p-3 transition-all hover:shadow-md`}><div className="mb-1 flex items-center gap-2"><Avatar className="h-6 w-6 bg-gray-300 text-[10px] font-medium text-gray-700">{(item.student?.name ?? 'S').slice(0, 2)}</Avatar><div className="text-[10px] text-gray-600">{item.scheduledAt ? new Date(item.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</div></div><div className="text-xs font-medium leading-tight text-gray-900">{item.title}</div><div className="mt-2 flex justify-end gap-2"><button onClick={() => handleReschedule(item)} className="text-gray-600"><ChevronDown className="h-4 w-4" /></button><button onClick={() => handleDelete(item)} className="text-red-500"><Trash2 className="h-4 w-4" /></button></div></div>))}{!filteredItems.some(si => si.scheduledAt ? new Date(si.scheduledAt).getDay() === dayIndex : false) && (<div className="rounded-lg border-2 border-dashed border-gray-200 p-4 text-center"><p className="text-xs text-gray-400">No events</p></div>)}</div></div>)
                            })}</div></div>
                        )}

                        {viewMode === "monthly" && (
                            <div className="space-y-4"><div className="grid grid-cols-7 gap-2">{dayNames.map(d => <div key={d} className="p-2 text-center text-xs font-semibold text-gray-600">{d}</div>)}</div><div className="grid grid-cols-7 gap-2">{monthDays.map(day => { const eventsForDay = filteredItems.filter(si => si.scheduledAt ? new Date(si.scheduledAt).getDate() === day : false); const hasEvents = eventsForDay.length > 0; return (<div key={day} className={`min-h-[100px] rounded-lg border p-2 transition-all hover:shadow-md ${hasEvents ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'}`}><div className="mb-2 text-sm font-semibold text-gray-900">{day}</div><div className="space-y-1">{eventsForDay.slice(0, 3).map(item => (<div key={item.id} className={`rounded ${item.status === 'scheduled' ? 'bg-cyan-50' : 'bg-amber-50'} px-2 py-1 text-[10px] font-medium leading-tight text-gray-900`}>{new Date(item.scheduledAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {item.title.substring(0, 20)}...</div>))}{eventsForDay.length > 3 && <div className="px-2 text-[10px] font-medium text-gray-500">+{eventsForDay.length - 3} more</div>}</div></div>) })}</div></div>
                        )}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-lg max-h-[90vh] overflow-auto"><div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Request Live Help</h3><button onClick={() => setIsModalOpen(false)} className="text-gray-500">Close</button></div><div className="mt-4 grid grid-cols-1 gap-3"><label className="text-xs font-medium text-gray-700">Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded border p-2" /><label className="text-xs font-medium text-gray-700">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded border p-2" />

                    <div className="grid grid-cols-2 gap-3"><div><label className="text-xs font-medium text-gray-700">Price/hr</label><input type="number" value={form.pricePerHour as any} onChange={(e) => setForm({ ...form, pricePerHour: Number(e.target.value) })} className="w-full rounded border p-2" /></div><div><label className="text-xs font-medium text-gray-700">Hours</label><input type="number" value={form.liveHelpHours as any} onChange={(e) => setForm({ ...form, liveHelpHours: Number(e.target.value) })} className="w-full rounded border p-2" /></div></div>

                    <div className="grid grid-cols-2 gap-3"><div><label className="text-xs font-medium text-gray-700">Date</label><input type="date" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} className="w-full rounded border p-2" /></div><div><label className="text-xs font-medium text-gray-700">Hour</label><select value={form.scheduledHour} onChange={(e) => setForm({ ...form, scheduledHour: Number(e.target.value) })} className="w-full rounded border p-2">{Array.from({ length: 15 }, (_, i) => i + 6).map(h => <option key={h} value={h}>{formatHour(h)}</option>)}</select></div></div>

                    <div className="mt-3 flex items-center justify-end gap-2"><Button onClick={() => setIsModalOpen(false)} className="px-[24px] py-[12px] bg-gray-100 text-gray-700">Cancel</Button><Button onClick={createLiveHelp} className="px-[24px] py-[12px] bg-primary text-white" disabled={createBusy || patchBusy}>{createBusy ? 'Creating…' : 'Request'}</Button></div></div></div></div>
            )}
        </div>
    )
}
