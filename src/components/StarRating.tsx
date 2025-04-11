"use client";

import { Icon } from "@/components/Icon";

interface StarRatingProps {
  rating: number;
  className?: string;
}

export const StarRating = ({ rating, className }: StarRatingProps) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if ((rating / 2) >= i) {
      stars.push(
        <Icon
          name="Star"
          key={i}
          className="w-5 h-5 fill-yellow-500 text-yellow-500"
        />
      );
    } else if ((rating / 2) >= i - 0.5) {
      stars.push(
        <div key={i} className="relative inline-block">
          <Icon name="Star" className="w-5 h-5 fill-gray-300 text-gray-300" />
          <Icon name="StarHalf" className="w-5 h-5 absolute top-0 left-0 fill-yellow-500 text-yellow-500" />
        </div>
      );
    } else {
      stars.push(
        <Icon
          name="Star"
          key={i}
          className="w-5 h-5 fill-gray-300 text-gray-300"
        />
      );
    }
  }

  return <div className={`flex flex-row-reverse ${className}`}>{stars}</div>;
};
