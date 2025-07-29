import React from "react";
import { ArrowRight } from "lucide-react";

type SessionStatus = "budget" | "completed";
type CtaType = "reschedule" | "join" | "recordings";

interface SessionCardProps {
    title: string;
    subtitle: string;
    status: SessionStatus;
    datetime?: string;
    timezone?: string;
    sessionLength?: string;
    rating?: number;
    ratingCount?: number;
    ctaType: CtaType;
    disabled?: boolean;
    onClick?: () => void;
    timeNote?: string;
}

const getCtaLabel = (type: CtaType) => {
    switch (type) {
        case "reschedule":
            return "Reschedule";
        case "join":
            return "Join Now";
        case "recordings":
            return "View Recordings";
        default:
            return "";
    }
};

const SessionCard: React.FC<SessionCardProps> = ({
    title,
    subtitle,
    status,
    datetime,
    timezone,
    sessionLength,
    rating,
    ratingCount,
    ctaType,
    disabled,
    onClick,
    timeNote,
}) => {
    const isCompleted = status === "completed";
    const ctaLabel = getCtaLabel(ctaType);

    return (
        <div className="w-full  border rounded-lg shadow-sm p-4 bg-white">
            <div className="flex justify-between items-start gap-2">
                <div>
                    <h3 className="font-poppinssemibold text-[#212121] text-[18px]">
                        {title}
                    </h3>
                    <p className="text-[14px] mt-1 font-poppinsregular">
                        <span
                            className={`font-poppinsregular ${isCompleted ? "text-[#707070" : "text-[#DDA31E]"
                                }`}
                        >
                            {isCompleted ? "Completed" : "Budget decided"}
                        </span>
                        <span className="text-[#9197B3]"> • {subtitle}</span>
                    </p>
                </div>
                <ArrowRight className="text-[#00A5EC] w-[24px] h-[24px] mt-1 cursor-pointer" />
            </div>

            <div className="mt-4 h-[100px] bg-[#E9F8FE] rounded-lg px-4 py-3 flex justify-between items-center">
                {isCompleted ? (
                    <div>
                        <p className="text-[16px] font-poppinssemibold text-[#212121]">
                            {sessionLength}
                        </p>
                        <p className=" text-[#9197B3] mt-1 flex items-center">
                            <span className="text-[#FD8E1F] text-[16px] font-semibold mr-1">★</span>
                            <span className="text-[#FD8E1F] text-[16px] font-semibold "> {rating}{" "} </span>
                            <span className="ml-1 text-[12px] font-poppinsregular text-[#9197B3]">
                                ({ratingCount?.toLocaleString()} Rating)
                            </span>
                        </p>
                    </div>
                ) : (
                    <div>
                        <p className="text-[18px] font-poppinssemibold text-[#212121]">{datetime}</p>
                        <p className="text-[14px] font-poppinsregular text-[#111111]">{timezone}</p>
                        {timeNote && (
                            <p className="text-[14px] font-poppinsregular text-[#9197B3] mt-1">{timeNote}</p>
                        )}
                    </div>
                )}
                <button className="border w-[160px] border-primary  px-4 py-[9px] rounded-full text-[14px] font-poppinsmedium bg-primary text-white whitespace-nowrap">
                    {ctaLabel}
                </button>
            </div>
        </div>
    );
};

export default SessionCard;
