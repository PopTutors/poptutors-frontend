
import React, { useState } from "react";
import SidebarTab from "../../components/ui/sidebarTab";
import {
    AssignmentIcon,
    WalletIcon,
    DashboardIcon,
    HelpIcon,
    LiveQuestionsIcon,
    SessionsIcon,
    DashboardIconActive,
    LiveQuestionsIconActive,
    AssignmentIconActive,
    HelpIconActive,
    WalletIconActive,
    SessionsIconActive,
} from "../../assets/sidebar-icon";
import { paths } from "../../config/path";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
    const location = useLocation(); 
    const [activeTab, setActiveTab] = useState("Dashboard");
    const sidebarTabs = [
        { label: "Dashboard", icon: DashboardIcon, iconActive: DashboardIconActive ,path: paths.student.home.getHref()},
        { label: "Assignment", icon: AssignmentIcon, iconActive: AssignmentIconActive ,path:  paths.student.assignment.getHref()},
        { label: "Live Question", icon: LiveQuestionsIcon, iconActive: LiveQuestionsIconActive ,path: "/live-question"},
        {
            label: "Sessions",
            icon: SessionsIcon,
            iconActive: SessionsIconActive,
            path: "/sessions"
        },
        { label: "Wallet", icon: WalletIcon, iconActive: WalletIconActive ,path: "/wallet"},
        { label: "Help & Support", icon: HelpIcon, iconActive: HelpIconActive ,path: "/help-support"},
    ];
    return (
        <aside className="w-[271px] bg-white overflow-y-auto border-r shadow-md flex-none">
            {/* Menu Items */}
            <nav className="mt-6 px-4 space-y-2">
                 {sidebarTabs.map((tab) => {
                    const isActive = location.pathname === tab.path;

                    return (
                        <SidebarTab
                            key={tab.label}
                            icon={tab.icon}
                            iconActive={tab.iconActive}
                            label={tab.label}
                            active={isActive}
                            redirectPath={tab.path}
                        />
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;

