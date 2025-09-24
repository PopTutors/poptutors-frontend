import React from 'react';
import { DashboardFileIcon } from '../../../assets/managers';

type StatCardProps = {
  title: string;
  value: number;
  color: string;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => (
  <div
    className={`w-full h-[121px] p-[24px] ${color} flex-1 flex items-start justify-center text-[#141414] flex-col gap-2 relative`}
  >
    <h4 className="text-[18px] font-inter">{title}</h4>
    <p className="text-[32px] font-bold">{value}</p>
    <img src={DashboardFileIcon} className="absolute w-[20px] h-[20px] top-4 right-4" />
  </div>
);

const StatsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <StatCard title="Assignments" value={45} color="bg-[#BCEFFF]" />
      <StatCard title="Exam Help" value={18} color="bg-[#FFCED4]" />
      <StatCard title="Sessions" value={18} color="bg-[#FFE4BB]" />
    </div>
  );
};

export default StatsCards;
