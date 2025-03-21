"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import MaterialSymbol from "@/components/MaterialSymbol";

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
  const reviews = [
    {
      name: "محمد امیری",
      date: "۵ دی ۱۴۰۲",
      rating: 6,
      picture: "/next.svg",
      body: "پلتفرم جالبیه، ولی بعضی از گزارش‌ها مدت زیادی بدون بررسی باقی می‌مونن. اگه تیم پشتیبانی سریع‌تر پیگیری کنه، این سیستم می‌تونه تأثیر خیلی بهتری داشته باشه. در کل، ایده خیلی خوبیه ولی نیاز به بهینه‌سازی داره."
    },
    {
      name: "سارا محمدی",
      date: "۱۸ بهمن ۱۴۰۲",
      rating: 9,
      picture: "/next.svg",
      body: "ایده این پلتفرم خیلی کاربردیه و شهروندها رو تشویق می‌کنه که خودشون برای بهبود محیط اقدام کنن. تنها پیشنهادی که دارم اینه که قابلیت پیگیری وضعیت گزارش‌ها رو هم اضافه کنن تا بدونیم مشکل دقیقاً چه زمانی حل می‌شه."
    },
    {
      name: "علی رضایی",
      date: "۲۵ اسفند ۱۴۰۲",
      rating: 7,
      picture: "/next.svg",
      body: "پلتفرم CleanCity واقعاً عالیه! گزارش مشکلم رو درباره ریختن زباله‌های غیرمجاز توی محله‌مون ثبت کردم و در کمتر از یک هفته، شهرداری اقدام کرد. از این که می‌تونم برای شهر تمیزتر کمک کنم، خیلی خوشحالم!"
    },
    {
      name: "آرش کمانگیر",
      date: "۱۵ اسفند ۱۴۰۳",
      rating: 7,
      picture: "/next.svg",
      body: "CleanCity واقعاً زندگی ما رو راحت‌تر کرده! من چند مشکل مثل خرابی چراغ‌های خیابان و سطل‌های زباله پر رو گزارش کردم و واقعاً به‌سرعت رسیدگی شد. ممنون از این پلتفرم عالی!"
    },
    {
      name: "لیلا محسنی",
      date: "۵ بهمن ۱۴۰۳",
      rating: 6,
      picture: "/next.svg",
      body: "وقتی دیدم میشه با چند کلیک ساده مشکلات شهری رو گزارش داد، خیلی خوشحال شدم. گزارش کردن چاله‌های خیابون و زباله‌های اطراف خیلی راحت شد. دستتون درد نکنه CleanCity!"
    },
    {
      name: "نیلوفر شریفی",
      date: "۲۷ دی ۱۴۰۳",
      rating: 8,
      picture: "/next.svg",
      body: "این برنامه کمک کرده تا شهرمون تمیزتر و مرتب‌تر باشه. پیگیری‌ها خیلی دقیق هستن و این واقعاً حس خوبی به شهروندها میده. پیشنهادش می‌کنم!"
    },
    {
      name: "کیان مرادی",
      date: "۲۲ بهمن ۱۴۰۳",
      rating: 9,
      picture: "/next.svg",
      body: "من اولین بار گزارشی درباره‌ی پارکی که همیشه شلوغ و کثیف بود دادم و فکر نمی‌کردم که واقعاً تأثیری داشته باشه، اما فقط چند روز بعد دیدم که شرایط بهبودیافته. CleanCity بی‌نظیره!"
    },
    {
      name: "احسان مشهدی",
      date: "۱۸ اسفند ۱۴۰۳",
      rating: 10,
      picture: "/next.svg",
      body: "یکی از بهترین اپلیکیشن‌هایی که تا حالا دیدم. حس می‌کنم با استفاده از این اپ، می‌تونیم خودمون هم توی بهتر شدن شهرمون نقش داشته باشیم. خیلی کاربردیه!"
    },
  ];

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

  const getStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if ((rating / 2) >= i) {
        stars.push(
          <MaterialSymbol
            key={i}
            name="star_rate"
            type="rounded"
            className="text-yellow-500"
            style={{ fontVariationSettings: "'FILL' 1" }}
          />
        );
      } else if ((rating / 2) >= i - 0.5) {
        stars.push(
          <div key={i} className="relative inline-block">
            <MaterialSymbol
              name="star_rate"
              type="rounded"
              className="text-gray-300"
              style={{ fontVariationSettings: "'FILL' 1" }}
            />
            <MaterialSymbol
              name="star_rate"
              type="rounded"
              className="text-yellow-500 absolute top-0 left-0"
              style={{ fontVariationSettings: "'FILL' 1", clipPath: "inset(0 50% 0 0)" }}
            />
          </div>
        );
      } else {
        stars.push(
          <MaterialSymbol
            key={i}
            name="star_rate"
            type="rounded"
            className="text-gray-300"
            style={{ fontVariationSettings: "'FILL' 1" }}
          />
        );
      }
    }
    return stars;
  };

  return (
    <div className="bg-light min-h-screen py-10 px-20 sm:px-40" dir="rtl">
      {/* Title */}
      <div className="flex items-center justify-right mb-10 text-right">
        <Image
          src="/review-icon.png"
          width={256}
          height={256}
          alt="Review Icon"
          className="h-20 w-20 ml-4"
        />
        <div className="flex flex-col items-right space-y-1">
          <h5 className="text-4xl font-bold text-black">
            نظرات کاربران
          </h5>
          <h6 className="text-xl text-black">
            نمایش چند نقل قول از کاربران درباره‌ی تجربه استفاده از CleanCity
          </h6>
        </div>
      </div>

      {/* Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentReviews.map((review, index) => (
          <div
            key={index}
            className="flex flex-col bg-accent rounded-3xl p-6"
          >
            <div className="flex flex-row items-center space-x-4">
              <div className="flex flex-col text-right grow">
                <p className="text-lg font-semibold text-black">{review.name}</p>
                <p className="text-sm text-black">{review.date}</p>
                <div className="flex flex-row-reverse justify-end">
                  {getStars(review.rating)}
                </div>
              </div>
              <Image
                src={review.picture}
                alt={`${review.name}'s photo`}
                width={64}
                height={64}
                className="rounded-full bg-light border border-gray-300 h-20 w-20"
              />
            </div>
            <p className="text-black pt-4 text-justify leading-5">"{review.body}"</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 space-x-2">
        {Array(totalPages)
          .fill(0)
          .map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`
                w-4 h-4 rounded-full transition-colors hover:bg-gray-400
                ${currentIndex === index ? "bg-accent" : "bg-gray-300"}
              `}
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
