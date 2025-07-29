// components/ProfileHeader.tsx

import { Pencil } from 'lucide-react';
import profile_pic from '../../assets/user_profile.png';

const ProfileHeader = () => {
  return (
    <div className="bg-white rounded-xl shadow p-6 text-center relative">
      <div className="flex justify-start mb-3">
        <div className="relative">
          <img
            src={profile_pic} // change path if needed
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-white shadow"
          />
          <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer">
            <Pencil className="w-3 h-3 text-gray-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-5 relative w-full max-w-md">
        {/* One Edit Button at Top Right */}
        <button className="absolute top-4 right-4 flex items-center gap-1 text-xs text-gray-600 bg-blue-100 px-2 py-1 rounded-full hover:bg-blue-200">
          <Pencil className="w-3 h-3" />
          Edit
        </button>

        <div className="space-y-6 text-sm text-left text-gray-800">
          <div>
            <p className="text-xs text-gray-500">Your Name</p>
            <p className="font-semibold">Alexa Jhon</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="font-semibold">alexajhon@gmail.com.com</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Phone Number</p>
            <p className="font-semibold">+91 49652845732</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Country</p>
            <p className="font-semibold">USA</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-5 relative w-full max-w-md mt-4">
        {/* Edit Button */}
        <button className="absolute top-4 right-4 flex items-center gap-1 text-xs text-gray-600 bg-blue-100 px-2 py-1 rounded-full hover:bg-blue-200">
          <Pencil className="w-3 h-3" />
          Edit
        </button>

        <h2 className="text-sm font-semibold text-left text-gray-800">
          About <span className="text-sky-500">Alexa</span>
        </h2>

        <p className="text-sm text-gray-500 mt-2 text-left leading-relaxed">
          Lorem ipsum dolor sit amet consectetur. Erat auctor a aliquam vel congue luctus. Leo diam
          cras neque mauris ac arcu elit ipsum dolor sit amet consectetur.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-5 w-full max-w-md mt-4">
        <h2 className="text-lg font-semibold text-left text-gray-800 mb-4">Wallet</h2>

        {/* Payment Details Row */}
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-medium text-gray-800">Payment Details</p>
          <span className="bg-green-200 text-green-800 text-xs px-3 py-1 rounded-full">
            Verified
          </span>
        </div>

        {/* KYC Details Row */}
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-gray-800">
            KYC Details <span className="text-gray-400 font-normal text-sm ml-1">Optional</span>
          </p>
          <button className="bg-blue-100 text-gray-700 text-xs px-3 py-1 rounded-full hover:bg-blue-200">
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
