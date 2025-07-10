"use client";
import React, { useState } from "react";


interface FilterTabsProps {
  tabs: string[];
  defaultTab?: string;
  onTabChange?: (tab: string) => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ tabs, defaultTab, onTabChange }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="flex gap-3">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => handleTabClick(tab)}
          className={`px-4 py-[8px] text-[#535557] rounded-lg font-poppinsregular text-[16px]   border transition-all
            ${
              activeTab === tab
                ? "bg-[#e6f6ff]"
                : "bg-[#e6f6ff] text-gray-500 border-transparent"
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
