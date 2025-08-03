import React from 'react';

interface RatingStarsProps {
  rating: number; // Example: 4.5, 3.0, etc.
  outOf?: number; // Total number of stars
  starImage: string; // Path to your star image
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, outOf = 5, starImage }) => {
  const stars = [];

  for (let i = 0; i < outOf; i++) {
    const isFull = i + 1 <= rating;
    const isHalf = !isFull && i + 0.5 <= rating;

    if (isFull) {
      stars.push(<img key={i} src={starImage} alt="star" className="w-8 h-8" />);
    } else if (isHalf) {
      stars.push(
        <div key={i} className="relative w-8 h-8">
          {/* Empty outlined star */}
          <img src={starImage} alt="empty star" className="w-full h-full opacity-20" />
          {/* Half-filled star overlay */}
          <img
            src={starImage}
            alt="half star"
            className="absolute top-0 left-0 w-full h-full"
            style={{ clipPath: 'inset(0 50% 0 0)' }}
          />
        </div>
      );
    } else {
      stars.push(<img key={i} src={starImage} alt="empty star" className="w-8 h-8 opacity-20" />);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div>
        <div className="flex items-center gap-1">{stars}</div>
        <span className="text-[12px] font-poppinsregular text-gray-500">Based on the Session</span>
      </div>
      <div className="flex items-end gap-1 h-12">
        <div className="flex items-center justify-end h-12">
          <span className="text-3xl font-poppinssemibold text-[#FD8E1F]">{rating.toFixed(1)}</span>
        </div>
        <span className="text-[12px] font-poppinsregular">Out of {outOf}</span>
      </div>
    </div>
  );
};

export default RatingStars;
