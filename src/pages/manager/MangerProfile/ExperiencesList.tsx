import React from "react";
import { Plus, Edit2 } from "lucide-react";
import { formatDate } from "../../../utils/formatDate.utils";
import { DarkAddIcon, ManagerEditIcon } from "../../../assets/managers";

interface ExperienceListProps {
    experiences: any[];
    onAddItem: () => void;                 // open add experience item dialog
    onEditItem: (idx: number) => void;     // open edit dialog for a specific index
    onEditAll?: () => void;                // optional: open the old "edit all" dialog
}

export const ExperienceList: React.FC<ExperienceListProps> = ({
    experiences,
    onAddItem,
    onEditItem,
    onEditAll
}) => {
    return (
        <div className="bg-white shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-[20px] font-inter font-semibold text-gray-900">Experiences</h2>

                <div className="flex items-center gap-2">

                    {/* add item */}
                    <button
                        className="p-2 rounded hover:bg-gray-100"
                        onClick={onAddItem}
                        aria-label="Add experience"
                    >
                        <img src={DarkAddIcon} className="w-[24px] h-[24px]" />

                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {experiences.length > 0 ? (
                    experiences.map((xp, idx) => (
                        <div key={idx} className="pt-3 pb-4 border-b last:border-b-0">
                            <div className="flex gap-3">
                                <div className="w-[80px] h-[80px] rounded-full flex items-center justify-center bg-gray-100 flex-shrink-0 overflow-hidden">
                                    <div className="text-xs font-semibold text-gray-600">
                                        {xp.company?.slice(0, 2).toUpperCase()}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div className="min-w-0">
                                            <h3 className="text-[18px] font-inter font-semibold text-gray-900 truncate mb-2">{xp.title}</h3>
                                            <div className="mt-0.5 text-sm text-gray-700">
                                                <span className="mr-1 font-inter text-[16px] text-[#141414] font-medium">{xp.company}</span>
                                                {xp.employmentType && <span className="mx-1">•</span>}
                                                {xp.employmentType && <span className="mr-1 font-inter text-[16px] text-[#595959] font-regular">{xp.employmentType}</span>}
                                                {(xp.employmentType || xp.startDate) && <span className="mx-1">•</span>}
                                                {xp.startDate && (
                                                    <span className="mr-1 font-inter text-[16px] text-[#595959] font-regular">
                                                        {formatDate(xp.startDate)}{xp.endDate ? ` - ${formatDate(xp.endDate)}` : ""}
                                                    </span>
                                                )}
                                                {xp.duration && <span className="mx-1">•</span>}
                                                {xp.duration && <span>{xp.duration}</span>}
                                            </div>
                                            <div className="text-[16px] text-[#7C8493] whitespace-nowrap hidden md:block mt-2">
                                                {xp.location}
                                            </div>
                                        </div>

                                        {/* edit button for this item */}
                                        <div className="ml-3 flex-shrink-0">
                                            <button
                                                className="p-2 hover:bg-gray-100 rounded"
                                                onClick={() => onEditItem(idx)}
                                                aria-label={`Edit experience ${idx + 1}`}
                                            >
                                                <img src={ManagerEditIcon} className="w-[24px] h-[24px]" />
                                            </button>
                                        </div>
                                    </div>

                                    {xp.description && (
                                        <p className="text-[16px] font-inter font-normal text-[#434343] mt-4 leading-relaxed">
                                            {xp.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No experiences added yet.</p>
                )}
            </div>
        </div>
    );
};
