"use client";

import { Icon } from "@/components/Icon";
import { useCallback, useState } from "react";

interface StarRatingProps {
  rating: number;
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
  const normalizedRating = Math.min(Math.max(displayRating, 0), starCount * 2);

  const handleClick = useCallback((value: number) => {
    if (interactive && setRating) {
      setRating(value);
    }
  }, [interactive, setRating]);

  const handleMouseEnter = useCallback((value: number) => {
    if (interactive) {
      setHoverRating(value);
    }
  }, [interactive]);

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

    const starProps = {
      onMouseLeave: handleMouseLeave,
      className: interactive ? 'cursor-pointer' : '',
      role: 'button',
      tabIndex: interactive ? 0 : undefined,
    };

    return (
      <span
        key={index}
        className={`relative inline-block ${starProps.className}`}
        onMouseLeave={starProps.onMouseLeave}
      >
        {/* Left half star */}
        <span
          className="absolute top-0 left-0 w-1/2 h-full z-10"
          onClick={() => handleClick(starValue * 2 - 1)}
          onMouseEnter={() => handleMouseEnter(starValue * 2 - 1)}
          aria-label={`Rate ${isHalfFilledLeft ? 'selected' : ''} half star (left) ${index + 1}`}
        />

        {/* Right half star */}
        <span
          className="absolute top-0 right-0 w-1/2 h-full z-10"
          onClick={() => handleClick(starValue * 2)}
          onMouseEnter={() => handleMouseEnter(starValue * 2)}
          aria-label={`Rate ${isHalfFilledRight ? 'selected' : ''} half star (right) ${index + 1}`}
        />

        {/* Background star (always full) */}
        <Icon
          name="Star"
          className="w-5 h-5 fill-gray-300 text-gray-300"
          aria-hidden="true"
        />

        {/* Filled overlay (full star) */}
        {isFilled && (
          <Icon
            name="Star"
            className="w-5 h-5 absolute top-0 left-0 fill-yellow-500 text-yellow-500"
            aria-hidden="true"
          />
        )}

        {/* Half-filled overlay (left) */}
        {isHalfFilledLeft && (
          <Icon
            name="StarHalf"
            className="w-5 h-5 absolute top-0 left-0 fill-yellow-500 text-yellow-500"
            aria-hidden="true"
          />
        )}

        {/* Half-filled overlay (right) - requires a flipped version */}
        {isHalfFilledRight && (
          <>
            <Icon
              name="Star"
              className="w-5 h-5 absolute top-0 left-0 fill-yellow-500 text-yellow-500"
              aria-hidden="true"
            />
            <Icon
              name="StarHalf"
              className="w-5 h-5 absolute top-0 left-0 fill-gray-300 text-gray-300 transform scale-x-[-1]"
              aria-hidden="true"
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
      role={interactive ? 'slider' : undefined}
      aria-valuenow={rating}
      aria-valuemin={0}
      aria-valuemax={starCount * 2}
      aria-readonly={!interactive}
    >
      {Array.from({ length: starCount }, (_, i) => renderStar(i))}
    </div>
  );
};
