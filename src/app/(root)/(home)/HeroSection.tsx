import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="relative flex min-h-[80vh] md:min-h-screen pt-16 md:pt-20">
      {/* Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none bg-[url('/homepage.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/65 to-transparent" />
      </div>

      <div className="flex flex-col mx-auto py-6 md:py-10 px-4 sm:px-6 md:px-20 mt-8 md:mt-15" dir="rtl">
        {/* Title and Description */}
        <div>
          <div className="flex flex-row items-center text-right mb-4 md:mb-6">
            <Image
              src="/hero-icon.png"
              width={64}
              height={64}
              alt="Hero Icon"
              className="h-16 w-16 sm:h-20 sm:w-20 ml-4 mb-4 sm:mb-0"
              priority
            />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black text-right">
              شهر خود را پاک‌تر کنید
            </h1>
          </div>
          <p className="text-base sm:text-xl md:text-2xl text-black text-justify mb-6 md:mb-8 leading-relaxed">
            کلین سیتی CleanCity، یک پلتفرم هوشمند برای گزارش مشکلات شهری است. با ثبت
            گزارش جدید، موقعیت و نوع مشکل را مشخص کنید تا نهادهای مرتبط برای حل آن اقدام
            کنند.<br />
            با مشارکت شما، شهر پاک‌تر و هوشمندتر خواهد شد!
          </p>
        </div>

        {/* New Report Link */}
        <div className="flex justify-center">
          <Link
            href="/new-report"
            className="bg-accent text-white text-lg sm:text-xl md:text-2xl rounded-lg px-4 py-2 sm:px-6 sm:py-3
            transition duration-300 hover:text-black w-auto"
          >
            ثبت گزارش جدید
          </Link>
        </div>
      </div>
    </div>
  );
};
