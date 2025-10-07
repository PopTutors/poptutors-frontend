import React from "react";
import { Mail, Phone, Globe } from "lucide-react";
import { LanguageIcon, MailIcon, ManagerEditIcon, PhoneIcon } from "../../../assets/managers";

interface AdditionalDetailsSectionProps {
    profile: any;
    onEdit: () => void;
}

export const AdditionalDetailsSection: React.FC<AdditionalDetailsSectionProps> = ({
    profile,
    onEdit
}) => {
    return (
        <div className="bg-white -lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-inter font-semibold text-gray-900">Additional Details</h2>
                <button
                    onClick={onEdit}
                    className="p-2 hover:bg-gray-100 -full"
                >
                    <img src={ManagerEditIcon} alt="Edit" className="w-[24px] h-[24px]" />
                </button>
            </div>
            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <img src={MailIcon} className="w-[20px] h-[20px] mt-0.5" />
                    <div className="flex-1">
                        <p className="text-[16px] font-inter text-[#595959] mb-1">Email</p>
                        <p className="text-[16px] font-inter text-[#141414] break-all">
                            {profile.userId?.email || "No email provided"}
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <img src={PhoneIcon} className="w-[20px] h-[20px] mt-0.5" />
                    <div className="flex-1">
                        <p className="text-[16px] font-inter text-[#595959] mb-1">Phone</p>
                        <p className="text-[16px] font-inter text-[#141414] ">{profile.mobile || "No phone number provided"}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <img src={LanguageIcon} className="w-[20px] h-[20px] mt-0.5" />
                    <div className="flex-1">
                        <p className="text-[16px] font-inter text-[#595959] mb-1">Languages</p>
                        <p className="text-[16px] font-inter text-[#141414]">{profile.preferredLanguage || "No language specified"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};