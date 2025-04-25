"use client"; 

import { useState } from 'react';
import Image from 'next/image';

export default function NewReport() {
  const images = [
    "/images/special/No_Image_Available.jpg", // Image 1
    "/images/special/No_Image_Available.jpg", 
    "/images/special/No_Image_Available.jpg",
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length); // Cycle through images
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length // Cycle through images
    );
  };

  return (
    <div className="bg-light min-h-screen flex flex-col items-center px-4 pt-20 pb-12 lg:pt-10 lg:pb-10">
      <div className="flex flex-col items-center w-full max-w-6xl gap-12 mt-10">
        {/* Profile Info & Stats */}
        <div className="w-full flex flex-col-reverse lg:flex-row-reverse items-center lg:items-center lg:justify-center gap-6">
          {/* Stats Section */}
          <div className="flex flex-col items-center gap-2 w-full max-w-md">
            <div className="w-full flex justify-between px-6 text-lg text-gray-900">
              <span className="text-right w-1/3">رتبه</span>
              <span className="text-center w-1/3">نشان دریافتی</span>
              <span className="text-left w-1/3">امتیاز کل</span>
            </div>
            <div className="bg-accent rounded-full px-6 py-3 flex justify-between items-center w-full text-sm md:text-base text-gray-900">
              <span className="text-right w-1/3">۱</span>
              <span className="text-center w-1/3">قهرمان محیط زیست و فعال ترین گزارش دهنده</span>
              <span className="text-left w-1/3">۱۱۰</span>
            </div>
          </div>

          {/* Profile Image + Name */}
          <div className="flex flex-col items-center lg:items-end">
            <Image
              src="/images/avatars/default-profile.png"
              alt="Profile"
              width={120}
              height={120}
              className="rounded-full"
            />
            <p className="font-bold text-md text-gray-900 mt-2">Javad_Hemmati</p>
          </div>
        </div>

        {/* Reports Section */}
        <div className="w-full flex flex-row-reverse flex-wrap justify-end gap-6">
          {/* Report Card */}
          <div className="w-full sm:w-[300px] bg-white border border-gray-300 rounded-xl shadow-md overflow-hidden flex flex-col">
            {/* Image Carousel */}
            <div className="relative w-full h-48 bg-gray-100">
              <img
                src={images[currentImageIndex]}
                alt="گزارش"
                className="w-full h-full object-cover"
              />

              {/* Pagination dots */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                {images.map((_, index) => (
                  <span
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? 'bg-green-400' : 'bg-gray-300'
                    }`}
                  ></span>
                ))}
              </div>

              {/* Left arrow */}
              <div
                className="absolute top-1/2 left-2 transform -translate-y-1/2 cursor-pointer"
                onClick={nextImage}
              >
                <img src="/images/icons/icons8-left-arrow-100.png" alt="Previous" className="w-6 h-6" />
              </div>

              {/* Right arrow */}
              <div
                className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer"
                onClick={prevImage}
              >
                <img src="/images/icons/icons8-right-arrow-100.png" alt="Next" className="w-6 h-6" />
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4 text-right flex flex-col gap-2">
              <h3 className="text-gray-900 text-lg font-bold">چاله بزرگ در خیابان</h3>
              <p className="text-sm text-gray-900">۱۰ اسفند ۱۴۰۳</p>
              <p className="text-sm text-gray-900 leading-relaxed">
                در وسط خیابان اصلی یک چاله نسبتاً عمیق ایجاد شده که باعث ایجاد ترافیک و خطر برای خودروها و موتورسوارها شده...
              </p>
              <p className="text-sm font-semibold text-gray-800 mt-1">
                تهران، خیابان شریعتی
              </p>

              {/* Status and Clock */}
              <div className="flex justify-between items-center mt-2">
                {/* Right side: اولویت بندی */}
                <span className="text-xs border border-yellow-400 text-yellow-700 px-3 py-1 rounded-full">
                  درحال اولویت بندی
                </span>

                {/* Left side: بررسی + ساعت */}
                <div className="flex flex-col items-center text-sm text-gray-600">
                  <img src="/images/icons/clock.png" alt="Clock" className="w-5 h-5 mb-1" />
                  <span>در حال بررسی</span>
                </div>
              </div>

              {/* Actions (always on right) */}
              <div className="flex flex-row-reverse justify-end mt-4 gap-3">
                <img src="/images/icons/road-barrier-solid.svg" alt="Road Barrier" className="w-6 h-6" />
                <img src="/images/icons/smog-solid.svg" alt="Smog" className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
