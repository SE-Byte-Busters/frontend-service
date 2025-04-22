"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/components/Icon";
import UserAvatar from "@/components/UserAvatar";

export interface ReviewType {
  name: string;
  date: string;
  rating: number;
  picture: string;
  body: string;
}

export function ReviewsList({
  allReviews,
  initialReviews,
  totalPages,
  reviewsPerPage
}: {
  allReviews: ReviewType[];
  initialReviews: ReviewType[];
  totalPages: number;
  reviewsPerPage: number;
}) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [transitionStage, setTransitionStage] = useState<'fadeIn' | 'fadeOut'>('fadeIn');
  const [displayedReviews, setDisplayedReviews] = useState<ReviewType[]>(initialReviews);

  useEffect(() => {
    if (transitionStage === 'fadeOut') {
      const timer = setTimeout(() => {
        setDisplayedReviews(
          allReviews.slice(
            currentIndex * reviewsPerPage,
            (currentIndex + 1) * reviewsPerPage
          )
        );
        setTransitionStage('fadeIn');
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [transitionStage, currentIndex]);

  useEffect(() => {
    setDisplayedReviews(
      allReviews.slice(0, reviewsPerPage)
    );
  }, []);

  const handleDotClick = (index: number) => {
    if (index !== currentIndex) {
      setTransitionStage('fadeOut');
      setCurrentIndex(index);
    }
  };

  const getStars = (rating: number) => {
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
    return stars;
  };

  return (
    <>
      <div className="relative">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 transition-opacity duration-300 ${
            transitionStage === 'fadeIn' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {displayedReviews.map((review, index) => (
            <article
            key={`${currentIndex}-${index}`}
            className="flex flex-col bg-accent rounded-2xl md:rounded-3xl p-4 md:p-6"
          >
            <div className="flex flex-row items-center">
              <div className="flex flex-col text-right grow">
                <p className="text-base md:text-lg font-semibold text-black">{review.name}</p>
                <time className="text-xs md:text-sm text-black">{review.date}</time>
                <div className="flex flex-row-reverse justify-end">
                  {getStars(review.rating)}
                </div>
              </div>
              <UserAvatar
                picture={review.picture}
                username={review.name}
                className="h-16 w-16 md:h-20 md:w-20"
                width={64}
                height={64}
              />
            </div>
            <p className="text-black pt-3 md:pt-4 text-justify text-sm md:text-base leading-5">"{review.body}"</p>
          </article>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <nav className="flex justify-center mt-6 md:mt-10" aria-label="پیمایش نظرات">
        {Array(totalPages)
          .fill(0)
          .map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`
                w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-colors hover:bg-gray-400 mr-2
                ${currentIndex === index ? "bg-accent" : "bg-gray-300"}
              `}
              aria-label={`صفحه ${index + 1}`}
              aria-current={currentIndex === index ? "page" : undefined}
            ></button>
          ))}
      </nav>
    </>
  );
}
