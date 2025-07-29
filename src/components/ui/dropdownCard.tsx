import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown'; // adjust this path if needed
import { useNavigate } from 'react-router-dom';

interface DropdownCardProps {
  label?: string;
  title: string;
  iconType?: 'image' | 'arrow';
  imageSrc?: string;
  menuItems: string[];
  onSelect?: (item: string) => void;
  customTitleClass?: string;
  customLabelClass?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  dropdownRef?: React.RefObject<HTMLDivElement | null>;
}

const DropdownCard: React.FC<DropdownCardProps> = ({
  label,
  title,
  iconType = 'arrow',
  imageSrc,
  menuItems,
  onSelect,
  customTitleClass = 'text-base font-poppinsmedium text-[#1f2442]',
  customLabelClass = 'text-[11px] text-gray-500 font-poppinsmedium leading-tight',
}) => {
  const navigate = useNavigate();
  const handleSelect = (item: string) => {
    onSelect?.(item);
    navigate(`/student/${item}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex bg-red justify-between items-center gap-4 md:gap-10 bg-white border border-gray-200 rounded-xl px-4 py-2 cursor-pointer w-fit">
          <div className="flex items-center gap-2">
            {iconType === 'image' && imageSrc && (
              <img
                src={imageSrc}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            )}
            <div className="hidden sm:block text-sm text-left truncate">
              {label && <p className={customLabelClass}>{label}</p>}
              <p className={customTitleClass}>{title}</p>
            </div>
          </div>
          <FiChevronDown className="text-[#1f2442] text-lg" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-40">
        {menuItems.map((item) => (
          <DropdownMenuItem
            key={item}
            onSelect={() => handleSelect(item)}
            className="cursor-pointer px-4 py-2 hover:bg-gray-100"
          >
            {item}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownCard;
