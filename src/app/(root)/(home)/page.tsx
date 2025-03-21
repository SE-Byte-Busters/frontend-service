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
    <div className="relative flex min-h-screen">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none bg-[url('/back-auth.jpg')] bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/25 to-transparent" />
      </div>

      <div
        className="container mx-auto flex flex-col text-right py-10 px-40 mt-15"
        dir="rtl"
      >
        {/* Title and Description */}
        <div>
          <div className="flex items-center justify-right mb-6">
            <Image
              src="/hero-icon.png"
              width={80}
              height={80}
              alt="Hero Icon"
              className="ml-4"
            />
            <h1 className="text-5xl font-bold text-black">
              شهر خود را پاک‌تر کنید
            </h1>
          </div>
          <p className="text-2xl text-black mb-8 leading-relaxed">
            کلین سیتی CleanCity، یک پلتفرم هوشمند برای گزارش مشکلات شهری است. با ثبت
            گزارش جدید، موقعیت و نوع مشکل را مشخص کنید تا نهادهای مرتبط برای حل آن اقدام
            کنند.<br />
            با مشارکت شما، شهر پاک‌تر و هوشمندتر خواهد شد!
          </p>
        </div>

        {/* Button */}
        <div className="flex justify-center">
          <button
            className="bg-accent text-white text-2xl rounded-lg px-6 py-3 transition duration-300 hover:text-black"
            onClick={() => router.push('/new-report')}
          >
            ثبت گزارش جدید
          </button>
        </div>
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
  const router = useRouter();

  const users = [
    {
      rank: 1,
      picture: "/next.svg",
      username: "علی رضایی",
      score: 110,
      medal: "قهرمان محیط‌زیست و فعال‌ترین گزارش‌دهنده",
      lastActivity: "۲۳ اسفند ۱۴۰۳",
    },
    {
      rank: 2,
      picture: "/next.svg",
      username: "سارا محمدی",
      score: 88,
      medal: "فعال‌ترین گزارش‌دهنده",
      lastActivity: "۲۵ اسفند ۱۴۰۳",
    },
    {
      rank: 3,
      picture: "/next.svg",
      username: "محمد امیری",
      score: 58,
      medal: "فعال برتر",
      lastActivity: "۲۰ اسفند ۱۴۰۳",
    },
  ];

  return (
    <div className="flex flex-col items-center bg-dark min-h-screen px-25 py-8" dir="rtl">
      {/* Title */}
      <div className="flex items-center mb-8 justify-right w-full">
        <Image
          src="/ranking-icon.png"
          width={256}
          height={256}
          alt="Ranking Icon"
          className="h-20 w-20 ml-4"
        />
        <h1 className="text-5xl font-bold text-white ml-4">
          با فعالیت در CleanCity، قهرمان محیط‌زیست شوید!
        </h1>
      </div>

      {/* Table */}
      <div className="bg-light w-full max-w-6xl rounded-lg px-5 py-4">
        {/* Table Head */}
        <div className="grid grid-cols-6 bg-gray-200 text-black text-lg text-center rounded-lg font-semibold py-3">
          <div className="flex justify-center items-center">رتبه</div>
          <div className="flex justify-center items-center">عکس کاربر</div>
          <div className="flex justify-center items-center">نام کاربر</div>
          <div className="flex justify-center items-center">امتیاز کل</div>
          <div className="flex justify-center items-center">نشان دریافتی</div>
          <div className="flex justify-center items-center">آخرین فعالیت</div>
        </div>
        {/* Table Rows */}
        {users.map((user, index) => (
          <div
            key={index}
            className={
              `grid grid-cols-6 items-center text-center py-3 px-4 bg-light
              ${index < users.length - 1 ? "border-b" : ""} border-black
            `}
          >
            <div className="flex justify-center items-center text-sm text-black">{user.rank}</div>
            <div className="flex justify-center">
              <Image
                src={user.picture}
                width={64}
                height={64}
                alt={`${user.username}'s picture`}
                className="rounded-full border border-gray-300 h-10 w-10"
              />
            </div>
            <div className="flex justify-center items-center text-sm text-black">{user.username}</div>
            <div className="flex justify-center items-center text-sm text-black">{user.score}</div>
            <div className="flex justify-center items-center text-sm text-black">{user.medal}</div>
            <div className="flex justify-center items-center text-sm text-black">{user.lastActivity}</div>
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="flex w-full">
        <button
          className=" bg-accent text-white font-semibold text-lg rounded-lg mt-6 px-6 py-3
        transition duration-300 hover:text-black"
          onClick={() => router.push("/leaderboard")}
        >
          مشاهده تابلوی برترین‌ها
        </button>
      </div>
    </div>
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
