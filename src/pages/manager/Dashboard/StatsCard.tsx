import React from 'react';
import { DashboardFileIcon } from '../../../assets/managers'; // must be a string path

type BubbleBox = {
  assignments?: any[]; // narrow this type as needed
  sessions?: any[]; // narrow this type as needed
  liveHelps?: any[]; // narrow this type as needed
};

type StatsCardsProps = {
  bubbleBox: BubbleBox;
  setStat: (stat: string) => void;
};

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
    {/* DashboardFileIcon assumed to be a URL string */}
    <img src={DashboardFileIcon} alt="icon" className="absolute w-[20px] h-[20px] top-4 right-4" />
  </div>
);

const StatsCards: React.FC<StatsCardsProps> = ({ bubbleBox, setStat }) => {
  const assignmentsCount = bubbleBox?.assignments?.length ?? 0;
  const sessionsCount = bubbleBox?.sessions?.length ?? 0;
  const liveHelpsCount = bubbleBox?.liveHelps?.length ?? 0;

  return (
    <div className="grid gap-4 mb-6 xsm:grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <div className='cursor-pointer' onClick={(e) => setStat("assignment")}>
        <StatCard title="Assignments" value={assignmentsCount} color="bg-[#BCEFFF]" />
      </div>
      <div className='cursor-pointer' onClick={(e) => setStat("liveHelp")}>
        <StatCard title="Exam Help" value={sessionsCount} color="bg-[#FFCED4]" />
      </div>
      <div className='cursor-pointer' onClick={(e) => setStat("sessions")}>
        <StatCard title="Sessions" value={liveHelpsCount} color="bg-[#FFE4BB]" />
      </div>
    </div>
  );
};

export default StatsCards;
