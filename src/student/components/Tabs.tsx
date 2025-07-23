// src/components/TabHeader.tsx
import React, { useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

const TabHeader = () => {
    const tabs = ['All', 'Assignment', 'Live Questions', 'Sessions'];
    const [activeTab, setActiveTab] = useState('All');

    return (
        <div className="flex items-center border-b border-gray-200 justify-between bg-white rounded-t-lg  shadow">
            <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={` font-poppinsregular pb-1 border-b-2 transition-all duration-200 ${activeTab === tab
                                ? 'text-primary border-sky-500 bg-blue-50 p-[10px] font-poppinssemibold'
                                : 'text-[#878787] border-transparent p-[10px] '
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <button className="flex items-center gap-1 font-poppinsregular mr-2 p-[10px] text-sm text-gray-500 px-3 py-1.5 rounded-lg shadow-sm bg-[#f2f2f2]">
                <SlidersHorizontal className="w-4 h-4" />
                Filter & Sort
                <ChevronDown className="w-4 h-4" />
            </button>
        </div>
    );
};

export default TabHeader;