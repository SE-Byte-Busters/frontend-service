'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import Image from 'next/image';

export default function NotFound() {
  const router = useRouter();
  return (
    <html lang="fa">
      <body>
        <Header />

        <div dir="rtl" className="flex flex-col md:flex-row items-center justify-center bg-light pt-24">
          {/* Image */}
          <div className="w-full md:w-1/2 p-6 md:p-10 flex justify-center">
            <Image 
              src="/404.jpg"
              alt="404"
              width={512}
              height={512} 
              className="object-contain"
            />
          </div>

          {/* Text & Buttons */}
          <div className="flex flex-col items-center justify-center w-full md:w-1/2 text-center p-6 md:p-10" dir="rtl">
            <p className="text-dark text-3xl md:text-5xl font-bold mb-10 md:mb-20">
              اوه نه! این خیابون به بن‌بست خورده!
            </p>
            <p className="text-dark text-xl md:text-3xl mb-10 md:mb-20 leading-relaxed">
              ولی نگران نباش، گم شدن توی شهر هم جزئی از ماجراست.<br />
              به نظر می‌رسه صفحه‌ای که دنبالش بودی یا جابجا شده یا اصلاً وجود نداشته.
            </p>
            <p className="text-dark text-xl md:text-3xl mb-10 md:mb-20 leading-relaxed">
              بیا برگردیم به جایی که همه چی سر جاشه، یا یه گزارش جدید ثبت کن تا شهریار شادتر بشه.
            </p>

            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-20 w-full">
              <button
                className="bg-accent text-white text-base md:text-2xl rounded-lg px-6 py-3 transition duration-300 hover:bg-green-700 w-full md:w-64"
                onClick={() => router.push('/new-report')}
              >
                ثبت گزارش جدید
              </button>
              <button
                className="bg-transparent text-accent text-base md:text-2xl rounded-lg px-6 py-3 transition duration-300 hover:bg-green-700 hover:text-white w-full md:w-64 border-2 border-accent hover:border-green-700"
                onClick={() => router.push('/')}
              >
                برو به صفحه اصلی
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </body>
    </html>
  );
}
