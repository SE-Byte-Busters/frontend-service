import Link from 'next/link';
import Image from 'next/image';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'صفحه مورد نظر یافت نشد | 404 خطا',
  description: 'صفحه ای که به دنبال آن بودید پیدا نشد. می‌توانید به صفحه اصلی بازگردید یا یک گزارش جدید ثبت کنید.',
  robots: 'noindex, follow',
  openGraph: {
    title: 'صفحه مورد نظر یافت نشد | 404 خطا',
    description: 'صفحه ای که به دنبال آن بودید پیدا نشد. می‌توانید به صفحه اصلی بازگردید یا یک گزارش جدید ثبت کنید.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://shahriar.thetechverse.ir/404',
  }
};

export default function NotFound() {
  return (
    <>
      <Header />

      <main dir="rtl" className="flex flex-col md:flex-row items-center justify-center bg-light pt-24">
        {/* Image */}
        <section className="w-full md:w-1/2 p-6 md:p-10 flex justify-center">
          <Image
            src="/images/special/404.jpg"
            alt="تصویر خطای ۴۰۴ - صفحه یافت نشد"
            width={512}
            height={512}
            className="object-contain"
            priority
          />
        </section>

        {/* Text & Buttons */}
        <section className="flex flex-col items-center justify-center w-full md:w-1/2 text-center p-6 md:p-10" dir="rtl">
          <h1 className="text-dark text-3xl md:text-5xl font-bold mb-10 md:mb-20">
            اوه نه! این خیابون به بن‌بست خورده!
          </h1>
          <p className="text-dark text-xl md:text-3xl mb-10 md:mb-20 leading-relaxed">
            ولی نگران نباش، گم شدن توی شهر هم جزئی از ماجراست.<br />
            به نظر می‌رسه صفحه‌ای که دنبالش بودی یا جابجا شده یا اصلاً وجود نداشته.
          </p>
          <p className="text-dark text-xl md:text-3xl mb-10 md:mb-20 leading-relaxed">
            بیا برگردیم به جایی که همه چی سر جاشه، یا یه گزارش جدید ثبت کن تا شهریار شادتر بشه.
          </p>

          <nav className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-20 w-full">
            <Link
              href="/report/new-report"
              className="bg-accent text-white text-base md:text-2xl rounded-lg px-6 py-3 transition duration-300 hover:text-black w-full md:w-64 text-center"
              aria-label="ثبت گزارش جدید"
            >
              ثبت گزارش جدید
            </Link>
            <Link
              href="/"
              className="bg-transparent text-accent text-base md:text-2xl rounded-lg px-6 py-3 transition duration-300 hover:bg-accent hover:text-white w-full md:w-64 border-2 border-accent text-center"
              aria-label="بازگشت به صفحه اصلی"
            >
              برو به صفحه اصلی
            </Link>
          </nav>
        </section>
      </main>

      <Footer />
    </>
  );
}
