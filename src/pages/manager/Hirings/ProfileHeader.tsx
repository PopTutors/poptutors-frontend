import { Star, Users, Eye, FileText, Calendar } from 'lucide-react';
import {
  HiringFile,
  LiveHelp,
  Person,
  ProfileEdit,
  Rating,
  Sessions,
  Students,
} from '../../../assets/managers';

const ProfileHeader = () => {
  return (
    <div className="bg-white p-6 mb-6">
      <div className="flex items-center gap-6">
        {/* Profile Image */}
        <div className="relative">
          <img
            src={Person}
            alt="Jake Gyll"
            className="w-[160px] h-[160px] rounded-full object-cover"
          />
          <img
            src={ProfileEdit}
            alt="Edit"
            className="w-10 h-10 absolute bottom-2 right-2 bg-white border border-gray-200 rounded-full"
          />
        </div>
        {/* Info and Stats */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <h1 className="text-[24px] font-semibold text-gray-900">Jake Gyll</h1>
            <span className="text-center  bg-[#26A4FF0D] text-[#019ACB] border border-[#26A4FF] text-[12px] px-2 py-1 rounded-full w-[93px] h-[29px]">
              Top Rated
            </span>
          </div>
          <p className="text-[18px] mb-4 text-[#141414] text-400">
            Product Designer at <span className="text-[#141414]">Twitter</span>
          </p>
          {/* Stats Row */}
          <div className="flex flex-col gap-4 xs:flex-row">
            <div className="flex items-center gap-0 text-sm text-gray-700 mb-3">
              <div className="flex items-center gap-1 px-3">
                <img src={Rating} alt="Rating" className="w-[24px] h-[24px]" />
                <span className="font-semibold text-[16px]">4.8</span>
                <span className="text-[#595959] text-[14px]">(134,633 review)</span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1 px-3">
                <img src={Students} alt="Rating" className="w-[24px] h-[24px]" />
                <span className="font-semibold text-[16px]">43034</span>
                <span className="text-[#595959] text-[14px]">students</span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1 px-3">
                <img src={LiveHelp} alt="Rating" className="w-[24px] h-[24px]" />
                <span className="font-semibold text-[16px]">7</span>
                <span className="text-[#595959] text-[14px]">Live help</span>
              </div>
            </div>
            <div className="flex items-center gap-0 text-sm text-gray-700">
              <div className="flex items-center gap-1 px-3">
                <img src={HiringFile} alt="Rating" className="w-[24px] h-[24px]" />
                <span className="font-semibold text-[16px]">678</span>
                <span className="text-[#595959] text-[14px]">Completed Assignments</span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1 px-3">
                <img src={Sessions} alt="Rating" className="w-[24px] h-[24px]" />
                <span className="font-semibold text-[16px]">148</span>
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
