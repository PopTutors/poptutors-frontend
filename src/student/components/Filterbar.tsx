import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown';
import { Button } from '../../components/ui/button';
import { FiChevronDown } from 'react-icons/fi';
import { Arrowright } from '../../assets';

const FilterBar: React.FC = () => {
  const filterOptions = ["C Programming"];

  const [open, setOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = useState<string>(
    filterOptions[0]
  );

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setOpen(false);
  };

  return (
    <div className="flex sm:flex-row flex-col gap-4 mb-6 mt-4">



      <div className="flex items-center gap-2">
        <label className="text-[14px] font-poppinsregular  rounded text-[#262626]">Subject : </label>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <div
              className="flex  items-center gap-1 font-poppinsregular px-2 py-[2px] rounded border rounded-lg  font-poppinsregular bg-gray-50 text-gray-600"
              data-state={open ? "open" : "closed"}
            >
              <Button size="sm" variant="ghost">
                {selectedOption}
              </Button>
              <FiChevronDown
                className={`ml-1 text-lg text-[#262626] transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"
                  }`}
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {filterOptions.map((option) => (
              <DropdownMenuItem
                key={option}
                onSelect={() => handleSelect(option)}
                className="cursor-pointer font-poppinsregular text-[#262626]"
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-[14px] font-poppinsregular  py-[10px] rounded-lg text-[#262626]">
          Date :
        </label>

        <input
          type="date"
          className="border rounded-lg  font-poppinsregular text-[#262626] px-2 py-2 text-sm"
        />

        <span className="flex items-center justify-center  bg-white px-2 w-[30px] py-4">
          <img src={Arrowright} alt="Arrow" className="" />
        </span>

        <input
          type="date"
          className="border rounded-lg  font-poppinsregular text-[#262626] px-2 py-2 text-sm"
        />
      </div>
    </div>
  );
};

export default FilterBar;

