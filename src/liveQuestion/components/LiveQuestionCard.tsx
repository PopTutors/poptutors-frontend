import React from "react";

type ColorKey = "purple" | "blue" | "green" | "orange";

type LiveQuestionCardProps = {
  subject?: string;
  topicName?: string;
  timeSlot?: string;
  hours?: string;
  price?: string;
  status?: string;
  mainColor?: ColorKey;
};

const colorVariants: Record<
  ColorKey,
  {
    border: string;
    headerBg: string;
    statusBg: string;
    buttonBorder: string;
    buttonText: string;
    priceText: string;
  }
> = {
  purple: {
    border: "border-purple-400",
    headerBg: "bg-yellow-100",
    statusBg: "bg-yellow-200",
    buttonBorder: "border-blue-400",
    buttonText: "text-blue-500",
    priceText: "text-yellow-600",
  },
  blue: {
    border: "border-blue-400",
    headerBg: "bg-blue-100",
    statusBg: "bg-blue-200",
    buttonBorder: "border-blue-400",
    buttonText: "text-blue-500",
    priceText: "text-blue-600",
  },
  green: {
    border: "border-green-400",
    headerBg: "bg-green-100",
    statusBg: "bg-green-200",
    buttonBorder: "border-green-400",
    buttonText: "text-green-500",
    priceText: "text-green-600",
  },
  orange: {
    border: "border-orange-400",
    headerBg: "bg-orange-100",
    statusBg: "bg-orange-200",
    buttonBorder: "border-orange-400",
    buttonText: "text-orange-500",
    priceText: "text-orange-600",
  },
};

const LiveQuestionCard = ({
  subject = "Computer Science",
  topicName = "Python Programming",
  timeSlot = "16 March 11 PM -12 PM",
  hours = "1 hour",
  price = "$30",
  status = "Status",
  mainColor = "purple",
}: LiveQuestionCardProps) => {
  const colors = colorVariants[mainColor ?? "purple"];

  return (
    <div
      className={`w-100 bg-white rounded-lg border-2 p-6 font-sans relative`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className={`${colors.headerBg} px-4 py-2 rounded-lg`}>
          <h2 className="text-lg font-semibold text-gray-800">Help Type</h2>
        </div>
        <div className="flex space-x-1">
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-start">
          <span className="text-gray-600 font-medium text-sm">Subject</span>
          <span className="text-gray-800 font-semibold text-sm text-right max-w-48">
            {subject}
          </span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-gray-600 font-medium text-sm">Topic Name</span>
          <span className="text-gray-800 font-semibold text-sm text-right max-w-48">
            {topicName}
          </span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-gray-600 font-medium text-sm">Time Slot</span>
          <span className="text-gray-800 font-semibold text-sm text-right max-w-48">
            {timeSlot}
          </span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-gray-600 font-medium text-sm">
            No. of Hours
          </span>
          <span className="text-gray-800 font-semibold text-sm text-right max-w-48">
            {hours}
          </span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between mb-4">
        <div className={`${colors.statusBg} px-4 py-2 rounded-lg`}>
          <span className="text-sm font-semibold text-gray-700">{status}</span>
        </div>
        <div className={`text-2xl font-bold ${colors.priceText}`}>{price}</div>
      </div>

      {/* Button */}
      <button
        className={`w-full py-3 px-4 rounded-full border-2 ${colors.buttonBorder} bg-white ${colors.buttonText} font-semibold text-sm hover:bg-gray-50 transition-colors`}
      >
        View Details
      </button>
    </div>
  );
};

export default LiveQuestionCard;
