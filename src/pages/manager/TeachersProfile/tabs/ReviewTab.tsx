import React from "react";
import { ChevronDown, Star } from "lucide-react";
import { FeedbackIcon } from "../../../../assets/managers";

interface ReviewTabProps {
  profile?: {
    avgRating?: number;
    reviews?: {
      id?: string | number;
      byUser?: { name?: string; profileImage?: string };
      rating: number;
      comment: string;
      serviceType?: "assignment" | "session" | "liveHelp";
      createdAt?: string;
    }[];
  };
}

const ReviewTab: React.FC<ReviewTabProps> = ({ profile }) => {
  const reviews =
    profile?.reviews && profile.reviews.length > 0
      ? profile.reviews
      : [
        {
          id: 1,
          byUser: { name: "Guy Hawkins", profileImage: FeedbackIcon },
          rating: 5,
          comment:
            "I appreciate the precise short videos (10 mins or less each) because overly long videos tend to make me lose focus. The instructor is very knowledgeable in Web Design and it shows as he shares his knowledge. These were my best 6 months of training. Thanks, Yako.",
          createdAt: "1 week ago",
        },
        {
          id: 2,
          byUser: { name: "Jane Cooper", profileImage: FeedbackIcon },
          rating: 4,
          comment:
            "Great content overall, but I wish there were more hands-on projects. Still, the instructor’s explanations were very clear.",
          createdAt: "2 weeks ago",
        },
      ];

  const avgRating =
    profile?.avgRating ||
    (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
      reviews.length || 0);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating
          ? "fill-orange-400 text-orange-400"
          : "text-gray-300"
          }`}
      />
    ));

  return (
    <div className="bg-white p-6 mb-6 shadow-sm ">
      {/* Header with filters */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[24px] font-semibold text-gray-900">
          Students Feedback
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 cursor-pointer rounded-md">
            <span className="text-[16px] text-gray-600">Service Type</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 cursor-pointer rounded-md">
            <span className="text-[16px] text-gray-600">Rating</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Average Rating */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-[20px] text-[#141414] font-medium">
          Average Rating
        </span>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
          <span className="font-semibold text-[#1D2026] text-[16px]">
            {avgRating.toFixed(1)}
          </span>
          <span className="text-[14px] text-[#8E8E93]">
            ({reviews.length} reviews)
          </span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div
            key={review.id || index}
            className={`flex gap-3 ${index !== reviews.length - 1 ? "border-b pb-4" : ""
              }`}
          >
            <img
              src={review.byUser?.profileImage || FeedbackIcon}
              alt={review.byUser?.name || "User"}
              className="w-12 h-12 rounded-full object-cover border border-gray-200"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-[16px] text-gray-900">
                  {review.byUser?.name || "Anonymous"}
                </span>
                {review.createdAt && (
                  <span className="text-[14px] text-[#6E7485]">
                    • {review.createdAt}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mb-2">
                {renderStars(review.rating)}
              </div>
              <p className="text-[14px] text-gray-700 leading-relaxed">
                {review.comment}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewTab;
