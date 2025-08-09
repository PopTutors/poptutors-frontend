import { useState } from "react";

// src/components/TabHeader.tsx
type TabHeaderProps = {
  onTabChange: (tab: string) => void;
};

const TabHeader = ({ onTabChange }: TabHeaderProps) => {
  const tabs = ['All', 'Assignment', 'Live Questions', 'Sessions'];
  const [activeTab, setActiveTab] = useState('All');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="flex items-center border-b border-gray-200 justify-between bg-white rounded-t-lg  shadow">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={` font-poppinsregular  border-b-2 transition-all duration-200 ${
              activeTab === tab
                ? 'text-primary border-sky-500 bg-blue-50 p-[11px] font-poppinssemibold'
                : 'text-[#878787] border-transparent p-[11px] '
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Optional filter */}
    </div>
  );
};

export default TabHeader;
