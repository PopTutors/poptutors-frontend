// src/components/StudentFeedbacks.tsx
import React from "react";
import { Star } from "lucide-react";

export interface Feedback {
    avatar: string;
    name: string;
    timeAgo: string;
    rating: number; // 1–5
    text: string;
}

const StudentFeedbacks: React.FC = () => {
    const feedbacks: Feedback[] = [
        {
            avatar: "https://randomuser.me/api/portraits/men/12.jpg",
            name: "John Doe",
            timeAgo: "2 days ago",
            rating: 5,
            text: "Excellent course! The explanations were clear and engaging. I learned a lot about React and backend integration. The hands-on examples made it easy to understand complex concepts, and I feel confident applying them in real projects. I especially appreciated the detailed walkthroughs of API integration and state management.",
        },
        {
            avatar: "https://randomuser.me/api/portraits/women/24.jpg",
            name: "Emily Smith",
            timeAgo: "1 week ago",
            rating: 4,
            text: "Very helpful content. The instructor kept things simple and structured. Would love to see more real-world examples, but the exercises provided were insightful and reinforced learning. The guidance on best practices for writing clean code was particularly valuable.",
        },
        {
            avatar: "https://randomuser.me/api/portraits/men/35.jpg",
            name: "Michael Brown",
            timeAgo: "3 weeks ago",
            rating: 5,
            text: "Loved it! The instructor made complex topics easy to understand. The hands-on approach was very effective, and the explanations of hooks and context API were excellent. I also learned useful tips for optimizing performance in React applications.",
        },
        {
            avatar: "https://randomuser.me/api/portraits/women/42.jpg",
            name: "Sophia Johnson",
            timeAgo: "1 month ago",
            rating: 5,
            text: "Perfect balance between theory and practice. Definitely one of the best learning experiences I’ve had online. I especially appreciated the section on component architecture and reusable patterns. The pace was just right, and the course materials are easy to refer back to.",
        },
        {
            avatar: "https://randomuser.me/api/portraits/men/50.jpg",
            name: "David Wilson",
            timeAgo: "2 months ago",
            rating: 4,
            text: "Informative and well-organized sessions. Could include a few more assignments for practice, but overall it gave me a solid understanding of fullstack development. The guidance on connecting React with Node.js APIs was particularly helpful.",
        },
        {
            avatar: "https://randomuser.me/api/portraits/women/66.jpg",
            name: "Olivia Garcia",
            timeAgo: "2 months ago",
            rating: 5,
            text: "Absolutely amazing! The examples were clear and concise. I’ll definitely recommend this course to my peers. The course also gave me confidence in tackling my own projects, and the tips for debugging and testing were very practical.",
        },
    ];

    const averageRating = (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1);

    return (
        // prevent double scrollbar
        <div className="bg-white p-7 shadow-sm h-full overflow-hidden">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl">Students Feedback</h2>
                <div className="flex gap-4">
                    <select className="px-3 py-1.5 bg-transparent border border-gray-300 text-gray-900 outline-none">
                        <option>Service Type</option>
                        <option>Web Development</option>
                        <option>UI/UX Design</option>
                        <option>Data Analytics</option>
                    </select>

                    <select className="px-3 py-1.5 bg-transparent border border-gray-300 text-gray-900 outline-none">
                        <option>5 Star Rating</option>
                        <option>4 Star Rating</option>
                        <option>3 Star Rating</option>
                    </select>
                </div>
            </div>

            {/* Average Rating Section */}
            <div className="flex items-center gap-2 mb-8 text-gray-700">
                <span className="text-base">Average Rating</span>
                <Star className="w-5 h-5 text-[#FD8E1F] fill-[#FD8E1F]" />
                <span className="font-semibold text-gray-900 text-lg">{averageRating}</span>
                <span className="text-sm ml-2">
                    ({feedbacks.length} reviews - 1,23,244 total reviews)
                </span>
            </div>

            {/* Feedback List */}
            <div className="flex flex-col gap-8 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {feedbacks.map((fb, idx) => (
                    <div
                        key={idx}
                        className="flex gap-5 pb-6 border-b border-gray-200 last:border-none"
                    >
                        {/* Avatar */}
                        <img
                            src={fb.avatar}
                            alt={fb.name}
                            className="w-14 h-14 object-cover rounded-full flex-shrink-0"
                        />

                        {/* Feedback Details */}
                        <div className="flex flex-col gap-2">
                            {/* Name and Time */}
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="font-medium text-gray-900">{fb.name}</span>
                                <span>• {fb.timeAgo}</span>
                            </div>

                            {/* Rating Stars (only filled stars) */}
                            <div className="flex items-center gap-1">
                                {Array.from({ length: fb.rating }).map((_, starIdx) => (
                                    <Star
                                        key={starIdx}
                                        className="w-4 h-4 text-[#FD8E1F] fill-[#FD8E1F]"
                                    />
                                ))}
                            </div>

                            {/* Feedback Text */}
                            <p className="text-gray-800 text-sm leading-relaxed mt-1">
                                {fb.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentFeedbacks;
