export type Category = "interview" | "internal" | "team" | "task" | "reminder"

export type ScheduleItem = {
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

export type Stats = {
    active: number
    pendingReschedules: number
    issues: number
    availableTeachers: number
}

export type Filters = {
    interviewSchedule: boolean
    internalMeeting: boolean
    teamSchedule: boolean
    myTask: boolean
    reminders: boolean
}

export type SessionHandlers = {
    handleAssignTeacher: (session: ScheduleItem) => void
    handleRemoveTeacher: (session: ScheduleItem) => void
    handleReschedule: (session: ScheduleItem) => void
    handleViewRecording: (session: ScheduleItem) => void
    handleJoinMeeting: (session: ScheduleItem) => void
    handleDelete: (session: ScheduleItem) => void
    approveReschedule: (session: ScheduleItem) => void
    declineReschedule: (session: ScheduleItem) => void
    toggleExpand: (id: string) => void
}