import Image from "next/image";
import { ReviewsList, ReviewType } from "./ReviewsList";

const reviews: ReviewType[] = [
  {
    name: "محمد امیری",
    date: "۵ دی ۱۴۰۲",
    rating: 6,
    picture: "",
    body: "پلتفرم جالبیه، ولی بعضی از گزارش‌ها مدت زیادی بدون بررسی باقی می‌مونن. اگه تیم پشتیبانی سریع‌تر پیگیری کنه، این سیستم می‌تونه تأثیر خیلی بهتری داشته باشه. در کل، ایده خیلی خوبیه ولی نیاز به بهینه‌سازی داره."
  },
  {
    name: "سارا محمدی",
    date: "۱۸ بهمن ۱۴۰۲",
    rating: 9,
    picture: "",
    body: "ایده این پلتفرم خیلی کاربردیه و شهروندها رو تشویق می‌کنه که خودشون برای بهبود محیط اقدام کنن. تنها پیشنهادی که دارم اینه که قابلیت پیگیری وضعیت گزارش‌ها رو هم اضافه کنن تا بدونیم مشکل دقیقاً چه زمانی حل می‌شه."
  },
  {
    name: "علی رضایی",
    date: "۲۵ اسفند ۱۴۰۲",
    rating: 7,
    picture: "",
    body: "پلتفرم CleanCity واقعاً عالیه! گزارش مشکلم رو درباره ریختن زباله‌های غیرمجاز توی محله‌مون ثبت کردم و در کمتر از یک هفته، شهرداری اقدام کرد. از این که می‌تونم برای شهر تمیزتر کمک کنم، خیلی خوشحالم!"
  },
  {
    name: "آرش کمانگیر",
    date: "۱۵ اسفند ۱۴۰۳",
    rating: 7,
    picture: "",
    body: "CleanCity واقعاً زندگی ما رو راحت‌تر کرده! من چند مشکل مثل خرابی چراغ‌های خیابان و سطل‌های زباله پر رو گزارش کردم و واقعاً به‌سرعت رسیدگی شد. ممنون از این پلتفرم عالی!"
  },
  {
    name: "لیلا محسنی",
    date: "۵ بهمن ۱۴۰۳",
    rating: 6,
    picture: "",
    body: "وقتی دیدم میشه با چند کلیک ساده مشکلات شهری رو گزارش داد، خیلی خوشحال شدم. گزارش کردن چاله‌های خیابون و زباله‌های اطراف خیلی راحت شد. دستتون درد نکنه CleanCity!"
  },
  {
    name: "نیلوفر شریفی",
    date: "۲۷ دی ۱۴۰۳",
    rating: 8,
    picture: "",
    body: "این برنامه کمک کرده تا شهرمون تمیزتر و مرتب‌تر باشه. پیگیری‌ها خیلی دقیق هستن و این واقعاً حس خوبی به شهروندها میده. پیشنهادش می‌کنم!"
  },
  {
    name: "کیان مرادی",
    date: "۲۲ بهمن ۱۴۰۳",
    rating: 9,
    picture: "",
    body: "من اولین بار گزارشی درباره‌ی پارکی که همیشه شلوغ و کثیف بود دادم و فکر نمی‌کردم که واقعاً تأثیری داشته باشه، اما فقط چند روز بعد دیدم که شرایط بهبودیافته. CleanCity بی‌نظیره!"
  },
  {
    name: "احسان مشهدی",
    date: "۱۸ اسفند ۱۴۰۳",
    rating: 10,
    picture: "",
    body: "یکی از بهترین اپلیکیشن‌هایی که تا حالا دیدم. حس می‌کنم با استفاده از این اپ، می‌تونیم خودمون هم توی بهتر شدن شهرمون نقش داشته باشیم. خیلی کاربردیه!"
  },
];

export default function ReviewsSection() {
  const reviewsPerPage = 3;
  const initialReviews = reviews.slice(0, reviewsPerPage);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  return (
    <section className="bg-light py-8 md:py-10 px-4 sm:px-6 md:px-20" dir="rtl">
      {/* Title */}
      <header className="flex flex-row items-center mb-6">
        <Image
          src="/images/icons/review.png"
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
      <ReviewsList
        allReviews={reviews}
        initialReviews={initialReviews}
        totalPages={totalPages}
        reviewsPerPage={reviewsPerPage}
      />
    </section>
  );
};
