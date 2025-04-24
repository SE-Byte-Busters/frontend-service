import Link from 'next/link';
import Image from 'next/image';

export const metadata = {};

export default function NewReport() {
  return (
    <div className="bg-light min-h-screen flex items-start lg:items-center justify-center px-4 pt-20 pb-12 lg:pt-10 lg:pb-10">
      <div className="flex flex-col items-center w-full max-w-6xl gap-12">
        {/* Profile Info & Stats */}
        <div className="w-full flex flex-col-reverse lg:flex-row-reverse items-center lg:items-center lg:justify-center gap-6">

          {/* Stats Section */}
          <div className="flex flex-col items-center gap-2 w-full max-w-md">
            {/* Column Titles */}
            <div className="w-full flex justify-between px-6 text-sm text-gray-500">
              <span className="text-right w-1/3">رتبه</span>
              <span className="text-center w-1/3">نشان دریافتی</span>
              <span className="text-left w-1/3">امتیاز کل</span>
            </div>

            {/* Gray Info Box */}
            <div className="bg-gray-300 rounded-full px-6 py-3 flex justify-between items-center w-full text-sm md:text-base text-gray-900">
              <span className="text-right w-1/3">۱۰۰۰</span>
              <span className="text-center w-1/3">شهریار تازه‌کار</span>
              <span className="text-left w-1/3">۰</span>
            </div>
          </div>

          {/* Profile Image + Name */}
          <div className="flex flex-col items-center lg:items-end">
            <Image
              src="/images/avatars/default-profile.png"
              alt="Profile"
              width={60}
              height={60}
              className="rounded-full"
            />
            <p className="font-bold text-md text-gray-900 mt-2">Javad_Hemmati</p>
          </div>
        </div>

        {/* Middle Section: Text + Image */}
        <div className="flex flex-col-reverse md:flex-row-reverse items-center justify-between w-full">
          {/* Text Section */}
          <div className="w-full md:w-1/2 p-6 flex flex-col items-center text-center">
            <h2 className="text-dark text-4xl md:text-5xl font-bold mb-6 leading-snug">
              تو هم می‌تونی اثر بذاری!
            </h2>
            <p className="text-lg md:text-2xl text-dark mb-8 leading-relaxed max-w-xl">
              منتظرت بودیم! الان بهترین زمانه که صدات رو به گوش برسونی و کمک کنی
              شهری پاک‌تر و سالم‌تر داشته باشیم.
            </p>
            <Link href="/map">
              <span className="inline-block bg-accent text-white text-lg md:text-xl px-6 py-4 rounded-xl transition hover:bg-green-700">
                ثبت گزارش جدید
              </span>
            </Link>
          </div>

          {/* Image Section */}
          <div className="w-full md:w-1/2 p-6 flex justify-center">
            <Image
              src="/images/special/new-report.png"
              alt="Main Illustration"
              width={600}
              height={450}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
