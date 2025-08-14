// app/(root)/(home)/ReviewsSection.tsx
"use client"; // client component because it renders ReviewsList which uses hooks

import { ReviewsList } from "./ReviewsList";

export default function ReviewsSection() {
  const reviewsPerPage = 3;

  return (
    <section className="bg-light py-8 md:py-10 px-4 sm:px-6 md:px-20" dir="rtl">
      {/* Title */}
      <header className="flex flex-row items-center mb-6">
        <img
          src="/images/icons/review.png"
          alt="Review Icon"
          className="h-16 w-16 sm:h-20 sm:w-20 ml-4 mb-4 sm:mb-0"
        />
        <div className="flex flex-col items-right text-right">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-2">
            نظرات کاربران
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-black">
            نمایش چند نقل قول از کاربران درباره‌ی تجربه استفاده از CleanCity
          </p>
        </div>
      </header>

      <ReviewsList reviewsPerPage={reviewsPerPage} />
    </section>
  );
}
