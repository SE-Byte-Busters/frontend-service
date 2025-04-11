"use client";

import { Icon } from "@/components/Icon";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
  setRating?: (rating: number) => void;
  interactive?: boolean;
  className?: string;
}

export const StarRating = ({
  rating,
  setRating,
  interactive = false,
  className
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleClick = (value: number) => {
    if (interactive && setRating) {
      setRating(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null);
    }
  };

  const stars = [];
  const displayRating = hoverRating !== null ? hoverRating : rating;

  for (let i = 1; i <= 5; i++) {
    const starValue = i * 2;
    const isFilled = displayRating >= starValue;
    const isHalfFilled = displayRating >= starValue - 1 && displayRating < starValue;

    if (isFilled) {
      stars.push(
        <div
          key={i}
          onClick={() => handleClick(starValue)}
          onMouseEnter={() => handleMouseEnter(starValue)}
          onMouseLeave={handleMouseLeave}
          className={`${interactive ? 'cursor-pointer' : ''}`}
        >
          <Icon
            name="Star"
            className="w-5 h-5 fill-yellow-500 text-yellow-500"
          />
        </div>
      );
    } else if (isHalfFilled) {
      stars.push(
        <div
          key={i}
          onClick={() => handleClick(starValue - 1)}
          onMouseEnter={() => handleMouseEnter(starValue - 1)}
          onMouseLeave={handleMouseLeave}
          className={`relative inline-block ${interactive ? 'cursor-pointer' : ''}`}
        >
          <Icon name="Star" className="w-5 h-5 fill-gray-300 text-gray-300" />
          <Icon name="StarHalf" className="w-5 h-5 absolute top-0 left-0 fill-yellow-500 text-yellow-500" />
        </div>
      );
    } else {
      stars.push(
        <div
          key={i}
          onClick={() => handleClick(starValue)}
          onMouseEnter={() => handleMouseEnter(starValue)}
          onMouseLeave={handleMouseLeave}
          className={`${interactive ? 'cursor-pointer' : ''}`}
        >
          <Icon
            name="Star"
            className="w-5 h-5 fill-gray-300 text-gray-300"
          />
        </div>
      );
    }
  }

  return (
    <div
      className={`flex flex-row-reverse ${className}`}
      onMouseLeave={interactive ? handleMouseLeave : undefined}
    >
      {stars}
    </div>
  );
};
