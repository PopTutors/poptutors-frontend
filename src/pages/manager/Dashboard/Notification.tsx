import { ChevronDown } from 'lucide-react';

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

export default function Notifications() {
  return (
    <div className="w-full max-h-[430px] bg-white border border-black/10 p-6 flex flex-col gap-6 overflow-y-scroll">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-mentoos-text-primary">Notifications</h2>
        <button className="flex items-center gap-4 px-4 py-1.5 border border-black/10 bg-white text-mentoos-text-primary hover:bg-gray-50 transition-colors">
          <span className="text-base">All</span>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex flex-col gap-5">
        {notifications.map((notification) => (
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
        ))}
      </div>
    </div>
  );
}
