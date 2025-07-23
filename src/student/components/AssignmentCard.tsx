import React from 'react';
import { Star } from 'lucide-react';

type AssignmentStatus = 'Completed' | 'Inprogress';

interface AssignmentCardProps {
  id: number;
  title: string;
  subtitle: string;
  amount: number;
  deadline: string;
  tags: string[];
  status: AssignmentStatus;
  statusLabel: string;
  rating?: number;
  ratingCount?: number;
  milestone?: string;
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
  milestone,
}) => {
  const isCompleted = status === 'Completed';

  return (
    <div className="border rounded-xl shadow-sm  mb-4 bg-white">
      <div className="flex justify-between p-4 items-start mb-2">
        <div>
          <h3 className="font-poppinsbold text-[16px] ">
            #{id} {title}
          </h3>
          <p className="text-[10px] text-[#707070] font-poppinsregular">{subtitle}</p>
        </div>
        <div className="font-poppinsmedium text-[12px] text-right">
          <p className={` ${isCompleted ? 'text-green-600' : 'text-blue-600'}`}>
            {statusLabel}
          </p>
          {!isCompleted && milestone && (
            <p className="text-blue-400 text-xs">{milestone}</p>
          )}
        </div>
      </div>
      <div className="bg-[#e6f9ff] p-3 mx-4 my-3 rounded-md flex items-center justify-between">
        <div>
          <p className="text-primary font-poppinssemibold">{amount}</p>
          <p className="text-[10px] text-gray-500 font-poppinsregular"> Deadline: {deadline}</p>
        </div>
        <div className="flex items-center space-x-2">
          
          <button className="border border-primary text-primary px-4 py-1 rounded-full text-[14px] font-poppinsmedium hover:bg-primary hover:text-white">
            View Assignment
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2 mt-2 bg-[#EDEDED] p-2 rounded-b-md">
        <div className='flex items-center gap-2 text-[10px] font-poppinsregular text-gray-600'>
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-white  text-[10px] font-poppinsregular px-[6px] py-1 rounded-md"
          >
            {tag}
          </span>
        ))}
        </div>
        {!isCompleted && rating && ratingCount ? (
        <div className="flex items-center  text-sm  text-gray-600">
          <Star size={16} className="text-orange-400 fill-orange-400 mr-1" />
          <span className=" font-poppinssemibold text-[14px] text-[#1D2026]">{rating.toFixed(1)}</span>
          <span className=" font-poppinsregular text-[10px]">({ratingCount.toLocaleString()} Rating)</span>
        </div>
      ) : null}
      </div>
    </div>
  );
};

export default AssignmentCard;
