import type { FC } from 'react';
import { ArrowRight } from 'lucide-react';
import clsx from 'clsx';

type StatusType = 'budget' | 'confirmed' | 'completed' | 'rejected';
interface SessionCardProps {
  title: string;
  status: StatusType;
  subject: string;
  topic: string;
  hours: number;
  time?: string;
  timezone?: string;
  startsIn?: string;
  startNote?: string;
  rating?: number;
  showRecording?: boolean;
}

const statusStyles = {
  budget: {
    label: 'Budget decided',
    bg: 'bg-[#fcf6e9]',
    text: 'text-[#DDA31E]',
  },
  confirmed: {
    label: 'Confirmed',
    bg: 'bg-[#edf7fa]',
    text: 'text-[#197B9B]',
  },
  completed: {
    label: 'Completed',
    bg: 'bg-[#ECF6EC]',
    text: 'text-[#229126]',
  },
  rejected: {
    label: 'Stage where it got rejected',
    bg: 'bg-[#FFEDED]',
    text: 'text-[#D22525]',
  },
};

export const LiveQuestionCard: FC<SessionCardProps> = ({
  status,
  subject,
  topic,
  hours,
  rating,
  showRecording,
}) => {
  const isCompleted = status === 'completed';
  const isRejected = status === 'rejected';
  const statusInfo = statusStyles[status];

  return (
    <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className={clsx('flex items-center justify-between py-[18px] px-4', statusInfo.bg)}>
        <div>
          <h3 className="font-poppinssemibold text-[18px] text-gray-800">Live Exam Help Type</h3>
          <p className="text-sm mt-1">
            <span className={clsx('font-poppinssmedium font-[14px] ', statusInfo.text)}>
              {statusInfo.label}
            </span>
            <span className="text-[#707070] font-poppinssregular font-[14px]">
              {' '}
              • Description - Problem solving on library
            </span>
          </p>
        </div>
        <ArrowRight className="text-[#00A5EC] w-[24px] h-[24px] mt-1 cursor-pointer" />
      </div>

      <div className="p-4 space-y-1 text-[14px]">
        <div className="flex justify-between">
          <span className="text-[#707070] font-poppinsregular">Subject:</span>
          <span className="text-[#111111] font-poppinsmedium text-gray-800">{subject}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#707070] font-poppinsregular">Topic Name:</span>
          <span className="text-[#111111] font-poppinsmedium text-gray-800">{topic}</span>
        </div>
        <div className="flex justify-between pb-3">
          <span className="text-[#707070] font-poppinsregular">No. of Hours:</span>
          <span className="text-[#111111] font-poppinsmedium text-gray-800">{hours}</span>
        </div>
        <hr className="mt-3" />
        {/* Time Info */}

        {!isCompleted && !isRejected && (
          <>
            <div className="flex pt-3 justify-between">
              <div>
                <p className="text-[18px] font-poppinssemibold text-[#212121]">
                  16 Mar 11 PM -12 PM
                </p>
                <p className="text-[14px] font-poppinsregular text-[#111111]">
                  (EET), <span className="font-poppinsregular">Cairo UTC +3</span>
                </p>
                <p className="text-[14px] font-poppinsregular text-gray-400">Starting in 4hrs</p>
              </div>
              {/* Button */}
              <div className="pt-3">
                <button className="border w-[160px] border-primary  px-4 py-[9px] rounded-full text-[14px] font-poppinsmedium bg-primary text-white whitespace-nowrap">
                  Reschedule
                </button>
              </div>
            </div>
          </>
        )}

        {/* {!isCompleted && !isRejected && (
          <>
            <div className="font-semibold text-base text-black">{time}</div>
            <div className="text-sm text-gray-500">{timezone}</div>
            <div className="text-sm text-gray-400 mb-3">{startsIn}</div>
            <button className="bg-sky-500 text-white px-4 py-2 rounded-full hover:bg-sky-600 text-sm">
              Reschedule
            </button>
          </>
        )} */}

        {isCompleted && (
          <div className="flex justify-between h-[76px] items-center">
            <div>
              <div className="font-semibold text-base text-black">1hrs Sessions</div>
              <div className="text-sm text-gray-600 flex items-center gap-1">
                <span className="text-orange-500 font-semibold">{rating}</span>
                <span className="text-gray-400">(451,444 Rating)</span>
              </div>
            </div>
            {showRecording && (
              <button className="border w-[160px] border-primary  px-4 py-[9px] rounded-full text-[14px] font-poppinsmedium bg-primary text-white whitespace-nowrap">
                View Recordings
              </button>
            )}
          </div>
        )}

        {isRejected && (
          <>
            <div className="flex pt-3 justify-between opacity-20">
              <div>
                <p className="text-[18px] font-poppinssemibold text-[#212121]">
                  16 Mar 11 PM -12 PM
                </p>
                <p className="text-[14px] font-poppinsregular text-[#111111]">
                  (EET), <span className="font-poppinsregular">Cairo UTC +3</span>
                </p>
                <p className="text-[14px] font-poppinsregular text-gray-400">Starting in 4hrs</p>
              </div>
              {/* Button */}
              <div className="pt-3">
                <button className="border w-[160px] pointer-events-none border-primary  px-4 py-[9px] rounded-full text-[14px] font-poppinsmedium bg-primary text-white whitespace-nowrap">
                  Cancelled
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
