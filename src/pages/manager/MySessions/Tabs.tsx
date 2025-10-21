

type TabsProps = {
    activeTab: string
    setActiveTab: (tab: string) => void
}

const TABS = [
    { key: "calendar", label: "Calendar" },
    { key: "session", label: "Upcoming" },
    { key: "reschedule", label: "Reschedule" },
    { key: "completed", label: "Completed" }
]

export function MobileTabs({ activeTab, setActiveTab }: TabsProps) {
    return (
        <div className="lg:hidden mb-4">
            <div className="flex overflow-x-auto pb-2">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 mr-4 transition-colors ${activeTab === tab.key
                            ? "border-primary text-[#141414]"
                            : "border-transparent text-[#8E8E93] hover:text-gray-700"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

export function DesktopTabs({ activeTab, setActiveTab }: TabsProps) {
    return (
        <div className="hidden lg:flex mb-6 gap-6 border-b border-gray-200">
            {TABS.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`pb-[16px] pt-0 pr-[24px] pl-[24px] text-[16px] font-inter font-medium capitalize transition-colors ${activeTab === tab.key
                        ? "border-b-2 border-primary text-[#141414]"
                        : "text-[#8E8E93] hover:text-gray-700"
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    )
}