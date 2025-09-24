import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Good morning, Maria</h2>
        <p className="text-gray-500 text-sm">
          Here is your job linkage statistics report from July 19 - July 25.
        </p>
      </div>
      <button className="border rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
        📅 Jul 19 - Jul 25
      </button>
    </div>
  );
};

export default Header;
