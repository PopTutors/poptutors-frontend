import React from "react";
import { ManagerEditIcon } from "../../../assets/managers";

interface AboutSectionProps {
    profile: any;
    onEdit: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
    profile,
    onEdit
}) => {
    return (
        <div className="bg-white shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-inter font-semibold text-gray-900">About Me</h2>
                <button
                    onClick={onEdit}
                    className="p-2 hover:bg-gray-100 -full"
                >
                    <img src={ManagerEditIcon} alt="Edit" className="w-[24px] h-[24px]" />
                </button>
            </div>
            <p className="text-[#141414CC] text-[16px] font-inter leading-relaxed whitespace-pre-line">
                {profile.about || "No about/experience added yet. Click edit to add a short bio or experience summary."}
            </p>
        </div>
    );
};