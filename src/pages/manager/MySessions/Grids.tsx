// app/(your-route)/my-sessions/components/Grids.tsx

import { SessionCard } from "./SessionCard"
import { RescheduleCard } from "./RescheduleCard"
import type { ScheduleItem, SessionHandlers } from "./types"

type SessionsGridProps = {
    items: ScheduleItem[]
    handlers: SessionHandlers
}

export function SessionsGrid({ items, handlers }: SessionsGridProps) {
    if (items.length === 0) {
        return (
            <div className="col-span-full py-20 text-center text-gray-500">
                No sessions found
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {items.map((item) => (
                <SessionCard item={item} key={item.id} handlers={handlers} />
            ))}
        </div>
    )
}

type CompletedGridProps = {
    items: ScheduleItem[]
}

export function CompletedGrid({ items }: CompletedGridProps) {
    if (items.length === 0) {
        return (
            <div className="col-span-full py-20 text-center text-gray-500">
                No completed sessions
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {items.map((item) => (
                <SessionCard
                    item={item}
                    key={item.id}
                    showActions={false}
                    handlers={{} as SessionHandlers}
                />
            ))}
        </div>
    )
}

type RescheduleGridProps = {
    items: ScheduleItem[]
    onApprove: (item: ScheduleItem) => void
    onDecline: (item: ScheduleItem) => void
    onReschedule: (item: ScheduleItem) => void
    onChat: (item: ScheduleItem) => void
}

export function RescheduleGrid({
    items,
    onApprove,
    onDecline,
    onReschedule,
    onChat
}: RescheduleGridProps) {
    if (items.length === 0) {
        return (
            <div className="py-12 text-center text-gray-500">
                No pending reschedules or conflicts
            </div>
        )
    }

    return (
        <div className="grid xs:grid-cols-1 grid-cols-2 gap-4">
            {items.map((item) => (
                <RescheduleCard
                    key={item.id}
                    item={item}
                    onApprove={onApprove}
                    onDecline={onDecline}
                    onReschedule={onReschedule}
                    onChat={onChat}
                />
            ))}
        </div>
    )
}