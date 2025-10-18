import React from "react";
import { User, FileText, CheckCircle } from "lucide-react";

interface MobileNavTabsProps {
    activeView: "negotiation" | "updates" | "teachers";
    onViewChange: (view: "negotiation" | "updates" | "teachers") => void;
}

const mobileNavTabs = [
    { key: "negotiation", label: "Negotiation", icon: User },
    { key: "updates", label: "Updates", icon: FileText },
    { key: "teachers", label: "Teachers", icon: CheckCircle },
] as const;

export default function MobileNavTabs({ activeView, onViewChange }: MobileNavTabsProps) {
    return (
        <div className="lg:hidden bg-white border-b border-gray-200">
            <div className="flex">
                {mobileNavTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => onViewChange(tab.key)}
                            className={`flex-1 py-3 px-2 text-center border-b-2 transition-colors ${activeView === tab.key
                                ? "border-[#019ACB] text-[#019ACB]"
                                : "border-transparent text-gray-500"
                                }`}
                        >
                            <Icon className="w-5 h-5 mx-auto mb-1" />
                            <span className="text-xs">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}


