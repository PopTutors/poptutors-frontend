import React, { useState } from 'react';

const FilterBar: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('2021-12-23');
  const [endDate, setEndDate] = useState<string>('2021-12-23');
  const [subject, setSubject] = useState<string>('C Programming');

  return (
    <div className="flex flex-wrap gap-1 items-center mb-3 rounded-lg">
      
      {/* Date Label */}
      <div className="px-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 text-gray-600">
        Date
      </div>

      {/* Date Range Inputs */}
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="text-sm px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
      />
      <span className="text-gray-500">→</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="text-sm px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
      />

      {/* Subject Label */}
      <div className="px-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 text-gray-600">
        Subject
      </div>

      {/* Subject Dropdown */}
      <select
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="text-sm px-3 py-2 border border-gray-200 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-400"
      >
        <option value="C Programming">C Programming</option>
        <option value="Java">Java</option>
        <option value="Python">Python</option>
        <option value="DSA">Data Structures</option>
      </select>
    </div>
  );
};

export default FilterBar;
