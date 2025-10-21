import React from "react"
import { User, FileText, MessageCircle, XCircle, CheckCircle, CircleCheck } from "lucide-react"
import { formatDateTime } from "../../../utils/mappers"
import type { ScheduleItem } from "./types"
import { ChatIcon, ReScheduleCurrentIcon, ReScheduleStudentIcon, SessionStudentIcon } from "../../../assets/managers"

type RescheduleCardProps = {
    item: ScheduleItem
    onApprove: (item: ScheduleItem) => void
    onDecline: (item: ScheduleItem) => void
    onReschedule: (item: ScheduleItem) => void
    onChat: (item: ScheduleItem) => void
}

export function RescheduleCard({
    item,
    onApprove,
    onDecline,
    onReschedule,
    onChat,
}: RescheduleCardProps) {
    const requested = (item as any).requestedStart ?? item.endAt

    return (
        <div className="bg-white shadow-sm border border-transparent overflow-hidden">
            {/* Left blue accent + inner padding */}
            <div className="flex">
                <div className="w-1 bg-primary" />
                <div className="flex-1 p-5">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4">
                        <div className="flex items-baseline gap-3">
                            <h3 className="text-lg font-semibold text-slate-900">
                                {item.title ?? "Computer science"}
                            </h3>
                            <span className="text-sm text-slate-500">|</span>
                            <div className="text-sm text-slate-500">
                                ID: <span className="font-medium text-slate-700">JB-{item.jobId ?? "2024-001"}</span>
                            </div>
                        </div>

                        <div className="text-sm text-slate-400 sm:self-start">
                            {item.startAt ? new Date(item.startAt).toLocaleDateString() : "—"}
                        </div>
                    </div>

                    {/* Time slot rows */}
                    <div className="space-y-3 mb-5">
                        {/* Row 1 - gray */}
                        <div className="flex items-center gap-4 bg-[#f6f6f6] p-3">
                            <div className="flex-shrink-0 h-10 w-10 bg-[#eaeaea] flex items-center justify-center">
                                <img src={ReScheduleStudentIcon} />
                            </div>

                            <div className="flex-1 flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-slate-900">{formatDateTime(item.startAt)}</div>
                                    <div className="text-xs text-slate-400">Current</div>
                                </div>

                                {/* Arrow (visible on sm+) */}
                                <div className="hidden sm:flex items-center justify-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13 6L19 12L13 18M18.5 12L5 12" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>

                                <div className="flex-1 ml-6">
                                    <div className="text-sm font-medium text-slate-900">{formatDateTime(requested)}</div>
                                    <div className="text-xs text-slate-400">Requested</div>
                                </div>
                            </div>
                        </div>

                        {/* Row 2 - sky tint */}
                        <div className="flex items-center gap-4 bg-[#f6fbfd] p-3">
                            <div className="flex-shrink-0 h-10 w-10 bg-[#e0f0f7] flex items-center justify-center">
                                <img src={ReScheduleCurrentIcon} />
                            </div>

                            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-slate-900">{formatDateTime(item.startAt)}</div>
                                    <div className="text-xs text-slate-400">Current</div>
                                </div>

                                <div className="hidden sm:flex items-center justify-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13 6L19 12L13 18M18.5 12L5 12" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>

                                </div>

                                <div className="flex-1  ml-6">
                                    <div className="text-sm font-medium text-slate-900">{formatDateTime(requested)}</div>
                                    <div className="text-xs text-slate-400">Requested</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reason + Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {(item as any).reason ? (
                            <div className="text-sm text-rose-600">
                                <span className="font-medium">Reason: </span>
                                <span className="text-rose-600">{(item as any).reason}</span>
                            </div>
                        ) : (
                            <div />
                        )}

                        <div className="flex items-center gap-3 justify-end">
                            {/* Chat - neutral white circle */}
                            <button
                                onClick={() => onChat(item)}
                                title="Chat"
                                className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white p-3 shadow-sm hover:bg-gray-50"
                            >
                                <img src={ChatIcon} className="w-[18px] h-[18px]" />
                            </button>

                            {/* Decline - pink circular background */}
                            <button
                                onClick={() => onDecline(item)}
                                title="Decline"
                                className="inline-flex items-center justify-center rounded-full bg-[rgb(255,236,236)] p-3 hover:bg-rose-100 shadow-sm"
                            >
                                <XCircle className="h-[18px] w-[18px]  text-[#141414]" />
                            </button>

                            {/* Approve - green circular background */}
                            <button
                                onClick={() => onApprove(item)}
                                title="Approve"
                                className="inline-flex items-center justify-center rounded-full bg-emerald-50 p-3 hover:bg-emerald-100 shadow-sm"
                            >
                                <CircleCheck className="h-[18px] w-[18px] text-[#141414]" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
