'use client';

import { Search, X, Home, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const HeaderMap: React.FC = () => {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="w-full flex justify-center">
      <div className="fixed top-4 left-1/2 -translate-x-1/2 md:left-auto md:right-[20px] md:translate-x-0 flex items-center justify-between bg-white rounded-full shadow-md px-4 py-2 space-x-2 rtl:space-x-reverse w-[90%] md:w-[889px] h-auto z-50">

        {/* حالت موبایل در حال جستجو */}
        <div className="flex justify-between md:hidden items-center w-full">

          {isSearching ? (
            <div className="flex items-center w-full bg-gray-100 rounded-full px-4 py-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                autoFocus
                type="text"
                placeholder="جستجوی مکان مورد نظر..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="bg-transparent outline-none text-sm text-black flex-grow placeholder-gray-400 text-right px-2"
              />
              <X
                className="w-5 h-5 text-gray-600 cursor-pointer"
                onClick={() => {
                  setIsSearching(false);
                  setSearchValue('');
                }}
              />
            </div>
          ) : (
            <>
              <button
                onClick={() => setIsSearching(true)}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-black"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => router.push('/')}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-black"
              >
                <Home className="w-5 h-5" />
              </button>

              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#8EB486] text-white">
                <User className="w-5 h-5" />
              </div>
            </>
          )}
        </div>

        {/* حالت دسکتاپ (بدون تغییر) */}
        <div className="hidden md:flex items-center justify-between w-full mr-0">
          {/* Search Section */}
          <div className="flex items-center bg-gray-100 w-[363px] px-4 py-2 space-x-2 rtl:space-x-reverse rounded-full">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="جستجوی مکان مورد نظر..."
              className="bg-transparent outline-none text-sm text-black flex-grow placeholder-gray-400 text-right"
            />
            <X className="w-5 h-5 text-gray-600 cursor-pointer" />
          </div>

          {/* Home Link */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-1 rtl:space-x-reverse cursor-pointer text-black font-semibold"
          >
            <span>صفحه اصلی</span>
            <Home className="w-5 h-5" />
          </button>

          {/* Profile Box */}
          <div className="flex w-[185.28px] h-[59px] items-center bg-[#8EB486] text-white px-7 py-2 space-x-2 rtl:space-x-reverse cursor-pointer rounded-full justify-center md:justify-start">
            <span>ALI_username</span>
            <User className="w-5 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderMap;
