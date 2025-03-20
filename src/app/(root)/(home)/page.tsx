"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const reviews = [
  "review 1",
  "review 2",
  "review 3",
  "review 4",
  "review 5",
  "review 6",
  "review 7",
  "review 8",
];

const HeroSection = () => {
  const router = useRouter();

  return (
    <div className="relative bg-cover bg-center h-screen" style={{ backgroundImage: "url('/back-auth.jpg')" }}>
      <div className="flex flex-col justify-center items-center text-center py-25">
        <div className="flex items-center flex-row-reverse">
          <Image src="/hero-icon.png" width={500} height={500} alt="Title Icon" className="h-20 w-20" />
          <h1 className="font-bold text-black">شهر خود را پاک‌تر کنید</h1>
        </div>
        <p className="text-lg rtl text-black">
          کلین سیتی CleanCity، یک پلتفرم هوشمند برای گزارش مشکلات شهری است. با ثبت گزارش جدید، موقعیت و نوع مشکل را مشخص کنید تا نهادهای مرتبط برای حل آن اقدام کنند.
        </p>
        <button
          className="bg-accent text-white rounded hover:brightness-90"
          onClick={() => router.push("/new-report")}>
          ثبت گزارش جدید
        </button>
      </div>
    </div>
  );
};

const MapSection = () => {
  return (
    <></>
  );
};

const StepsSection = () => {
  return (
    <></>
  );
};

const RankingSection = () => {
  return (
    <></>
  );
};

const ReviewsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviewsPerPage = 3;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const currentReviews = reviews.slice(
    currentIndex * reviewsPerPage,
    currentIndex * reviewsPerPage + reviewsPerPage
  );

  return (
    <div className="bg-light h-screen">
      <div className="flex items-center flex-row-reverse">
        <Image src="/review-icon.png" width={500} height={500} alt="Review Icon" className="h-20 w-20" />
        <div>
          <h5 className="text-2xl font-bold text-center text-black">نظرات کاربران</h5>
          <h6 className="text-lg text-center text-black">نمایش چند نقل قول از کاربران درباره‌ی تجربه استفاده از CleanCity</h6>
        </div>
      </div>
      <div className="space-y-4 text-center text-black">
        {currentReviews.map((review, index) => (
          <p key={index} className="text-lg">{review}</p>
        ))}
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        {Array(totalPages).fill(0).map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-4 h-4 rounded-full ${currentIndex === index ? "bg-accent" : "bg-gray-300"
              }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div>
      <HeroSection />
      <MapSection />
      <StepsSection />
      <RankingSection />
      <ReviewsSection />
    </div>
  );
}
