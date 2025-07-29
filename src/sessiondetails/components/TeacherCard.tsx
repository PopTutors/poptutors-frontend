import React from 'react';

type TeacherCardProps = {
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
};

const TeacherCard: React.FC<TeacherCardProps> = ({ name, price, rating, reviews, image }) => {
  return (
    <div className="flex mt-4  justify-between  rounded-lg w-full max-w-4xl">
      {/* Left */}
      <div className="flex items-center gap-4">
        <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover" />
        <div className="text-sm">
          <div className="text-gray-700 text-[16px] text-[#6e7485] font-inter font-regular">
            {name}
            <button className="text-[#009FDB] ml-2 text-sm font-semibold hover:underline">
              View Profile
            </button>
          </div>
          <div className="flex items-center gap-2 mt-1 text-sm">
            <span className="bg-[#009FDB] text-white px-2 py-[2px] rounded font-inter font-medium text-[15px]">
              ${price}
            </span>
            <span>•</span>
            <span className="text-[#FFA534]">★</span>
            <span className="text-black font-semibold">{rating}</span>
            <span className="text-gray-500 text-xs">({reviews.toLocaleString()} Rating)</span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-start gap-4 ">
        <button className="border border-[#009FDB] text-[#009FDB] text-[14px] font-semibold px-4 py-1 rounded-full hover:bg-blue-50 transition">
          Select
        </button>
      </div>
    </div>
  );
};

export default TeacherCard;
