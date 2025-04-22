'use client';

import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const HeaderMap: React.FC = () => {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="w-full flex justify-center ">



      {/* حالت دسکتاپ (بدون تغییر) */}
      <div className=" absolute top-10 z-10">
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




      </div>
    </div>
  );
};

export default HeaderMap;
