import React from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../config/path';

type AssignmentStatus = 'Completed' | 'Inprogress';

interface AssignmentCardProps {
  id: number;
  title: string;
  subtitle: string;
  amount: number;
  deadline: string;
  tags: string[];
  status: AssignmentStatus;
  statusLabel: string[];
  rating?: number;
  ratingCount?: number;
  milestone?: string;
  subjectcode?: string;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({
  id,
  title,
  subtitle,
  amount,
  deadline,
  tags,
  status,
  statusLabel,
  rating,
  ratingCount,
  subjectcode,
}) => {
  const navigate = useNavigate();
  const isCompleted = status === 'Completed';

  const handleViewAssignment = () => {
    navigate(paths.student.assignment.details.getHref(id.toString()));
  };

  return (
    <div className=" rounded-xl shadow-[0px_3px_12px_rgba(0,0,0,0.07)] mb-4 bg-white">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row justify-between p-4 items-start sm:items-center gap-2 mb-2">
        <div>
          <h3 className="font-poppinsbold text-[14px] sm:text-[16px]">
            #{id} <span className="font-poppinsregular">{title}</span>
          </h3>
          <p className="text-[10px] text-[#707070] font-poppinsregular mt-1">
            <span className="py-[2px] px-2 rounded bg-[#e6f9ff] mr-1">{subjectcode}</span>
            {subtitle}
          </p>
        </div>

        <div className="font-poppinsmedium text-[12px] text-left sm:text-right">
  <div className={`flex flex-col gap-1 ${isCompleted ? 'text-[#39A340]' : 'text-primary'}`}>
    {statusLabel.map((label, index) => (
      <div
        key={index}
        className={`py-[2px] px-2 rounded ${isCompleted ? 'bg-[#39A3401A]' : 'bg-[#e6f9ff]'}`}
      >
        {label}
      </div>
    ))}
  </div>
</div>

      </div>

      {/* Middle Section */}
      <div className="bg-[#e6f9ff] px-4 py-3 mx-4 my-2 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <p className="text-primary font-poppinsbold text-sm">${amount}</p>
          <p className="text-[10px] text-gray-500 font-poppinsmedium">Deadline: {deadline}</p>
        </div>
        <button
          onClick={handleViewAssignment}
          className="border border-primary text-primary px-4 py-1 rounded-full text-sm font-poppinsmedium hover:bg-primary hover:text-white whitespace-nowrap transition-all duration-200"
        >
          View Assignment
        </button>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-2 bg-[#EDEDED] px-4 py-2 rounded-b-md">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-poppinsregular text-gray-600">
          {tags.map((tag, index) => (
            <span key={index} className="bg-white text-[10px] px-[6px] py-1 rounded">
              {tag}
            </span>
          ))}
        </div>

        {!isCompleted && rating && ratingCount && (
          <div className="flex items-center text-sm text-gray-600">
            <Star size={16} className="text-orange-400 fill-orange-400 mr-1" />
            <span className="font-poppinssemibold text-[14px] text-[#1D2026]">
              {rating.toFixed(1)}
            </span>
            <span className="font-poppinsregular text-[10px] ml-1">
              ({ratingCount.toLocaleString()} Rating)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentCard;
