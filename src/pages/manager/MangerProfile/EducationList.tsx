import React from "react";
import { Plus, Edit2 } from "lucide-react";
import { AddIcon, DarkAddIcon, ManagerEditIcon } from "../../../assets/managers";

interface EducationListProps {
    education: any[];
    onAddItem: () => void;                 // open add education item dialog
    onEditItem: (idx: number) => void;     // open edit dialog for specific item
    onEditAll?: () => void;                // optional: open the old "edit all" dialog
}

export const EducationList: React.FC<EducationListProps> = ({
    education,
    onAddItem,
    onEditItem,
    onEditAll
}) => {
    return (
        <div className="bg-white shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-[20px] font-inter font-semibold">Education</h2>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onAddItem}
                        className="p-2 rounded hover:bg-gray-100"
                        aria-label="Add education"
                    >
                        <img src={DarkAddIcon} className="w-[24px] h-[24px]" />
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {education && education.length > 0 ? (
                    education.map((edu, idx) => (
                        <div key={idx} className="flex gap-3 pb-4 border-b last:border-none">
                            {/* Placeholder avatar */}
                            <div className="w-[80px] h-[80px] bg-gray-100 flex items-center justify-center flex-shrink-0 rounded">
                                <span className="text-xs font-semibold text-gray-600">
                                    {edu.institution?.slice(0, 3)?.toUpperCase() || "EDU"}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                    <div className="min-w-0">
                                        <h3 className="text-[18px] font-inter font-semibold text-[#141414] truncate opacity-[100%] mb-2">
                                            {edu.institution}
                                        </h3>
                                        <div className="text-[16px] text-[#595959] mt-0.5 gap-2 flex">
                                            <span>{edu.degree}{edu.fieldOfStudy && ` , ${edu.fieldOfStudy}`}{" "}</span>
                                            <span>|</span> <span> {edu.startYear ?? ""}</span>
                                            <span>{edu.endYear && ` - ${edu.endYear}`}</span>
                                        </div>
                                    </div>

                                    {/* Edit button */}
                                    <div className="ml-3 flex-shrink-0">
                                        <button
                                            className="p-2 hover:bg-gray-100 rounded"
                                            onClick={() => onEditItem(idx)}
                                            aria-label={`Edit education ${idx + 1}`}
                                        >
                                            <img src={ManagerEditIcon} className="w-[24px] h-[24px]" />
                                        </button>
                                    </div>
                                </div>

                                {edu.description && (
                                    <p className="text-[16px] font-inter text-[#434343] mt-4 leading-relaxed">
                                        {edu.description}
                                    </p>
                                )}
                                {/* {edu.currentlyStudying && (
                                    <span className="text-xs text-green-600 mt-1 inline-block">
                                        Currently studying
                                    </span>
                                )} */}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No education added yet.</p>
                )}
            </div>
        </div>
    );
};
