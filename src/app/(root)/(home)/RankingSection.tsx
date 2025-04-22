"use client";

import Image from "next/image";
import Link from "next/link";

const users = [
  {
    rank: 1,
    picture: "/default-profile.png",
    username: "علی رضایی",
    score: 110,
    medal: "قهرمان محیط‌زیست و فعال‌ترین گزارش‌دهنده",
    lastActivity: "۲۳ اسفند ۱۴۰۳",
  },
  {
    rank: 2,
    picture: "/default-profile.png",
    username: "سارا محمدی",
    score: 88,
    medal: "فعال‌ترین گزارش‌دهنده",
    lastActivity: "۲۵ اسفند ۱۴۰۳",
  },
  {
    rank: 3,
    picture: "/default-profile.png",
    username: "محمد امیری",
    score: 58,
    medal: "فعال برتر",
    lastActivity: "۲۰ اسفند ۱۴۰۳",
  },
];

export default function RankingSection() {
  return (
    <div className="flex flex-col items-center bg-primary px-4 sm:px-6 md:px-20 py-8 md:py-10" dir="rtl">
      {/* Title */}
      <div className="flex flex-row items-center mb-6 w-full">
        <Image
          src="/ranking-icon.png"
          width={64}
          height={64}
          alt="Ranking Icon"
          className="h-16 w-16 sm:h-20 sm:w-20 ml-4 mb-4 sm:mb-0"
        />
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-right">
          با فعالیت در CleanCity، قهرمان محیط‌زیست شوید!
        </h1>
      </div>

      {/* Table */}
      <div className="bg-light w-full rounded-lg px-2 sm:px-3 md:px-5 py-2 md:py-4 overflow-x-auto">
        {/* Table Head */}
        <div className="grid grid-cols-6 bg-gray-200 rounded-lg py-2 md:py-3
        text-black text-sm md:text-lg text-center font-bold min-w-[600px]">
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
              `grid grid-cols-6 items-center text-center py-2 md:py-3 bg-light
              ${index < users.length - 1 ? "border-b" : ""} border-black
              min-w-[600px]`
            }
          >
            <div className="flex justify-center items-center text-black text-sm">{user.rank}</div>
            <div className="flex justify-center">
              <Image
                src={user.picture}
                width={64}
                height={64}
                alt={`${user.username}'s picture`}
                className="bg-white rounded-full border border-gray-300 h-8 w-8 sm:h-10 sm:w-10"
              />
            </div>
            <div className="flex justify-center items-center text-xs sm:text-sm text-black">{user.username}</div>
            <div className="flex justify-center items-center text-xs sm:text-sm text-black">{user.score}</div>
            <div className="flex justify-center items-center text-xs sm:text-sm text-black">{user.medal}</div>
            <div className="flex justify-center items-center text-xs sm:text-sm text-black">{user.lastActivity}</div>
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="flex w-full justify-center sm:justify-start">
        <Link
          href="/leaderboard"
          className="bg-accent text-white font-bold text-base sm:text-lg rounded-lg mt-4 sm:mt-6 px-4 py-2 sm:px-6 sm:py-3
          transition duration-300 hover:text-black w-auto"
        >
          مشاهده تابلوی برترین‌ها
        </Link>
      </div>
    </div>
  );
};
