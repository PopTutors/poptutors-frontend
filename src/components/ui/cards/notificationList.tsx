import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../dropdown';
import { Button } from '../button';
import { FiChevronDown } from 'react-icons/fi';

interface Notification {
  user: string;
  message: string;
  action?: string;
  course: string;
  time: string;
  icon: string;
  type: 'message' | 'rating' | string;
}

interface NotificationListProps {
  title?: string;
  filterOptions?: string[];
  notifications: Notification[];
  onFilterChange?: (value: string) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  title = 'Recent Messages & Alerts',
  filterOptions = ['Today', 'Yesterday', 'Last 7 days', 'Last 30 days'],
  notifications,
  onFilterChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(filterOptions[0]);
  const [open, setOpen] = React.useState(false);
  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onFilterChange?.(option);
  };
  return (
    <div className=" bg-white shadow-sm w-full p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4 border-b pb-3 border-gray-200">
        <h2 className=" text-[16px] font-poppinssemibold">{title}</h2>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <div
              className="flex items-center gap-2 font-poppinsregular text-[12px] px-2  py-[2px] h-[30px] rounded-lg  bg-gray-100 text-gray-600 hover:none"
              data-state={open ? 'open' : 'closed'}
            >
              <Button size="sm" variant="ghost">
                {selectedOption}
              </Button>
              <FiChevronDown
                className={`text-lg text-gray-600 transition-transform duration-200 ${
                  open ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {filterOptions.map((option) => (
              <DropdownMenuItem
                key={option}
                onSelect={() => handleSelect(option)}
                className="cursor-pointer font-poppinsregular  text-[12px] text-gray-600"
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {notifications.map((item, idx) => (
        <div key={idx} className="flex items-start space-x-3 py-2">
          <div className="w-[52px] h-[32px]">
            <img src={item?.icon} alt="" />
          </div>
          <div className="text-sm text-gray-900">
            <p className="font-poppinsmedium">
              <strong>{item.user}</strong> {item.message}
              {item.action && ` “${item.action}”`} in{' '}
              <span className="text-gray-600 font-poppinsregular">{item.course}</span>
            </p>
            <span className="text-gray-400 text-xs font-poppinsregular">{item.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
