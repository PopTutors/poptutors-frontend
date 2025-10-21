// app/(your-route)/my-sessions/components/SessionCard.tsx

import React, { useState, useRef, useEffect } from "react"
import { Card } from "../../../components/ui/card"
import { MoreVertical, Play, User, XCircle, MessageCircle, Trash2, Plus, CircleMinus } from "lucide-react"
import {
    ChatIcon,
    ClockIcon,
    Completed,
    DateIcon,
    MySessionDateIcon,
    MySessionStarIcon,
    SessionDateIcon,
    SessionMoneyIcon,
    SessionStudentIcon,
    SessionTeacherIcon
} from "../../../assets/managers"
import type { ScheduleItem, SessionHandlers } from "./types"
import { Divider } from "@mui/material"

type SessionCardProps = {
    item: ScheduleItem
    showActions?: boolean
    handlers: SessionHandlers
}

export function SessionCard({ item, showActions = true, handlers }: SessionCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [menuPosition, setMenuPosition] = useState < 'left' | 'right' > ('right')
    const menuRef = useRef < HTMLDivElement > (null)
    const buttonRef = useRef < HTMLButtonElement > (null)
    const isPendingReschedule = item.status === "pending-reschedule"

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false)
            }
        }

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isMenuOpen])

    const handleMenuToggle = () => {
        if (!isMenuOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            const spaceRight = window.innerWidth - rect.right
            const menuWidth = 180

            setMenuPosition(spaceRight < menuWidth ? 'left' : 'right')
        }
        setIsMenuOpen(!isMenuOpen)
    }

    const handleMenuItemClick = (action: () => void) => {
        action()
        setIsMenuOpen(false)
    }

    return (
        <Card className="p-0 overflow-hidden shadow-md">
            <div className="flex">
                <div className="w-1 bg-primary" />

                <div className="flex-1">
                    <div className=" mb-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-inter text-[20px] font-semibold text-[#141414] pr-2 p-4">{item.title}  <span className="font-epilogue font-medium text-[16px] text-[#8e8e93] border-l pl-2"> {item.jobId ?? "Jb-47584"}</span></h3>
                            {showActions && (
                                <div className="relative" ref={menuRef}>
                                    <button
                                        ref={buttonRef}
                                        onClick={handleMenuToggle}
                                        aria-label="open session menu"
                                        className="p-1 rounded hover:bg-gray-50 transition-colors"
                                    >
                                        <MoreVertical className="h-5 w-5 text-gray-600" />
                                    </button>

                                    {isMenuOpen && (
                                        <div className={`absolute top-8 z-50 w-44 border bg-white shadow-lg ${menuPosition === 'left' ? 'left-0' : 'right-0'
                                            }`}>
                                            <div className="py-1">
                                                <button
                                                    onClick={() => handleMenuItemClick(() => handlers.handleDelete(item))}
                                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    <XCircle className="h-4 w-4" /> Cancel
                                                </button>
                                                <div className="border-t border-gray-100 my-1"></div>

                                                <button
                                                    onClick={() => handleMenuItemClick(() => handlers.handleAssignTeacher(item))}
                                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    <Plus className="h-4 w-4" /> Assign teacher
                                                </button>                                            <div className="border-t border-gray-100 my-1"></div>

                                                <button
                                                    onClick={() => handleMenuItemClick(() => handlers.handleRemoveTeacher(item))}
                                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    <CircleMinus className="h-4 w-4" /> Remove teacher
                                                </button>
                                                {/* <button
                                                onClick={() => handleMenuItemClick(() => handlers.handleDelete(item))}
                                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                                            >
                                                <Trash2 className="h-4 w-4" /> Delete session
                                            </button>  */}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                    <div className="border-t border-gray-200"></div>

                    {/* Two-column content */}
                    <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4 p-4">
                        {/* Left column */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="h-[44px] w-[44px] rounded-full bg-slate-100 flex items-center justify-center text-sm text-slate-700 flex-shrink-0">
                                    <img src={SessionStudentIcon} alt="Student" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-[16px] font-inter font-medium text-[#141414] truncate">
                                        {item.student?.name ?? "Alice johnson"}
                                    </div>
                                    <div className="text-[14px] text-[#8E8E93]">
                                        Student id: {item.student?.id ?? "Stu-456"}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-[44px] w-[44px] flex items-center justify-center text-sm text-slate-700 flex-shrink-0">
                                    <img src={SessionDateIcon} alt="Date/Time" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-[16px] font-inter font-medium text-[#141414]">
                                        {item.startAt
                                            ? new Date(item.startAt).toLocaleDateString(undefined, {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })
                                            : "15 September 2024"}
                                    </div>
                                    <div className="text-[14px] text-[#8E8E93]">
                                        {item.startAt
                                            ? new Date(item.startAt).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            : item.time}
                                    </div>
                                </div>
                            </div>

                            {/* <div className="flex items-center gap-3">
                                <div className="h-[44px] w-[44px] rounded-full bg-slate-100 flex items-center justify-center text-sm text-slate-700 flex-shrink-0">
                                    <img src={ClockIcon} alt="Clock" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-[16px] font-inter font-medium text-[#141414]">
                                        {item.jobId ?? "Jb-47584"}
                                    </div>
                                    <div className="text-[14px] text-[#8E8E93]">Job id</div>
                                </div>
                            </div> */}
                            <div className="flex items-center gap-3">
                                <div className="h-[44px] w-[44px] rounded-full bg-rose-50 flex items-center justify-center text-sm text-rose-700 flex-shrink-0">
                                    <img src={Completed} alt="Status" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-[16px] font-inter font-medium text-[#141414]">
                                        {item.status
                                            ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
                                            : "Completed"}
                                    </div>
                                    <div className="text-[14px] text-[#8E8E93]">Status</div>
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
                                    <div className="text-[16px] font-inter font-medium text-[#141414] truncate">
                                        {typeof item.teacher === "string"
                                            ? item.teacher
                                            : item.teacher?.name ?? "Dr.doe doe"}
                                    </div>
                                    <div className="text-[14px] text-[#8E8E93]">
                                        Teacher id: {item.teacher?.id ?? "Tch-456"}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-[44px] w-[44px] rounded-full bg-amber-50 flex items-center justify-center text-sm text-amber-700 flex-shrink-0">
                                    <img src={SessionMoneyIcon} alt="Price" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-[16px] font-inter font-medium text-[#141414]">
                                        ${item.price ?? 250}
                                    </div>
                                    <div className="text-[14px] text-[#8E8E93]">$50/hr</div>
                                </div>
                            </div>


                        </div>
                    </div>
                    <div className="border-t border-gray-200 mx-2 px-4"></div>

                    {/* Bottom actions */}
                    {showActions ? (
                        <div className=" flex flex-col gap-2 justify-between sm:flex-row sm:items-center p-4">
                            <div className="flex gap-2 ">
                                <button
                                    title="Chat"
                                    className=" border py-[12px] px-[16px] text-gray-600 hover:bg-gray-50 "
                                >
                                    <img src={ChatIcon} alt="Chat" className="w-[24px] h-[24px]" />
                                </button>
                            </div>

                            {/* <div className="flex flex-wrap gap-2 justify-end w-full"> */}
                            <button
                                onClick={() => handlers.handleReschedule(item)}
                                className="w-[208px] py-[12px] px-[24px] border text-[16px] font-inter font-medium hover:bg-gray-50 flex items-center gap-2 align-center justify-center"
                            >
                                <img src={MySessionDateIcon} alt="Date" /> Reschedule
                            </button>
                            <button
                                onClick={() => handlers.handleJoinMeeting(item)}
                                className="w-[208px] py-[12px] px-[24px] border text-[16px] font-inter flex items-center gap-2 bg-primary font-medium text-white hover:bg-cyan-700 align-center justify-center"
                            >
                                <Plus className="h-4 w-4" /> Join Meeting
                            </button>
                            {/* </div> */}
                        </div>
                    ) : (
                        <div className=" flex flex-col gap-2 sm:flex-row sm:items-center justify-between p-4">
                            <div>
                                <p className="font-inter font-medium text-[16px] text-[#141414] flex gap-2 items-center"><img src={MySessionStarIcon} /> 4.8 Rating</p>
                            </div>


                            <div className="flex flex-wrap gap-2 justify-end">
                                <div className="flex gap-2">
                                    <button
                                        title="Chat"
                                        className="rounded border py-[12px] px-[16px] text-gray-600 hover:bg-gray-50"
                                    >
                                        <img src={ChatIcon} alt="Chat" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => handlers.handleJoinMeeting(item)}
                                    className="py-[12px] px-[24px] border text-[16px] font-inter flex items-center gap-2 bg-primary font-medium text-white hover:bg-cyan-700"
                                >
                                    <Play className="h-4 w-4" /> View Recording
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )
}