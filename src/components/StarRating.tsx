"use client";

import { Icon } from "@/components/Icon";
import { useCallback, useState } from "react";

interface StarRatingProps {
  rating: number; // Expected 0–5 from API
  setRating?: (rating: number) => void;
  interactive?: boolean;
  className?: string;
  starCount?: number;
}

export default function StarRating({
  rating,
  setRating,
  interactive = false,
  className = "",
  starCount = 5,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const displayRating = hoverRating ?? rating;
  // Convert 0–5 rating to half-star scale (0–10)
  const normalizedRating = Math.min(Math.max(displayRating * 2, 0), starCount * 2);

  const handleClick = useCallback(
    (value: number) => {
      if (interactive && setRating) {
        setRating(value / 2); // return to 0–5 scale if needed
      }
    },
    [interactive, setRating]
  );

  const handleMouseEnter = useCallback(
    (value: number) => {
      if (interactive) {
        setHoverRating(value / 2); // keep hover in 0–5 scale
      }
    },
    [interactive]
  );

  const handleMouseLeave = useCallback(() => {
    if (interactive) {
      setHoverRating(null);
    }
  }, [interactive]);

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const isFilled = normalizedRating >= starValue * 2;
    const isHalfFilledLeft = normalizedRating === starValue * 2 - 1;
    const isHalfFilledRight = normalizedRating === starValue * 2 - 0.5;

    return (
      <span
        key={index}
        className={`relative inline-block ${interactive ? "cursor-pointer" : ""}`}
        onMouseLeave={handleMouseLeave}
      >
        {/* Left half */}
        <span
          className="absolute top-0 left-0 w-1/2 h-full z-10"
          onClick={() => handleClick(starValue * 2 - 1)}
          onMouseEnter={() => handleMouseEnter(starValue * 2 - 1)}
        />

        {/* Right half */}
        <span
          className="absolute top-0 right-0 w-1/2 h-full z-10"
          onClick={() => handleClick(starValue * 2)}
          onMouseEnter={() => handleMouseEnter(starValue * 2)}
        />

        {/* Base star */}
        <Icon name="Star" className="w-5 h-5 fill-gray-300 text-gray-300" />

        {/* Full overlay */}
        {isFilled && (
          <Icon
            name="Star"
            className="w-5 h-5 absolute top-0 left-0 fill-yellow-500 text-yellow-500"
          />
        )}

        {/* Half overlay (left) */}
        {isHalfFilledLeft && (
          <Icon
            name="StarHalf"
            className="w-5 h-5 absolute top-0 left-0 fill-yellow-500 text-yellow-500"
          />
        )}

        {/* Half overlay (right, flipped) */}
        {isHalfFilledRight && (
          <>
            <Icon
              name="Star"
              className="w-5 h-5 absolute top-0 left-0 fill-yellow-500 text-yellow-500"
            />
            <Icon
              name="StarHalf"
              className="w-5 h-5 absolute top-0 left-0 fill-gray-300 text-gray-300 transform scale-x-[-1]"
            />
          </>
        )}
      </span>
    );
  };

  return (
    <div
      dir="ltr"
      className={`flex items-center ${className}`}
      onMouseLeave={interactive ? handleMouseLeave : undefined}
    >
      {Array.from({ length: starCount }, (_, i) => renderStar(i))}
    </div>
  );
}
