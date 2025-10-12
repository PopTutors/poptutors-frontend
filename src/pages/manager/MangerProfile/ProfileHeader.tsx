import React from "react";
import { Button } from "../../../components/ui/button";
import { MapPin } from "lucide-react";
import { HeaderProfile, LocationIcon, Person } from "../../../assets/managers";

interface ProfileHeaderProps {
    profile: any;
    experiences: any[];
    onEditProfile: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    profile,
    experiences,
    onEditProfile
}) => {
    const cancelButtonClass = "m-0 w-[164px] h-[50px] -none text-[16px] font-semibold bg-[#fff] hover:bg-gray-50";

    return (
        <div className="bg-white shadow-sm mb-6 xs:h-[400px]">
            <img src={HeaderProfile} className="w-full h-[130px] object-cover" />
            <div className="px-4 sm:px-6 lg:px-8 pb-6">
                <div className="flex flex-col md:flex-row gap-6 -mt-16 items-center md:items-start">
                    <div className="relative flex-shrink-0">
                        <div className="w-[140px] h-[140px] sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-8 border-white bg-white overflow-hidden">
                            <img
                                src={profile.profileImage || Person}
                                alt={profile.userId?.name || "User"}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <div className="flex-1 mt-4 md:mt-16 pt-0 md:pt-2 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-gray-900 leading-tight">
                                    {profile.userId?.name || "No name provided"}
                                </h1>
                                <p className="text-[18px] text-[#141414] font-epilogue leading-[160%] font-medium mt-1 sm:mt-2 truncate max-w-xs md:max-w-full">
                                    {experiences.length > 0
                                        ? `${experiences[0].title} at ${experiences[0].company}`
                                        : "Member"}
                                </p>
                                <div className="flex items-center gap-1 mt-1 sm:mt-2 justify-center md:justify-start">
                                    <img src={LocationIcon} />
                                    <span className="text-[16px] font-inter text-[#595959]">{profile.country || "Unknown location"}</span>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                className={`${cancelButtonClass} text-[16px] font-inter font-medium text-primary w-full md:w-auto mt-4 md:mt-0`}
                                onClick={onEditProfile}
                            >
                                Edit Profile
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};