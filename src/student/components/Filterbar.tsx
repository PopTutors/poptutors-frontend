import React, { useRef, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown';
import { Button } from '../../components/ui/button';
import { FiChevronDown, FiCalendar } from 'react-icons/fi';
import { Arrowright } from '../../assets';

interface FilterBarProps {
  selectedOption: string;
  onSubjectChange: (subject: string) => void;
  startDate: string;
  endDate: string;
  onDateChange: (type: 'start' | 'end', value: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedOption,
  onSubjectChange,
  startDate,
  endDate,
  onDateChange
}) => {
  const filterOptions = ['Mathematics', 'Physics', 'Chemistry'];
  const [open, setOpen] = useState(false);

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const hideDefaultDateIcon = 'appearance-none [&::-webkit-calendar-picker-indicator]:hidden';

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6 mt-4">
      {/* Subject dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <label className="text-[14px] font-poppinsregular text-[#262626]">Subject:</label>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center justify-between gap-2 border px-3 py-2 rounded-lg text-sm text-[#262626] bg-gray-50"
            >
              {selectedOption}
              <FiChevronDown
                className={`transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {filterOptions.map((option) => (
              <DropdownMenuItem
                key={option}
                onSelect={() => onSubjectChange(option)}
                className="cursor-pointer text-[14px] font-poppinsregular text-[#262626]"
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Date Range */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <label className="text-[14px] font-poppinsregular text-[#262626]">Date:</label>

        {/* Start Date */}
        <div className="relative">
          <button
            type="button"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            onClick={() => startDateRef.current?.showPicker()}
          >
            <FiCalendar />
          </button>
          <input
            ref={startDateRef}
            type="date"
            value={startDate}
            onChange={(e) => onDateChange('start', e.target.value)}
            className={`pl-10 pr-3 py-2 border rounded-lg text-[14px] font-poppinsregular bg-white ${hideDefaultDateIcon}`}
          />
        </div>

        {/* Arrow Icon */}
        <span className="flex items-center justify-center px-2 py-2">
          <img src={Arrowright} alt="Arrow" className="w-4 h-4" />
        </span>

        {/* End Date */}
        <div className="relative">
          <button
            type="button"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            onClick={() => endDateRef.current?.showPicker()}
          >
            <FiCalendar />
          </button>
          <input
            ref={endDateRef}
            type="date"
            value={endDate}
            onChange={(e) => onDateChange('end', e.target.value)}
            className={`pl-10 pr-3 py-2 border rounded-lg text-[14px] font-poppinsregular bg-white ${hideDefaultDateIcon}`}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
