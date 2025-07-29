import React from 'react';
import { ArrowRightHalf } from '../../assets';

type MilestoneProps = {
  totalSteps: number;
  completedSteps: number;
};

const AssignmentMilestone: React.FC<MilestoneProps> = ({ totalSteps, completedSteps }) => {
  const percentage = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="bg-[#0C0A29] p-4  flex items-center justify-between text-white w-full ">
      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold">Assignment Milestone</span>
        <span className="text-xs text-gray-400">
          {completedSteps}/{totalSteps} Steps
        </span>
      </div>

      <div className="flex-grow mx-4">
        <div className="w-full h-[10px] bg-gray-700 rounded-md overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">{percentage}% Completed</span>
        <span className="text-lg">
          <img src={ArrowRightHalf} alt="" />
        </span>
      </div>
    </div>
  );
};

export default AssignmentMilestone;
