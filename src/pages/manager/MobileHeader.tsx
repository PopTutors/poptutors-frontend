import React from "react";
import { Menu } from "lucide-react";

interface MobileHeaderProps {
    onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
    return (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold">Updates</h1>
                <button
                    onClick={onMenuClick}
                    className="p-2 hover:bg-gray-100 rounded-md"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}