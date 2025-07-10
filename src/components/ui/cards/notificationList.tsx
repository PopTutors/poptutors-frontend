import React, { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../dropdown";
import { Button } from "../button";
import { FiChevronDown } from "react-icons/fi";

interface Notification {
    user: string;
    message: string;
    action?: string;
    course: string;
    time: string;
    type: "message" | "rating" | string;
}

interface NotificationListProps {
    title?: string;
    filterOptions?: string[];
    notifications: Notification[];
    onFilterChange?: (value: string) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
    title = "Recent Messages & Alerts",
    filterOptions = ["Today", "Yesterday", "Last 7 days", "Last 30 days"],
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
        <div className=" bg-white shadow-sm w-full">
            <div className="flex justify-between items-center mb-4 border-b border-gray-200">
                <h2 className="text-lg p-4 text-gray-900 font-poppinsmedium">{title}</h2>
                <DropdownMenu open={open} onOpenChange={setOpen}>
                    <DropdownMenuTrigger asChild>
                        <div
                            className="flex p-4 items-center gap-1 font-poppinsregular text-gray-600"
                            data-state={open ? 'open' : 'closed'}
                        >
                            <Button size="sm" variant="ghost">{selectedOption}</Button>
                            <FiChevronDown
                                className={`ml-1 text-lg text-gray-600 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'
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

            {notifications.map((item, idx) => (
                <div key={idx} className="flex p-4 items-start  space-x-3 py-3 ">
                    <div>
                        <img src={item?.icon} alt="" />
                    </div>
                    <div className="text-sm text-gray-900">
                        <p>
                            <strong>{item.user}</strong> {item.message}
                            {item.action && ` “${item.action}”`} in{" "}
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
