// app/(your-route)/my-sessions/components/StatsCards.tsx

import { Card } from "../../../components/ui/card"
import { Calendar } from "lucide-react"
import { TimeIcon, LeartIcon, ProfileIcon } from "../../../assets/managers"
import type { Stats } from "./types"

export function StatsCards({ stats }: { stats: Stats }) {
    return (
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            <Card className="border-none bg-[#FFCED4] p-4 lg:p-6 shadow-sm">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="text-2xl lg:text-[32px] font-bold text-[#141414]">
                            {stats?.active ?? 0}
                        </div>
                        <div className="mt-1 text-sm lg:text-[16px] text-[#141414]">
                            Active session
                        </div>
                    </div>
                    <div className="p-1 lg:p-2">
                        <Calendar className="h-4 w-4 lg:h-5 lg:w-5 text-gray-700" />
                    </div>
                </div>
            </Card>

            <Card className="border-none bg-[#BCEFFF] p-4 lg:p-6 shadow-sm">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="text-2xl lg:text-[32px] font-bold text-[#141414]">
                            {stats?.pendingReschedules ?? 0}
                        </div>
                        <div className="mt-1 text-sm lg:text-[16px] text-[#141414]">
                            Pending Reschedules
                        </div>
                    </div>
                    <div className="p-1 lg:p-2">
                        <img src={TimeIcon} alt="Time Icon" className="w-4 h-4 lg:w-5 lg:h-5" />
                    </div>
                </div>
            </Card>

            <Card className="border-none bg-[#C4CAFF] p-4 lg:p-6 shadow-sm">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="text-2xl lg:text-[32px] font-bold text-[#141414]">
                            {stats?.issues ?? 0}
                        </div>
                        <div className="mt-1 text-sm lg:text-[16px] text-[#141414]">
                            Teacher Issues
                        </div>
                    </div>
                    <div className="p-1 lg:p-2">
                        <img src={LeartIcon} alt="Leart Icon" className="w-4 h-4 lg:w-5 lg:h-5" />
                    </div>
                </div>
            </Card>

            <Card className="border-none bg-[#FFBDE8] p-4 lg:p-6 shadow-sm">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="text-2xl lg:text-[32px] font-bold text-[#141414]">
                            {stats?.availableTeachers ?? 0}
                        </div>
                        <div className="mt-1 text-sm lg:text-[16px] text-[#141414]">
                            Available Teachers
                        </div>
                    </div>
                    <div className="p-1 lg:p-2">
                        <img src={ProfileIcon} alt="Profile Icon" className="w-4 h-4 lg:w-5 lg:h-5" />
                    </div>
                </div>
            </Card>
        </div>
    )
}