// components/SessionCard.tsx
import React from 'react';

type UpcommingExamCardProps = {
    title: string;
    time: string;
    status: string;
    actionLabel: string;
    onActionClick?: () => void;
    actionColor?: string; // Tailwind-compatible class, e.g., 'bg-[#00B8D9]'
};

const UpcommingExamCard: React.FC<UpcommingExamCardProps> = ({
    title,
    time,
    status,
    actionLabel,
    onActionClick,
    actionColor = 'bg-[#00B8D9]',
}) => {
    return (
        <div className="bg-[#E6F8FF] p-4 rounded-lg mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
            {/* Left Section */}
            <div>
                <div className="flex items-center ">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                    <h3 className="font-poppinssemibold text-[12px] sm:text-base text-gray-900">{title}</h3>
                </div>
                <div className="flex flex-col sm:flex-row items-between justify-between sm:items-center mt-2 sm:mt-0">
                    <div className='mt-2 '>
                        <div className="text-sm sm:text-base text-gray-800">{time}</div>
                        <div className="text-xs text-gray-500 mt-1">{status}</div>
                    </div>
                    <button
                        onClick={onActionClick}
                        className={`mt-3 sm:mt-0 ${actionColor} text-white text-[10px] font-poppinsmedium px-4 py-1 rounded-full`}
                    >
                        {actionLabel}
                    </button>
                </div>

            </div>

            {/* Button */}

        </div>
    );
};

export default UpcommingExamCard;
