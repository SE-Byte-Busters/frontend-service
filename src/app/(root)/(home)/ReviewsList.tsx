"use client";

import { useState, useEffect } from "react";
import StarRating from "@/components/StarRating";
import UserAvatar from "@/components/UserAvatar";

export type ReviewType = {
  _id: string;
  text: string;
  averageScore: number;
  user?: {
    email: string;
    name?: string;
    avatar?: string;
  };
  createdAt: string;
};

export function ReviewsList({ reviewsPerPage = 4 }: { reviewsPerPage?: number }) {
  const [allReviews, setAllReviews] = useState<ReviewType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionStage, setTransitionStage] = useState<"fadeIn" | "fadeOut">("fadeIn");
  const [displayedReviews, setDisplayedReviews] = useState<ReviewType[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`https://shahriar.thetechverse.ir:3000/api/v1/comment?page=1&pageSize=1000`);
        const data = await res.json();
        if (Array.isArray(data.comments)) {
          setAllReviews(data.comments);
          setDisplayedReviews(data.comments.slice(0, reviewsPerPage));
        } else {
          console.error("API returned unexpected data:", data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };
    fetchReviews();
  }, [reviewsPerPage]);

  const totalPages = Math.ceil(allReviews.length / reviewsPerPage);

  const handleDotClick = (index: number) => {
    if (index !== currentIndex) {
      setTransitionStage("fadeOut");
      setTimeout(() => {
        setDisplayedReviews(
          allReviews.slice(index * reviewsPerPage, (index + 1) * reviewsPerPage)
        );
        setCurrentIndex(index);
        setTransitionStage("fadeIn");
      }, 200);
    }
  };

  return (
    <div className="space-y-6">
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 transition-opacity duration-300 ${
          transitionStage === "fadeIn" ? "opacity-100" : "opacity-0"
        }`}
      >
        {displayedReviews.map((review) => (
          <article
            key={review._id}
            className="flex flex-col bg-accent rounded-2xl md:rounded-3xl p-4 md:p-6"
          >
            <div className="flex flex-row items-center">
              <div className="flex flex-col text-right grow">
                <p className="text-base md:text-lg font-semibold text-black">
                  {review.user?.name || review.user?.email || "کاربر ناشناس"}
                </p>
                <time className="text-xs md:text-sm text-black">
                  {new Date(review.createdAt).toLocaleDateString("fa-IR")}
                </time>
                <StarRating rating={review.averageScore} className="justify-end" />
              </div>
              <UserAvatar
                picture={review.user?.avatar || ""}
                username={review.user?.name || review.user?.email || "کاربر"}
                className="h-16 w-16 md:h-20 md:w-20"
                width={64}
                height={64}
              />
            </div>
            <p className="text-black pt-3 md:pt-4 text-justify text-sm md:text-base leading-5">
              "{review.text}"
            </p>
          </article>
        ))}
      </div>

      {/* Pagination Dots */}
      <nav className="flex justify-center mt-6 md:mt-10" aria-label="پیمایش نظرات">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-colors hover:bg-gray-400 mr-2 ${
              index === currentIndex ? "bg-accent" : "bg-gray-300"
            }`}
            aria-label={`صفحه ${index + 1}`}
            aria-current={index === currentIndex ? "page" : undefined}
          />
        ))}
      </nav>
    </div>
  );
}
