import React from "react"
import { Button } from "../../../components/ui/button"
import { Avatar } from "../../../components/ui/avatar"
import { Plus, ChevronLeft, ChevronRight, ChevronDown, Trash2, Play, MessageCircle } from "lucide-react"

import type { ScheduleItem, Category } from "./types"

type ScheduleMeetingModalProps = {
    isOpen: boolean
    onClose: () => void
    form: {
        title: string
        avatar: string
        color: string
        category: Category
        startHour: number
        endHour: number
        day: number
        notes: string
    }
    setForm: (f: any) => void
    onSubmit: () => void
    isLoading?: boolean
}

export function ScheduleMeetingModal({ isOpen, onClose, form, setForm, onSubmit, isLoading = false }: ScheduleMeetingModalProps) {
    if (!isOpen) return null

    const formatHour = (hour: number) => {
        if (hour === 12) return "12PM"
        if (hour > 12) return `${hour - 12}PM`
        return `${hour}AM`
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-xl rounded-lg bg-white p-4 lg:p-6 shadow-lg max-h-[90vh] overflow-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Schedule Meeting</h3>
                    <button onClick={onClose} className="text-gray-500 p-2">
                        ✕
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

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start hour</label>
                            <select
                                value={form.startHour}
                                onChange={(e) => setForm({ ...form, startHour: Number(e.target.value) })}
                                className="w-full rounded border border-gray-300 p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                {Array.from({ length: 15 }, (_, i) => i + 6).map((h) => (
                                    <option key={h} value={h}>
                                        {formatHour(h)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End hour</label>
                            <select
                                value={form.endHour}
                                onChange={(e) => setForm({ ...form, endHour: Number(e.target.value) })}
                                className="w-full rounded border border-gray-300 p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                {Array.from({ length: 15 }, (_, i) => i + 6).map((h) => (
                                    <option key={h} value={h}>
                                        {formatHour(h)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Day (date)</label>
                            <input
                                type="number"
                                min={1}
                                max={31}
                                value={form.day}
                                onChange={(e) => setForm({ ...form, day: Number(e.target.value) })}
                                className="w-full rounded border border-gray-300 p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                                className="w-full rounded border border-gray-300 p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="interview">Interview</option>
                                <option value="internal">Internal</option>
                                <option value="team">Team</option>
                                <option value="task">Task</option>
                                <option value="reminder">Reminder</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Avatar initials</label>
                        <input
                            value={form.avatar}
                            onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                            className="w-full rounded border border-gray-300 p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Optional: e.g. AB"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            rows={3}
                            className="w-full rounded border border-gray-300 p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-4 border-t">
                        <Button onClick={onClose} className="w-full sm:w-auto px-[24px] py-[12px] bg-gray-100 text-gray-700 hover:bg-gray-200">
                            Cancel
                        </Button>
                        <Button onClick={onSubmit} className="w-full sm:w-auto px-[24px] py-[12px] bg-primary text-white hover:bg-cyan-700" disabled={isLoading}>
                            {isLoading ? "Creating…" : "Create"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}



