"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

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
  return (
    <></>
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
