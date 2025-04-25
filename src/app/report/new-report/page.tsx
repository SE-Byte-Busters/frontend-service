"use client"; 

import { useState } from 'react';
import Image from 'next/image';

export default function NewReport() {
  const images1 = ["/images/special/No_Image_Available.jpg", "/images/special/No_Image_Available.jpg", "/images/special/No_Image_Available.jpg"];
  const images2 = ["/images/special/No_Image_Available.jpg", "/images/special/No_Image_Available.jpg", "/images/special/No_Image_Available.jpg"];
  const images3 = ["/images/special/No_Image_Available.jpg", "/images/special/No_Image_Available.jpg", "/images/special/No_Image_Available.jpg"];
  const images4 = ["/images/special/No_Image_Available.jpg", "/images/special/No_Image_Available.jpg", "/images/special/No_Image_Available.jpg"];

  const [currentImageIndex1, setCurrentImageIndex1] = useState(0);
  const [currentImageIndex2, setCurrentImageIndex2] = useState(0);
  const [currentImageIndex3, setCurrentImageIndex3] = useState(0);
  const [currentImageIndex4, setCurrentImageIndex4] = useState(0);

  const nextImage = (cardIndex: number) => {
    switch(cardIndex) {
      case 1:
        setCurrentImageIndex1((prevIndex) => (prevIndex + 1) % images1.length);
        break;
      case 2:
        setCurrentImageIndex2((prevIndex) => (prevIndex + 1) % images2.length);
        break;
      case 3:
        setCurrentImageIndex3((prevIndex) => (prevIndex + 1) % images3.length);
        break;
      case 4:
        setCurrentImageIndex4((prevIndex) => (prevIndex + 1) % images4.length);
        break;
      default:
        break;
    }
  };

  const prevImage = (cardIndex: number) => {
    switch(cardIndex) {
      case 1:
        setCurrentImageIndex1((prevIndex) => (prevIndex - 1 + images1.length) % images1.length);
        break;
      case 2:
        setCurrentImageIndex2((prevIndex) => (prevIndex - 1 + images2.length) % images2.length);
        break;
      case 3:
        setCurrentImageIndex3((prevIndex) => (prevIndex - 1 + images3.length) % images3.length);
        break;
      case 4:
        setCurrentImageIndex4((prevIndex) => (prevIndex - 1 + images4.length) % images4.length);
        break;
      default:
        break;
    }
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
          {/* Report Card 1 */}
          <div className="w-full sm:w-[300px] bg-white border border-gray-300 rounded-xl shadow-md overflow-hidden flex flex-col">
            {/* Image Carousel */}
            <div className="relative w-full h-48 bg-gray-100">
              <img
                src={images1[currentImageIndex1]}
                alt="گزارش"
                className="w-full h-full object-cover"
              />
              {/* Pagination dots */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                {images1.map((_, index) => (
                  <span
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex1 ? 'bg-green-400' : 'bg-gray-300'
                    }`}
                  ></span>
                ))}
              </div>

              {/* Left arrow (now showing '-') */}
              <div
                className="absolute top-1/2 left-2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => prevImage(1)}
              >
                <span className="text-xl font-bold">-</span>
              </div>

              {/* Right arrow (now showing '+') */}
              <div
                className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => nextImage(1)}
              >
                <span className="text-xl font-bold">+</span>
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
            </div>
          </div>

          {/* Report Card 2 */}
          <div className="w-full sm:w-[300px] bg-white border border-gray-300 rounded-xl shadow-md overflow-hidden flex flex-col">
            {/* Image Carousel */}
            <div className="relative w-full h-48 bg-gray-100">
              <img
                src={images2[currentImageIndex2]}
                alt="گزارش"
                className="w-full h-full object-cover"
              />
              {/* Pagination dots */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                {images2.map((_, index) => (
                  <span
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex2 ? 'bg-green-400' : 'bg-gray-300'
                    }`}
                  ></span>
                ))}
              </div>

              {/* Left arrow (now showing '-') */}
              <div
                className="absolute top-1/2 left-2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => prevImage(2)}
              >
                <span className="text-xl font-bold">-</span>
              </div>

              {/* Right arrow (now showing '+') */}
              <div
                className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => nextImage(2)}
              >
                <span className="text-xl font-bold">+</span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4 text-right flex flex-col gap-2">
              <h3 className="text-gray-900 text-lg font-bold">نقص در سیستم روشنایی</h3>
              <p className="text-sm text-gray-900">۱۵ اسفند ۱۴۰۳</p>
              <p className="text-sm text-gray-900 leading-relaxed">
                سیستم روشنایی خیابان‌ها در منطقه ۵ قطع شده و باعث ایجاد مشکلاتی برای عبور و مرور شبانه شده...
              </p>
              <p className="text-sm font-semibold text-gray-800 mt-1">
                تهران، منطقه ۵
              </p>
            </div>
          </div>

          {/* Repeat for Card 3 and 4 (as before) */}
        </div>
      </div>
    </div>
  );
}
