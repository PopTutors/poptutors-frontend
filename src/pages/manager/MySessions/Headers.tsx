// app/(your-route)/my-sessions/components/Headers.tsx

import { Menu } from "lucide-react"

export function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
    return (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold">My Sessions</h1>
                <button
                    onClick={onMenuClick}
                    className="p-2 hover:bg-gray-100 rounded-md"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}

export function DesktopHeader() {
    return (
        <div className="hidden lg:block mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[24px] font-poppins text-[#141414] font-bold">
                        Good morning, Maria
                    </h1>
                    <p className="text-[16px] text-[rgba(20, 20, 20, 0.6)] font-inter">
                        Here is your job listings statistic report.
                    </p>
                </div>
            </div>
        </div>
    )
}