// src/components/common/CourseCard.tsx

import React from 'react';
import { FiCalendar } from 'react-icons/fi';
import ticketIcon from '../../../assets/ticket.svg'; // adjust if needed

interface CourseCardProps {
  title: string;
  topic: string[];
  date: string;
  price: string;
  progress: number;
  label?: string;
  labelColor?: string; // Use Tailwind class (e.g. "text-blue-600")
  labelBackground?: string; // Use Tailwind class (e.g. "bg-blue-100")
  onViewDetails?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  topic,
  date,
  price,
  progress,
  label = 'Live Question',
  labelColor = 'text-red-500',
  labelBackground = 'bg-red-100',
  onViewDetails,
}) => {
  return (
    <div className="border-2 mx-auto rounded-xl p-4 w-full max-w-xs bg-white">
      <h3 className="text-[16px] font-semibold text-[#1f2442]">{title}</h3>

      <div className="flex flex-wrap items-center gap-2 mt-1">
        {topic.map((t, index) => (
          <p key={index} className="text-[15px] text-gray-500 flex items-center gap-1">
            <span className="text-[#A8ADB7]">•</span> {t}
          </p>
        ))}
      </div>

      <div className={`inline-block mt-2 px-3 py-[2px] text-[12px] font-semibold rounded-full ${labelBackground} ${labelColor}`}>
        {label}
      </div>

      <div className="flex items-center gap-8 text-sm text-gray-600 mt-3">
        <div className="flex items-center gap-1 text-[#f7a800]">
          <FiCalendar className="text-base" />
          <span className="font-semibold">{date}</span>
        </div>
        <div className="flex items-center gap-1 text-[#00bcd4] font-medium">
          <img src={ticketIcon} alt="Ticket Icon" width={20} height={20} />
          <span className="font-semibold">{price}</span>
        </div>
      </div>

      <div className="mt-3">
        <div className="h-2 bg-gray-200 rounded-full">
          <div className="h-2 bg-[#56cdad] rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-sm mt-1 text-gray-700 font-semibold">{progress}% Completed</p>
      </div>

      <button
        onClick={onViewDetails}
        className="mt-4 w-full font-semibold border border-[#00bcd4] text-[#00bcd4] py-2 rounded-full text-sm hover:bg-[#00bcd4] hover:text-white transition-all"
      >
        View Details
      </button>
    </div>
  );
};

export default CourseCard;
