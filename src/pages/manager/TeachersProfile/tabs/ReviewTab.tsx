import React, { useState } from "react";
import { ChevronDown, Star, Check } from "lucide-react";
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
  // State for filters
  const [selectedServiceType, setSelectedServiceType] = useState < string | null > (null);
  const [selectedRating, setSelectedRating] = useState < number | null > (null);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [ratingDropdownOpen, setRatingDropdownOpen] = useState(false);

  const serviceTypes = ["assignment", "session", "liveHelp"];
  const ratings = [5, 4, 3, 2, 1];

  // Default reviews if none from profile
  const defaultReviews = [
    {
      id: 1,
      byUser: { name: "Guy Hawkins", profileImage: FeedbackIcon },
      rating: 5,
      comment:
        "I appreciate the precise short videos (10 mins or less each) because overly long videos tend to make me lose focus. The instructor is very knowledgeable in Web Design and it shows as he shares his knowledge. These were my best 6 months of training. Thanks, Yako.",
      createdAt: "1 week ago",
      serviceType: "session",
    },
    {
      id: 2,
      byUser: { name: "Jane Cooper", profileImage: FeedbackIcon },
      rating: 4,
      comment:
        "Great content overall, but I wish there were more hands-on projects. Still, the instructor’s explanations were very clear.",
      createdAt: "2 weeks ago",
      serviceType: "assignment",
    },
  ];

  // Reviews source
  const reviews = profile?.reviews && profile.reviews.length > 0 ? profile.reviews : [];

  // Filter reviews based on filters
  const filteredReviews = reviews.filter((r) => {
    const serviceMatch = selectedServiceType ? r.serviceType === selectedServiceType : true;
    const ratingMatch = selectedRating ? r.rating >= selectedRating : true;
    return serviceMatch && ratingMatch;
  });

  const avgRating =
    profile?.avgRating ||
    (filteredReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / filteredReviews.length || 0);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating ? "fill-orange-400 text-orange-400" : "text-gray-300"}`}
      />
    ));

  return (
    <div className="bg-white p-4 sm:p-6 mb-6 shadow-sm relative">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h2 className="text-xl sm:text-[24px] font-semibold text-gray-900">Students Feedback</h2>

        <div className="flex gap-4 flex-wrap">

          {/* Service Type Dropdown */}
          <div className="relative">
            <button
              onClick={() => setServiceDropdownOpen((open) => !open)}
              className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 rounded-md cursor-pointer whitespace-nowrap"
            >
              <span className="text-base sm:text-[16px] text-gray-600">
                {selectedServiceType ? selectedServiceType : "Service Type"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {serviceDropdownOpen && (
              <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto text-base sm:text-sm">
                <li
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => {
                    setSelectedServiceType(null);
                    setServiceDropdownOpen(false);
                  }}
                >
                  <span>All Services</span>
                  {!selectedServiceType && <Check className="w-4 h-4 text-green-600" />}
                </li>
                {serviceTypes.map((type) => (
                  <li
                    key={type}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center gap-2 capitalize"
                    onClick={() => {
                      setSelectedServiceType(type);
                      setServiceDropdownOpen(false);
                    }}
                  >
                    <span>{type}</span>
                    {selectedServiceType === type && <Check className="w-4 h-4 text-green-600" />}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Rating Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRatingDropdownOpen((open) => !open)}
              className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 rounded-md cursor-pointer whitespace-nowrap"
            >
              <span className="text-base sm:text-[16px] text-gray-600">
                {selectedRating ? `${selectedRating}+ Stars` : "Rating"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {ratingDropdownOpen && (
              <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto text-base sm:text-sm">
                <li
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => {
                    setSelectedRating(null);
                    setRatingDropdownOpen(false);
                  }}
                >
                  <span>All Ratings</span>
                  {!selectedRating && <Check className="w-4 h-4 text-green-600" />}
                </li>
                {ratings.map((rating) => (
                  <li
                    key={rating}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => {
                      setSelectedRating(rating);
                      setRatingDropdownOpen(false);
                    }}
                  >
                    <span>{rating}+ Stars</span>
                    {selectedRating === rating && <Check className="w-4 h-4 text-green-600" />}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Average Rating */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-6">
        <span className="text-lg sm:text-[20px] text-[#141414] font-medium">
          Average Rating
        </span>
        <div className="flex items-center gap-1">
          <Star className="w-5 h-5 fill-orange-400 text-orange-400" />
          <span className="font-semibold text-[#1D2026] text-lg sm:text-[16px]">
            {avgRating.toFixed(1)}
          </span>
          <span className="text-[14px] text-[#8E8E93]">({filteredReviews.length} reviews)</span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6 max-h-[60vh] overflow-auto pr-2">
        {filteredReviews.map((review, index) => (
          <div
            key={review.id || index}
            className={`flex flex-col sm:flex-row gap-3 ${index !== filteredReviews.length - 1 ? "border-b pb-4" : ""
              }`}
          >
            <img
              src={review.byUser?.profileImage || FeedbackIcon}
              alt={review.byUser?.name || "User"}
              className="w-12 h-12 rounded-full object-cover border border-gray-200"
            />
            <div className="flex-1 flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 mb-1 flex-wrap">
                <span className="font-semibold text-[16px] text-gray-900">
                  {review.byUser?.name || "Anonymous"}
                </span>
                {review.createdAt && (
                  <span className="text-[14px] text-[#6E7485]">• {review.createdAt}</span>
                )}
              </div>
              <div className="flex items-center gap-1 mb-2">{renderStars(review.rating)}</div>
              <p className="text-[14px] text-gray-700 leading-relaxed whitespace-pre-line">
                {review.comment}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div>{reviews.length === 0 && "No reviews Yet"}</div>
    </div>
  );
};

export default ReviewTab;
