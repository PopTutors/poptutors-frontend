import { ChevronDown, Star } from 'lucide-react';
import { FeedbackIcon } from '../../../../assets/managers';

const ReviewTab = () => {
  const reviews = [
    {
      id: 1,
      name: 'Guy Hawkins',
      timeAgo: '1 week ago',
      rating: 5,
      review:
        'I appreciate the precise short videos (10 mins or less each) because overly long videos tend to make me lose focus. The instructor is very knowledgeable in Web Design and it shows as he shares his knowledge. These were my best 6 months of training. Thanks, Yako.',
      avatar: FeedbackIcon,
    },
    {
      id: 2,
      name: 'Guy Hawkins',
      timeAgo: '1 week ago',
      rating: 5,
      review:
        'I appreciate the precise short videos (10 mins or less each) because overly long videos tend to make me lose focus. The instructor is very knowledgeable in Web Design and it shows as he shares his knowledge. These were my best 6 months of training. Thanks, Yako.',
      avatar: FeedbackIcon,
    },
    {
      id: 3,
      name: 'Guy Hawkins',
      timeAgo: '1 week ago',
      rating: 5,
      review:
        'I appreciate the precise short videos (10 mins or less each) because overly long videos tend to make me lose focus. The instructor is very knowledgeable in Web Design and it shows as he shares his knowledge. These were my best 6 months of training. Thanks, Yako.',
      avatar: FeedbackIcon,
    },
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating ? 'fill-orange-400 text-orange-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="bg-[#fafafa] border border-[rgba(20,20,20,0.1)] p-6">
      {/* Header with filters */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[24px] font-semibold text-gray-900">Students Feedbacks</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 cursor-pointer">
            <span className="text-[16px] text-gray-600">Service Type</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 cursor-pointer">
            <span className="text-[16px] text-gray-600">5 Star Rating</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Average Rating */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-[20px] text-[#141414] font-thin">Average Rating</span>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
          <span className="font-semibold text-[#1D2026] text-[16px]">4.8</span>
          <span className="text-[14px] text-[#8E8E93]">(134,633 review)</span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div
            key={review.id}
            className={`flex gap-3 ${index !== reviews.length - 1 && 'border-b pb-4'}`}
          >
            <img
              src={review.avatar || '/placeholder.svg'}
              alt={review.name}
              className="w-[40px] h-[40px] rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-[14px] text-gray-900">{review.name}</span>
                <span className="text-[12px] text-[#6E7485]">• {review.timeAgo}</span>
              </div>
              <div className="flex items-center gap-1 mb-2">{renderStars(review.rating)}</div>
              <p className="text-[14px] text-gray-700 leading-relaxed">{review.review}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewTab;
