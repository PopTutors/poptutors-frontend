import { ArrowBigRightDash } from 'lucide-react';
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
      <div className="flex items-center">
  <label className="text-[14px] font-poppinsregular bg-gray-100 px-3 py-[10px] rounded-lg text-gray-600">
    Date
  </label>

  <input
    type="date"
    className="border-t rounded-l-lg border-b border-l border-r-0 font-poppinsregular text-gray-600 px-2 py-2 text-sm"
  />

  <span className="flex items-center justify-center border-t border-b border-r-0 border-l-0 bg-white px-2 w-[30px] py-4">
    <img src={Arrowright} alt="Arrow" className="" />
  </span>

  <input
    type="date"
    className="border-t rounded-r-lg border-b border-r border-l-0 font-poppinsregular text-gray-600 px-2 py-2 text-sm"
  />
</div>


      <div className="flex items-center">
        <label className="text-[14px] font-poppinsregular bg-gray-100 px-2 py-2 rounded text-gray-600">Subject/Skills</label>
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
                className={`ml-1 text-lg text-gray-600 transition-transform duration-200 ${
                  open ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {filterOptions.map((option) => (
              <DropdownMenuItem
                key={option}
                onSelect={() => handleSelect(option)}
                className="cursor-pointer font-poppinsregular text-gray-600"
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default FilterBar;

