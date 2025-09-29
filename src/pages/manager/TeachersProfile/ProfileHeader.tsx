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
    name?: string;
    designation?: string;
    company?: string;
    avgRating?: number;
    reviewsCount?: number;
    studentsCount?: number;
    liveHelpCount?: number;
    assignmentsCount?: number;
    sessionsCount?: number;
  };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  return (
    <div className="bg-white p-6 mb-6 shadow-sm ">
      <div className="flex items-center gap-6">
        {/* Profile Image */}
        <div className="relative">
          <img
            src={profile?.profileImage || Person}
            alt={"Profile"}
            className="w-[160px] h-[160px] rounded-full object-cover"
          />
          <img
            src={ProfileEdit}
            alt="Edit"
            className="w-10 h-10 absolute bottom-2 right-2 bg-white border border-gray-200 rounded-full cursor-pointer"
          />
        </div>

        {/* Info and Stats */}
        <div className="flex-1">
          {/* Name & Badge */}
          <div className="flex items-center gap-2 mb-3">
            <h1 className="text-[24px] font-semibold text-gray-900">
              {profile?.name || "John Doe"}
            </h1>
            <span className="text-center bg-[#26A4FF0D] text-[#019ACB] border border-[#26A4FF] text-[12px] px-2 py-1 rounded-full">
              Top Rated
            </span>
          </div>

          {/* Designation */}
          <p className="text-[18px] mb-4 text-[#141414]">
            {profile?.designation || "Product Designer"} at{" "}
            <span className="text-[#141414]">
              {profile?.company || "Company"}
            </span>
          </p>

          {/* Stats Row */}
          <div className="flex flex-col gap-4 xs:flex-row">
            {/* First row */}
            <div className="flex items-center gap-0 text-sm text-gray-700 mb-3">
              <div className="flex items-center gap-1 px-3">
                <img src={Rating} alt="Rating" className="w-[24px] h-[24px]" />
                <span className="font-semibold text-[16px]">
                  {profile?.avgRating || "4.8"}
                </span>
                <span className="text-[#595959] text-[14px]">
                  ({profile?.reviewsCount || "134,633"} reviews)
                </span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1 px-3">
                <img src={Students} alt="Students" className="w-[24px] h-[24px]" />
                <span className="font-semibold text-[16px]">
                  {profile?.studentsCount || "43,034"}
                </span>
                <span className="text-[#595959] text-[14px]">students</span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1 px-3">
                <img src={LiveHelp} alt="Live Help" className="w-[24px] h-[24px]" />
                <span className="font-semibold text-[16px]">
                  {profile?.liveHelpCount || "7"}
                </span>
                <span className="text-[#595959] text-[14px]">Live help</span>
              </div>
            </div>

            {/* Second row */}
            <div className="flex items-center gap-0 text-sm text-gray-700">
              <div className="flex items-center gap-1 px-3">
                <img src={HiringFile} alt="Assignments" className="w-[24px] h-[24px]" />
                <span className="font-semibold text-[16px]">
                  {profile?.assignmentsCount || "678"}
                </span>
                <span className="text-[#595959] text-[14px]">
                  Completed Assignments
                </span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1 px-3">
                <img src={Sessions} alt="Sessions" className="w-[24px] h-[24px]" />
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
