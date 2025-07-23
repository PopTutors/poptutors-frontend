// components/ui/SearchInput.tsx

import React from "react";
import { FiSearch } from "react-icons/fi"; // Feather Icons (optional)

const SearchInput: React.FC = () => {
  return (
    <div className="flex items-center w-full max-w-sm px-4 py-[13px] bg-gray-100 rounded-lg">
      <FiSearch className="text-gray-400 text-lg" />
      <input
        type="text"
        placeholder="Search"
        className="ml-2 bg-transparent font-poppinsregular outline-none w-full text-sm text-gray-700 placeholder-gray-400"
      />
    </div>
  );
};

export default SearchInput;
