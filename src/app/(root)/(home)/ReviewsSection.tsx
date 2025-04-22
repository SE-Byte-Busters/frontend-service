"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

import { Icon } from "@/components/Icon";

interface Review {
  name: string;
  date: string;
  rating: number;
  picture: string;
  body: string;
}

const reviews: Review[] = [
  {
    name: "محمد امیری",
    date: "۵ دی ۱۴۰۲",
    rating: 6,
    picture: "/default-profile.png",
    body: "پلتفرم جالبیه، ولی بعضی از گزارش‌ها مدت زیادی بدون بررسی باقی می‌مونن. اگه تیم پشتیبانی سریع‌تر پیگیری کنه، این سیستم می‌تونه تأثیر خیلی بهتری داشته باشه. در کل، ایده خیلی خوبیه ولی نیاز به بهینه‌سازی داره."
  },
  {
    name: "سارا محمدی",
    date: "۱۸ بهمن ۱۴۰۲",
    rating: 9,
    picture: "/default-profile.png",
    body: "ایده این پلتفرم خیلی کاربردیه و شهروندها رو تشویق می‌کنه که خودشون برای بهبود محیط اقدام کنن. تنها پیشنهادی که دارم اینه که قابلیت پیگیری وضعیت گزارش‌ها رو هم اضافه کنن تا بدونیم مشکل دقیقاً چه زمانی حل می‌شه."
  },
  {
    name: "علی رضایی",
    date: "۲۵ اسفند ۱۴۰۲",
    rating: 7,
    picture: "/default-profile.png",
    body: "پلتفرم CleanCity واقعاً عالیه! گزارش مشکلم رو درباره ریختن زباله‌های غیرمجاز توی محله‌مون ثبت کردم و در کمتر از یک هفته، شهرداری اقدام کرد. از این که می‌تونم برای شهر تمیزتر کمک کنم، خیلی خوشحالم!"
  },
  {
    name: "آرش کمانگیر",
    date: "۱۵ اسفند ۱۴۰۳",
    rating: 7,
    picture: "/default-profile.png",
    body: "CleanCity واقعاً زندگی ما رو راحت‌تر کرده! من چند مشکل مثل خرابی چراغ‌های خیابان و سطل‌های زباله پر رو گزارش کردم و واقعاً به‌سرعت رسیدگی شد. ممنون از این پلتفرم عالی!"
  },
  {
    name: "لیلا محسنی",
    date: "۵ بهمن ۱۴۰۳",
    rating: 6,
    picture: "/default-profile.png",
    body: "وقتی دیدم میشه با چند کلیک ساده مشکلات شهری رو گزارش داد، خیلی خوشحال شدم. گزارش کردن چاله‌های خیابون و زباله‌های اطراف خیلی راحت شد. دستتون درد نکنه CleanCity!"
  },
  {
    name: "نیلوفر شریفی",
    date: "۲۷ دی ۱۴۰۳",
    rating: 8,
    picture: "/default-profile.png",
    body: "این برنامه کمک کرده تا شهرمون تمیزتر و مرتب‌تر باشه. پیگیری‌ها خیلی دقیق هستن و این واقعاً حس خوبی به شهروندها میده. پیشنهادش می‌کنم!"
  },
  {
    name: "کیان مرادی",
    date: "۲۲ بهمن ۱۴۰۳",
    rating: 9,
    picture: "/default-profile.png",
    body: "من اولین بار گزارشی درباره‌ی پارکی که همیشه شلوغ و کثیف بود دادم و فکر نمی‌کردم که واقعاً تأثیری داشته باشه، اما فقط چند روز بعد دیدم که شرایط بهبودیافته. CleanCity بی‌نظیره!"
  },
  {
    name: "احسان مشهدی",
    date: "۱۸ اسفند ۱۴۰۳",
    rating: 10,
    picture: "/default-profile.png",
    body: "یکی از بهترین اپلیکیشن‌هایی که تا حالا دیدم. حس می‌کنم با استفاده از این اپ، می‌تونیم خودمون هم توی بهتر شدن شهرمون نقش داشته باشیم. خیلی کاربردیه!"
  },
];

export default function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [transitionStage, setTransitionStage] = useState<'fadeIn' | 'fadeOut'>('fadeIn');
  const [displayedReviews, setDisplayedReviews] = useState<Review[]>([]);

  const reviewsPerPage = 3;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  useEffect(() => {
    if (transitionStage === 'fadeOut') {
      const timer = setTimeout(() => {
        setDisplayedReviews(
          reviews.slice(
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
      reviews.slice(0, reviewsPerPage)
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
    <section className="bg-light py-8 md:py-10 px-4 sm:px-6 md:px-20" dir="rtl">
      {/* Title */}
      <header className="flex flex-row items-center mb-6">
        <Image
          src="/review-icon.png"
          width={64}
          height={64}
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

      {/* Reviews */}
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
                <Image
                  src={review.picture}
                  alt={`${review.name}'s photo`}
                  width={64}
                  height={64}
                  className="rounded-full bg-white border border-gray-300 h-16 w-16 md:h-20 md:w-20"
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
    </section>
  );
};
