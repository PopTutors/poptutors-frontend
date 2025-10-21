
import React, { useCallback, useEffect, useMemo, useState } from "react"
// import { Button } from "../../../components/ui/button"
// import { Plus } from "lucide-react"

import { useFetch } from "../../../api/UseFetch"
import { useGenericMutation } from "../../../api/useGenericMutation"

// Import sub-components
import { MobileHeader } from "./Headers"
import { DesktopHeader } from "./Headers"
import { StatsCards } from "./StatsCard"
import { MobileTabs } from "./Tabs"
import { DesktopTabs } from "./Tabs"
import { SessionsGrid } from "./Grids"
import { CompletedGrid } from "./Grids"
import { RescheduleGrid } from "./Grids"
import { CalendarView } from "./CalendarView"
import { ScheduleMeetingModal } from "./ScheduleMeetingModal"
import { mapSessionToScheduleItem } from "../../../utils/mappers"
import type { ScheduleItem, Category } from "./types"

const API_PREFIX = (typeof window !== "undefined" && (window as any).__API_PREFIX) || "/mySessions"
const STORAGE_KEY = "my_session_schedules_v1"
const defaultItems: ScheduleItem[] = []

export default function MySessionPage() {
    const [activeTab, setActiveTab] = useState("calendar")
    const [viewMode, setViewMode] = useState < "daily" | "weekly" | "monthly" > ("daily")
    const [monthOffset, setMonthOffset] = useState(0)
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

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

    // Success callbacks
    const handleStatsSuccess = useCallback((data: any) => {
        if (!data) return
        const payload = Array.isArray(data) ? data[0] : data
        setStats({
            active: payload?.active ?? payload,
            pendingReschedules: payload?.pendingReschedules ?? 0,
            issues: payload?.issues ?? 0,
            availableTeachers: payload?.availableTeachers ?? 0,
        })
    }, [])

    const handleSessionsSuccess = useCallback((data: any) => {
        if (!data) return
        const arr = Array.isArray(data) ? data : (data?.data ?? [])
        if (Array.isArray(arr)) {
            const mapped = arr.map(mapSessionToScheduleItem)
            setScheduleItems(mapped)
        }
    }, [])

    const handleCompletedSuccess = useCallback((data: any) => {
        const arr = Array.isArray(data) ? data : (data?.data ?? [])
        if (Array.isArray(arr)) setCompletedItems(arr.map(mapSessionToScheduleItem))
    }, [])

    const handleRescheduleSuccess = useCallback((data: any) => {
        const arr = Array.isArray(data) ? data : (data?.data ?? [])
        if (Array.isArray(arr)) setRescheduleItems(arr.map(mapSessionToScheduleItem))
    }, [])

    const handleError = useCallback((err: any) => {
        console.error("Fetch error:", err?.message)
    }, [])

    // Fetch data
    useFetch(["sessions", "stats"], `${API_PREFIX}/stats`, true, {
        onSuccessCallback: handleStatsSuccess,
        onErrorCallback: handleError,
    })

    useFetch(["sessions", monthOffset], `${API_PREFIX}?monthOffset=${monthOffset}`, true, {
        onSuccessCallback: handleSessionsSuccess,
        onErrorCallback: handleError,
    })

    useFetch(["sessions", "completed", monthOffset], `${API_PREFIX}?status=completed&monthOffset=${monthOffset}`, true, {
        onSuccessCallback: handleCompletedSuccess,
        onErrorCallback: handleError,
    })

    useFetch(["sessions", "pending-reschedule", monthOffset], `${API_PREFIX}?status=pending-reschedule&monthOffset=${monthOffset}`, true, {
        onSuccessCallback: handleRescheduleSuccess,
        onErrorCallback: handleError,
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

    const monthLabel = useMemo(() => {
        const d = new Date()
        d.setMonth(d.getMonth() + monthOffset)
        return d.toLocaleString(undefined, { month: "long", year: "numeric" })
    }, [monthOffset])

    // Mutations
    const patchMutation = useGenericMutation()
    const createMutation = useGenericMutation()
    const deleteMutation = useGenericMutation()

    const createBusy = (createMutation as any)?.isLoading ?? false
    const patchBusy = (patchMutation as any)?.isLoading ?? false

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

    const createSchedule = async () => {
        if (!form.title || form.startHour >= form.endHour) {
            alert("Please enter title and valid start/end time")
            return
        }

        const now = new Date()
        const year = now.getFullYear()
        const month = now.getMonth() + monthOffset
        const startAt = new Date(year, month, form.day, form.startHour, 0, 0).toISOString()
        const endAt = new Date(year, month, form.day, form.endHour, 0, 0).toISOString()

        const payload = {
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

    // Session handlers object
    const sessionHandlers = {
        handleAssignTeacher: (session: ScheduleItem) => {
            const teacherIdOrName = prompt("Enter teacher ID or name to assign:")
            if (!teacherIdOrName) return

            patchMutation.mutate({
                endpoint: `${API_PREFIX}/${session.id}`,
                data: { teacher: teacherIdOrName },
                method: "PATCH",
                successMessage: "Teacher assigned",
                errorMessage: "Failed to assign teacher",
                invalidateKeys: ["sessions", "sessions-stats"],
                onSuccessCallback: (resp: any) => {
                    const updated = Array.isArray(resp) ? resp[0] : (resp?.data ?? resp)
                    if (updated) {
                        const mapped = mapSessionToScheduleItem(updated)
                        setScheduleItems((s) => s.map((it) => (it.id === mapped.id ? mapped : it)))
                        setCompletedItems((s) => s.map((it) => (it.id === mapped.id ? mapped : it)))
                        setRescheduleItems((s) => s.map((it) => (it.id === mapped.id ? mapped : it)))
                    }
                },
            })
        },
        handleRemoveTeacher: (session: ScheduleItem) => {
            if (!confirm("Remove teacher from this session?")) return
            patchMutation.mutate({
                endpoint: `${API_PREFIX}/${session.id}`,
                data: { teacher: null },
                method: "PATCH",
                successMessage: "Teacher removed",
                errorMessage: "Failed to remove teacher",
                invalidateKeys: ["sessions", "sessions-stats"],
                onSuccessCallback: (resp: any) => {
                    const updated = Array.isArray(resp) ? resp[0] : (resp?.data ?? resp)
                    if (updated) {
                        const mapped = mapSessionToScheduleItem(updated)
                        setScheduleItems((s) => s.map((it) => (it.id === mapped.id ? mapped : it)))
                        setCompletedItems((s) => s.map((it) => (it.id === mapped.id ? mapped : it)))
                        setRescheduleItems((s) => s.map((it) => (it.id === mapped.id ? mapped : it)))
                    }
                },
            })
        },
        handleReschedule: (session: ScheduleItem) => {
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
                onSuccessCallback: (resp: any) => {
                    const updated = Array.isArray(resp) ? resp[0] : (resp?.data ?? resp)
                    if (updated) {
                        const mapped = mapSessionToScheduleItem(updated)
                        setScheduleItems((s) => s.map((it) => (it.id === mapped.id ? mapped : it)))
                        setRescheduleItems((s) => s.filter((it) => it.id !== mapped.id))
                    }
                },
            })
        },
        handleViewRecording: (session: ScheduleItem) => {
            if (session.recordingUrl) window.open(session.recordingUrl, "_blank")
            else alert("Recording not available")
        },
        handleJoinMeeting: (session: ScheduleItem) => {
            if (session.joinUrl) window.open(session.joinUrl, "_blank")
            else alert("Join URL not available")
        },
        handleDelete: (session: ScheduleItem) => {
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
        },
        approveReschedule: (session: ScheduleItem) => {
            if (!confirm("Approve this reschedule and make it active?")) return
            patchMutation.mutate({
                endpoint: `${API_PREFIX}/${session.id}`,
                data: { status: "active" },
                method: "PATCH",
                successMessage: "Reschedule approved",
                errorMessage: "Failed to approve reschedule",
                invalidateKeys: ["sessions", "sessions-stats"],
                onSuccessCallback: (resp: any) => {
                    const updated = Array.isArray(resp) ? resp[0] : (resp?.data ?? resp)
                    if (updated) {
                        const mapped = mapSessionToScheduleItem(updated)
                        setScheduleItems((s) => [mapped, ...s])
                        setRescheduleItems((s) => s.filter((it) => it.id !== mapped.id))
                    }
                },
            })
        },
        declineReschedule: (session: ScheduleItem) => {
            if (!confirm("Decline this reschedule request?")) return
            patchMutation.mutate({
                endpoint: `${API_PREFIX}/${session.id}`,
                data: { status: "scheduled" },
                method: "PATCH",
                successMessage: "Reschedule declined",
                errorMessage: "Failed to decline reschedule",
                invalidateKeys: ["sessions", "sessions-stats"],
                onSuccessCallback: (resp: any) => {
                    const updated = Array.isArray(resp) ? resp[0] : (resp?.data ?? resp)
                    if (updated) {
                        const mapped = mapSessionToScheduleItem(updated)
                        setRescheduleItems((s) => s.filter((it) => it.id !== mapped.id))
                        setScheduleItems((s) => s.map((it) => (it.id === mapped.id ? mapped : it)))
                    }
                },
            })
        },
        toggleExpand: (id: string) => {
            setScheduleItems((s) => s.map((it) => (it.id === id ? { ...it, expanded: !it.expanded } : it)))
        },
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <MobileHeader onMenuClick={() => setIsMobileSidebarOpen(true)} />

            <div className="py-4 lg:py-8 px-4 lg:px-6">
                <div className="mx-auto">
                    <DesktopHeader />

                    <StatsCards stats={stats} />

                    <MobileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                    <DesktopTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                    {activeTab === "session" && (
                        <SessionsGrid
                            items={filteredScheduleItems}
                            handlers={sessionHandlers}
                        />
                    )}

                    {activeTab === "completed" && (
                        <CompletedGrid items={filteredCompletedItems} />
                    )}

                    {activeTab === "reschedule" && (
                        <RescheduleGrid
                            items={rescheduleItems}
                            onApprove={sessionHandlers.approveReschedule}
                            onDecline={sessionHandlers.declineReschedule}
                            onReschedule={sessionHandlers.handleReschedule}
                            onChat={(s) => alert("Open chat for " + (s.title ?? s.id))}
                        />
                    )}

                    {activeTab === "calendar" && (
                        <CalendarView
                            viewMode={viewMode}
                            setViewMode={setViewMode}
                            monthOffset={monthOffset}
                            setMonthOffset={setMonthOffset}
                            monthLabel={monthLabel}
                            filteredItems={filteredScheduleItems}
                            onAddClick={openAddModal}
                            handlers={sessionHandlers}
                        />
                    )}
                </div>
            </div>

            <ScheduleMeetingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                form={form}
                setForm={setForm}
                onSubmit={createSchedule}
                isLoading={createBusy || patchBusy}
            />
        </div>
    )
}