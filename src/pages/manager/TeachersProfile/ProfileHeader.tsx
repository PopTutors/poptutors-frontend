import React from "react";
import {
  HiringFile,
  LiveHelp,
  Person,
  ProfileEdit,
  Rating,
  Sessions,
  Students,
} from "../../../assets/managers";

interface ProfileHeaderProps {
  profile?: {
    profileImage?: string;
    userId?: { name?: string };
    experience?: { title?: string; company?: string }[];
    avgRating?: number;
    reviews?: any[];
    studentsCount?: number;
    liveHelpCount?: number;
    assignmentsCount?: number;
    sessionsCount?: number;
  };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  return (
    <div className="p-6 mb-6 ">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Profile Image */}
        <div className="relative flex-shrink-0">
          <img
            src={profile?.profileImage || Person}
            alt="Profile"
            className="w-40 h-40 md:w-[160px] md:h-[160px] rounded-full object-cover"
          />
          <img
            src={ProfileEdit}
            alt="Edit"
            className="w-10 h-10 absolute bottom-2 right-2 bg-white border border-gray-200 rounded-full cursor-pointer"
          />
        </div>

        {/* Info and Stats */}
        <div className="flex-1 w-full">
          {/* Name & Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-3 text-center md:text-left">
            <h1 className="text-[24px] font-semibold text-gray-900 truncate max-w-full">
              {profile?.userId?.name || "John Doe"}
            </h1>
            <span className="mt-1 sm:mt-0 bg-[#26A4FF0D] text-[#019ACB] border border-[#26A4FF] text-[12px] px-2 py-1 rounded-full whitespace-nowrap inline-block">
              Top Rated
            </span>
          </div>

          {/* Designation */}
          <p className="text-[18px] mb-4 text-[#141414] truncate max-w-full text-center md:text-left">
            {profile?.experience?.[0]?.title || "Product Designer"} at{" "}
            <span>{profile?.experience?.[0]?.company || "Company"}</span>
          </p>

          {/* Stats Row */}
          <div className="flex flex-col xs:flex-row gap-4 justify-center md:justify-start">
            {/* First row */}
            <div className="flex flex-wrap items-center gap-1 text-sm text-gray-700 mb-3 justify-center md:justify-start">
              <div className="flex items-center gap-1 px-3">
                <img src={Rating} alt="Rating" className="w-6 h-6" />
                <span className="font-semibold text-[16px]">
                  {profile?.avgRating?.toFixed(1) || "4.8"}
                </span>
                <span className="text-[#595959] text-[14px]">
                  ({profile?.reviews?.length || "134,633"} reviews)
                </span>
              </div>
              <span className="hidden md:inline-block text-gray-300">|</span>
              <div className="flex items-center gap-1 px-3">
                <img src={Students} alt="Students" className="w-6 h-6" />
                <span className="font-semibold text-[16px]">
                  {profile?.studentsCount?.toLocaleString() || "43,034"}
                </span>
                <span className="text-[#595959] text-[14px]">students</span>
              </div>
              <span className="hidden md:inline-block text-gray-300">|</span>
              <div className="flex items-center gap-1 px-3">
                <img src={LiveHelp} alt="Live Help" className="w-6 h-6" />
                <span className="font-semibold text-[16px]">
                  {profile?.liveHelpCount || "7"}
                </span>
                <span className="text-[#595959] text-[14px]">Live help</span>
              </div>
            </div>

            {/* Second row */}
            <div className="flex flex-wrap items-center gap-1 text-sm text-gray-700 justify-center md:justify-start">
              <div className="flex items-center gap-1 px-3">
                <img src={HiringFile} alt="Assignments" className="w-6 h-6" />
                <span className="font-semibold text-[16px]">
                  {profile?.assignmentsCount || "678"}
                </span>
                <span className="text-[#595959] text-[14px]">
                  Completed Assignments
                </span>
              </div>
              <span className="hidden md:inline-block text-gray-300">|</span>
              <div className="flex items-center gap-1 px-3">
                <img src={Sessions} alt="Sessions" className="w-6 h-6" />
                <span className="font-semibold text-[16px]">
                  {profile?.sessionsCount || "148"}
                </span>
                <span className="text-[#595959] text-[14px]">Sessions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
