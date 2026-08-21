import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  rating: number;
  reviewsCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  reviewsCount,
  size = 'md',
  showCount = true,
}) => {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="inline-flex items-center gap-1">
      <Star className={`${iconSizes[size]} fill-[#F4B942] text-[#F4B942]`} />
      <span className={`font-bold text-[#17231A] ${textSizes[size]}`}>
        {rating.toFixed(1)}
      </span>
      {showCount && reviewsCount !== undefined && (
        <span className={`text-gray-500 font-normal ${textSizes[size]}`}>
          ({reviewsCount})
        </span>
      )}
    </div>
  );
};
