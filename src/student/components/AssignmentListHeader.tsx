import { FiChevronDown } from "react-icons/fi";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown";
import { useState } from "react";

interface Props {
  completed?: number;
  total?: number;
  filter?: string[];
  onFilterChange?: (value: string) => void;
}

export default function AssignmentListHeader({
  completed = 8,
  total = 10,
  filter = ["Today", "Yesterday", "Last 7 days", "Last 30 days"],
  onFilterChange,
}: Props) {
  const safeFilter = Array.isArray(filter) ? filter : ["Today", "Yesterday", "Last 7 days", "Last 30 days"];
  const [selectedOption, setSelectedOption] = useState<string>(safeFilter[0]);
  const [open, setOpen] = useState(false);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onFilterChange?.(option);
  };

  return (
    <div className="flex font-poppinsmedium text-[13px] justify-between items-center mb-4 py-6 border-b border-gray-200">
      <p className="text-sm text-gray-600">
        {completed} assignment{completed > 1 ? "s" : ""} completed out of {total}
      </p>
      
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <div
            className="flex items-center gap-1 font-poppinsregular text-gray-600 cursor-pointer"
            data-state={open ? "open" : "closed"}
          >
            <Button size="sm" variant="ghost">
            Show:{selectedOption}
            </Button>
            <FiChevronDown
              className={`ml-1 text-lg text-gray-600 transition-transform duration-200 ${
                open ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {safeFilter.map((option) => (
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
  );
}
