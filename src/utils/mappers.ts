// app/(your-route)/my-sessions/utils/mappers.ts

import type { ScheduleItem } from "../pages/manager/MySessions/types"

export const mapSessionToScheduleItem = (s: any): ScheduleItem => {
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

export const formatHour = (hour: number): string => {
    if (hour === 12) return "12PM"
    if (hour > 12) return `${hour - 12}PM`
    return `${hour}AM`
}

export const formatDateTime = (iso?: string): string => {
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