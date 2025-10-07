import React from "react";
import { ManagerEditIcon } from "../../../assets/managers";

interface SkillsSectionProps {
    skills: string[];
    onEdit: () => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
    skills,
    onEdit
}) => {
    return (
        <div className="bg-white p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-[20px] font-semibold text-[#141414]">Skills</h2>
                <button
                    onClick={onEdit}
                    className="p-2 hover:bg-gray-100"
                >
                    <img src={ManagerEditIcon} alt="Edit" className="w-[24px] h-[24px]" />
                </button>
            </div>
            {skills && skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                        <span
                            key={index}
                            className="font-medium font-poppins text-[16px] bg-[#019ACB14] text-primary px-[12px] py-[4px]"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            ) : (
                <p className="text-[14px] text-gray-500 italic">No skills added yet.</p>
            )}
        </div>
    );
};