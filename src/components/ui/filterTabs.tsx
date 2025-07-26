"use client";
import React, { useState } from "react";

interface FilterTabsProps {
  tabs: string[];
  defaultTab?: string;
  onTabChange?: (tab: string) => void;
}

const tabStyles: Record<string, { active: string; inactive: string }> = {
  All: {
    active: "bg-[#0098DB] text-white",
    inactive: "bg-[#E6F6FF] text-[#0098DB]",
  },
  Requested: {
    active: "bg-[#F5C767] text-white",
    inactive: "bg-[#e9d4a2] text-[#BF8B13]",
  },
  "In Progress": {
    active: "bg-[#6FB8E0] text-white",
    inactive: "bg-[#AED8E6] text-[#197B9B]",
  },
  Completed: {
    active: "bg-[#70C785] text-white",
    inactive: "bg-[#AAD5AF] text-[#229126]",
  },
  Rejected: {
    active: "bg-[#F47D7D] text-white",
    inactive: "bg-[#F9B2B3] text-[#D22525]",
  },
};

const FilterTabs: React.FC<FilterTabsProps> = ({
  tabs,
  defaultTab,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        const style = tabStyles[tab] || {
          active: "bg-primary text-white shadow-md",
          inactive: "bg-gray-200 text-gray-600",
        };

        return (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`px-4 py-2 w-[126px] rounded-lg font-poppinsregular  text-[16px] transition-all 
              ${isActive ? style.active : style.inactive}`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};

export default FilterTabs;
