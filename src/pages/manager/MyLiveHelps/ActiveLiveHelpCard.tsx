// ActiveLiveHelpCard — matches SessionCard design/structure
import React, { useEffect, useMemo, useState } from "react";
import { Card } from "../../../components/ui/card";
import { MoreVertical, Play, MessageCircle, Calendar, CalendarClock, Star } from "lucide-react";
import {
    BudgetIcon,
    ChatIcon,
    ClockIcon,
    Completed,
    FileIcon,
    HiringFile,
    HiringFilePrimary,
    ReScheduleCurrentIcon,
    ReScheduleStudentIcon,
    SessionDateIcon,
    SessionMoneyIcon,
    SessionStudentIcon,
    SessionTeacherIcon,
} from "../../../assets/managers";
import type { ScheduleItem, SessionHandlers } from "./types";
import { UsDollarCircled } from "../../../assets";
import { StarFilledIcon } from "@radix-ui/react-icons";

type ActiveLiveHelpCardProps = {
    item: ScheduleItem;
    showActions?: boolean;
    handlers: SessionHandlers;
    activeTab?: string;
};

function padTwo(n: number) {
    return String(n).padStart(2, "0");
}

function secondsToHms(total: number) {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${padTwo(h)}h:${padTwo(m)}m:${padTwo(s)}s`;
}

export default function ActiveLiveHelpCard({ item, showActions = true, handlers, activeTab = "active" }: ActiveLiveHelpCardProps) {
    // compute end timestamp: startAt or scheduledAt + duration (liveHelpHours or item.duration)
    const startIso = item.startAt ?? item.scheduledAt ?? null;
    const durationHours = (item.liveHelpHours ?? (item.durationHours as number) ?? 1);
    const endTs = useMemo(() => {
        if (!startIso) return null;
        const d = new Date(startIso);
        d.setHours(d.getHours() + durationHours);
        return d.getTime();
    }, [startIso, durationHours]);

    const [remaining, setRemaining] = useState < number > (() => (endTs ? Math.max(0, Math.floor((endTs - Date.now()) / 1000)) : 0));

    useEffect(() => {
        if (!endTs) return;
        const id = setInterval(() => setRemaining(Math.max(0, Math.floor((endTs - Date.now()) / 1000))), 1000);
        return () => clearInterval(id);
    }, [endTs]);

    const studentName = item.student?.name ?? "Student";
    const studentId = item.student?.id ?? "—";
    const teacherName = typeof item.teacher === "string" ? item.teacher : item.teacher?.name ?? "—";
    const displayDate = item.startAt
        ? new Date(item.startAt).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })
        : item.scheduledAt
            ? new Date(item.scheduledAt).toLocaleDateString()
            : "—";
    const displayTime = item.startAt
        ? new Date(item.startAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : item.time ?? "—";

    return (
        <Card className="p-0 overflow-hidden shadow-md">
            <div className="flex">
                <div className="w-1 bg-primary" />

                <div className="flex-1">
                    {/* Header */}
                    <div className="mb-3 flex items-center justify-between">
                        <div className="min-w-0  p-4">
                            <h3 className="font-inter text-[20px] font-semibold text-[#141414] truncate">
                                {item.title}
                                <span className="font-epilogue font-medium text-[16px] text-[#8e8e93] border-l pl-2 ml-3">{item.jobId ?? "Jb-47584"}</span>
                            </h3>
                        </div>

                        {/* Countdown + Start */}
                        {activeTab === "completed" ? (<div>
                            <p className="font-inter font-medium text-[16px] text-[#141414] flex gap-2 items-center">
                                <Star />
                                4.8
                            </p>
                        </div>) : (


                            <div className="flex flex-col items-end gap-3">
                                <div className=" border border-l-[#ff383c] border-t-[#ff383c] border-b-[#ff383c] border-r-0 border-dashed bg-[#fef4f4] rounded-tl-md rounded-bl-md px-3 py-2 ">
                                    <div className="text-[#ff3e3e] font-black font-inter text-[16px]">{secondsToHms(remaining)}</div>
                                    <div className="text-[10px] font-epilogue text-[#ff383c]">Exam Ending In</div>
                                </div>
                            </div>
                        )}

                    </div>

                    <div className="border-t border-gray-200" />

                    {/* Two-column content */}
                    <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4 p-4">
                        {/* Left column */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="h-[44px] w-[44px] rounded-full bg-slate-100 flex items-center justify-center text-sm text-slate-700 flex-shrink-0">
                                    <img src={SessionStudentIcon} alt="Student" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-[16px] font-inter font-medium text-[#141414] truncate">{studentName}</div>
                                    <div className="text-[14px] text-[#8E8E93]">Student id: {studentId}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-[44px] w-[44px] flex items-center justify-center text-sm text-slate-700 flex-shrink-0">
                                    <img src={ClockIcon} alt="Duration" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-[16px] font-inter font-medium text-[#141414]">{displayDate}</div>
                                    <div className="text-[14px] text-[#8E8E93]">{displayTime}</div>
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
                                    <div className="text-[16px] font-inter font-medium text-[#141414] truncate">{teacherName}</div>
                                    <div className="text-[14px] text-[#8E8E93]">Teacher id: {item.teacher?.id ?? "Tch-456"}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-[44px] w-[44px] rounded-full bg-rose-50 flex items-center justify-center text-sm text-rose-700 flex-shrink-0">
                                    <img src={BudgetIcon} alt="Status" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-[16px] font-inter font-medium text-[#141414]">
                                        {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "In progress"}
                                    </div>
                                    <div className="text-[14px] text-[#8E8E93]">Status</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 mx-2 px-4" />

                    {/* Bottom actions */}
                    {
                        showActions ? (
                            <div className="flex flex-col gap-2 justify-between sm:flex-row sm:items-center p-4">
                                <div className="flex gap-2 items-center">
                                    <button
                                        title="Chat"
                                        onClick={() => handlers.handleOpenChat?.(item)}
                                        className="border py-[12px] px-[16px] text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <img src={ChatIcon} alt="Chat" className="w-[20px] h-[20px]" />
                                    </button>
                                    <span className="text-[#8E8E93] text-[14px] font-inter font-medium">Unread</span>
                                    <p style={{ background: "red" }} className="w-[19px] h-[18px] text-[14px] font-inter font-medium text-center rounded-lg text-white flex items-center justify-center"> {item.metadata?.messagesCount ?? item.messagesCount ?? 0}</p>
                                </div>

                                {activeTab === "list" ? (
                                    // 🔹 When in "list" tab → show only Reschedule button
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => handlers.handleReschedule?.(item)}
                                            className="py-[12px] px-[24px] border text-[16px] font-inter font-medium bg-primary text-white flex items-center gap-2 justify-center font-inter font-medium text-[16px]"
                                        >
                                            <CalendarClock className="w-[18px] h-[18px]" />
                                            Reschedule
                                        </button>
                                    </div>
                                ) : (
                                    // 🔹 Default view → Teacher and Student buttons
                                    <div className="flex gap-8 justify-center items-center">
                                        {/* Teacher Button */}
                                        <button
                                            onClick={() => handlers.handleTeacher?.(item)}
                                            className="flex items-center gap-2 text-[18px] font-medium text-[#4b4b4b] hover:text-[#00a3d7] transition-colors"
                                        >
                                            <img
                                                src={HiringFilePrimary}
                                                alt="Teacher"
                                                className="h-6 w-6 text-[#00a3d7]"
                                            />
                                            <span className="border-b-2 border-[#4b4b4b] hover:border-[#00a3d7]">
                                                {activeTab === "completed" ? "Question" : "Teacher"}
                                            </span>
                                        </button>

                                        {/* Student Button */}
                                        <button
                                            onClick={() => handlers.handleStudent?.(item)}
                                            className="flex items-center gap-2 text-[18px] font-medium text-[#4b4b4b] hover:text-[#00a3d7] transition-colors"
                                        >
                                            <img
                                                src={HiringFilePrimary}
                                                alt="Student"
                                                className="h-6 w-6 text-[#00a3d7]"
                                            />
                                            <span className="border-b-2 border-[#4b4b4b] hover:border-[#00a3d7]">
                                                {activeTab === "completed" ? "Answer" : "Student"}
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between p-4">
                                <div>
                                    <p className="font-inter font-medium text-[16px] text-[#141414] flex gap-2 items-center">
                                        <img src={SessionDateIcon} alt="star" />
                                        4.8 Rating
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2 justify-end">
                                    <div className="flex gap-2">
                                        <button title="Chat" className="rounded border py-[12px] px-[16px] text-gray-600 hover:bg-gray-50" onClick={() => handlers.handleOpenChat?.(item)}>
                                            <img src={MessageCircle as any} alt="Chat" />
                                        </button>
                                    </div>

                                    <button onClick={() => handlers.handleViewRecording?.(item)} className="py-[12px] px-[24px] border text-[16px] font-inter flex items-center gap-2 bg-primary font-medium text-white hover:bg-cyan-700">
                                        <Play className="h-4 w-4" /> View Recording
                                    </button>
                                </div>
                            </div>
                        )
                    }
                </div >
            </div >
        </Card >
    );
}
