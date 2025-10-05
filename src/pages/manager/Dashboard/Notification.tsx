import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface NotificationItem {
  id: string;
  type: 'message' | 'question' | 'comment' | 'mention';
  user: string;
  action: string;
  timeAgo: string;
  bgColor: string;
}

const notifications: NotificationItem[] = [
  {
    id: '1',
    type: 'message',
    user: 'K',
    action: 'Kevin sent you message "What is ux" in Design Assignment',
    timeAgo: 'Just now',
    bgColor: 'bg-green-100',
  },
  {
    id: '2',
    type: 'question',
    user: 'A',
    action: 'Avin asked "Can you explain Wireframes?" in UI Task',
    timeAgo: '5 mins ago',
    bgColor: 'bg-purple-100',
  },
  {
    id: '3',
    type: 'comment',
    user: 'A',
    action: 'Riya commented "Difference between UI and UX?" in Design Project',
    timeAgo: '5 mins ago',
    bgColor: 'bg-red-100',
  },
  {
    id: '4',
    type: 'mention',
    user: 'A',
    action: 'Aman mentioned you "Please review my Layout Draft" in Prototype Assignment',
    timeAgo: '5 mins ago',
    bgColor: 'bg-green-100',
  },
];

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'message', label: 'Messages' },
  { value: 'question', label: 'Questions' },
  { value: 'comment', label: 'Comments' },
  { value: 'mention', label: 'Mentions' },
];

export default function Notifications() {
  const [selectedFilter, setSelectedFilter] = useState < string > ('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState < 'left' | 'right' > ('right');
  const dropdownRef = useRef < HTMLDivElement > (null);
  const buttonRef = useRef < HTMLButtonElement > (null);

  // Filter notifications based on selected filter
  const filteredNotifications = selectedFilter === 'all'
    ? notifications
    : notifications.filter(notification => notification.type === selectedFilter);

  // Get current filter label
  const currentFilterLabel = filterOptions.find(option => option.value === selectedFilter)?.label || 'All';

  // Handle dropdown positioning
  const handleDropdownToggle = () => {
    if (!isDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceRight = window.innerWidth - rect.right;
      const dropdownWidth = 140; // approximate dropdown width

      setDropdownPosition(spaceRight < dropdownWidth ? 'left' : 'right');
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFilterSelect = (filterValue: string) => {
    setSelectedFilter(filterValue);
    setIsDropdownOpen(false);
  };

  return (
    <div className="w-full h-[430px] bg-white p-6 flex flex-col gap-6 overflow-y-scroll">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[20px] font-semibold text-[#141414] font-inter">Notifications</h2>

        {/* Filter Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            ref={buttonRef}
            onClick={handleDropdownToggle}
            className="self-end flex items-center gap-4 px-4 py-1.5 border border-black/10 bg-white text-mentoos-text-primary hover:bg-gray-50 transition-colors"
          >
            <span className="text-base">{currentFilterLabel}</span>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className={`absolute mt-2 w-36 bg-white border border-gray-200  shadow-lg z-20 ${dropdownPosition === 'left' ? 'right-100' : 'right-0'
              }`}>
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterSelect(option.value)}
                  className={`font-inter text-[16px] text-left w-full px-4 py-2  hover:bg-gray-50  transition-colors ${selectedFilter === option.value
                    ? 'text-primary'
                    : 'text-[#141414]'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex flex-col gap-5">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div key={notification.id} className="flex items-start gap-3">
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-full ${notification.bgColor} flex items-center justify-center flex-shrink-0`}
              >
                <span className="text-sm font-semibold text-mentoos-text-primary">
                  {notification.user}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-mentoos-text-primary leading-normal mb-2">
                  {notification.action}
                </p>
                <p className="text-sm text-mentoos-text-secondary">{notification.timeAgo}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-mentoos-text-secondary">
              No {selectedFilter} notifications found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
