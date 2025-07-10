// components/CollegeInfo.tsx
import React from "react";
import { FaBriefcase, FaDigitalTachograph, FaPaperPlane, FaStar, FaSyncAlt } from "react-icons/fa";

const CollegeInfo = () => {
    const tags = [
        { label: "Career", icon: <FaBriefcase className="text-green-500" /> },
        { label: "Digital", icon: <FaDigitalTachograph className="text-green-500" /> },
        { label: "Stock", icon: <FaSyncAlt className="text-purple-500" /> },
        { label: "Mortgage", icon: <FaSyncAlt className="text-purple-500" /> },
    ];

    const reviews = [
        {
            name: "Ankit Srivastava",
            stars: 4,
            comment:
                "excelent conversation with him.. very knowledgeble personhappy to talk towith him",
        },
        {
            name: "Ankit Srivastava",
            stars: 4,
            comment:
                "excelent conversation with him.. very knowledgeble personhappy to talk towith him",
        },
    ];


    return (
        <div className="bg-white rounded-xl shadow p-5 w-full h-full">
            <label className="text-sm font-poppinsmedium text-gray-700 block mb-2">
                College & Institute
            </label>
            <div className="relative">
                <input
                    type="text"
                    value="IIT Madras - Indian Institute of Technology - [IITM], Chennai"
                    className="w-full font-poppinsregular border rounded-lg px-4 py-3 pr-12 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-300 to-purple-700 flex items-center justify-center">
                        <FaStar className="text-white text-xs" />
                    </div>
                </div>
            </div>

            <div className=" mt-4">
                <label className="text-sm font-poppinsmedium text-gray-700 block mb-3">
                    Academic Interests
                </label>
                <div className="flex flex-wrap gap-3">
                    {tags.map((tag, idx) => (
                        <div
                            key={idx}
                            className="flex items-center border rounded-full px-3 py-1 text-sm text-gray-700"
                        >
                            <span className="mr-2">{tag.icon}</span>
                            {tag.label}
                        </div>
                    ))}
                </div>
            </div>

            <div className="border border-gray-200 shadow-sm rounded-xl mt-4 flex">
                <div className="flex-1 p-4">
                    <p className="font-poppinsmedium text-gray-800">Software Engineering</p>
                    <p className="text-sm font-poppinsregular text-gray-500">Backend Programming</p>
                </div>
                <div className="bg-cyan-600 w-12 flex items-center justify-center rounded-r-xl">
                    <div className="bg-blue-100 p-2 rounded-full">
                        <FaStar className="text-white text-xs" />
                    </div>
                </div>
            </div>

            <div className=" w-1/2 mt-4">
                <div className="flex font-poppinsmedium justify-between items-center text-sm text-gray-700 font-medium">
                    <span>Your Referral Code</span>
                    <button className="text-sky-600 font-semibold text-sm">+ Add Friends</button>
                </div>

                <div className="flex mt-4 items-center rounded-lg border overflow-hidden">
                    <div className="flex-1 p-3">
                        <p className="text-sky-600 font-semibold">ADY45698</p>
                        <p className="text-sm font-poppinsregular text-gray-500">Share it with your friends</p>
                    </div>
                    <div className="bg-sky-900 w-12 h-full flex items-center justify-center">
                        <FaPaperPlane className="text-white" />
                    </div>
                </div>
            </div>

            <div className="w-full max-w-2xl mt-6 space-y-3">
                <div className="flex justify-between items-center">
                    <p className="font-poppinsmedium text-sm text-gray-800">Teacher Reviews</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {reviews.map((review, idx) => (
                        <div
                            key={idx}
                            className="border rounded-xl p-4 text-sm text-gray-700 shadow-sm"
                        >
                            <p className="font-poppinsmedium text-indigo-700 mb-1">{review.name}</p>
                            <div className="flex mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className={`mr-1 ${i < review.stars ? "text-yellow-400" : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-gray-600 font-poppinsregular">{review.comment}</p>
                        </div>
                    ))}
                </div>
                <a className="text-sky-600 text-right  text-sm font-poppinsmedium cursor-pointer">
                    See all reviews
                </a>
            </div>
        </div>
    );
};

export default CollegeInfo;
