import Image from 'next/image'
import React from 'react'

const Category = () => {
  return (
    <div className='col-span-2 mt-4 w-full'>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4'>
        <div className='flex items-center justify-between'>
          <label htmlFor="greenSpace" className='checkbox-label flex items-center justify-between gap-4 cursor-pointer'>
            <input type="checkbox" hidden name="greenSpace" id="greenSpace" />
            <div className='img-wrapper  p-4 w-[60px] h-[60px] rounded-xl transition'>
              <Image src="/images/graphics/leaf1.svg" alt="leaf" width={50} height={50} className='w-full h-full object-cover' />
            </div>
            <div>
              <span className='block text-sm md:text-md font-bold transition'>فضای سبز و درختان</span>
              <span className='block text-sm md:text-md transition'>آسیب به درختان یا وضعیت نامناسب پارک</span>
            </div>
          </label>
        </div>
        <div className='flex items-center justify-between'>
          <label htmlFor="garbage" className='checkbox-label flex items-center justify-between gap-4 cursor-pointer'>
            <input type="checkbox" hidden name="garbage" id="garbage" />
            <div className='img-wrapper  p-4 w-[60px] h-[60px] rounded-xl transition'>
              <Image src="/images/graphics/trash.svg" alt="leaf" width={50} height={50} className='w-full h-full object-cover' />
            </div>
            <div>
              <span className='block text-sm md:text-md font-bold transition'>زباله و نظافت</span>
              <span className='block text-sm md:text-md transition'>رها شدن زباله یا سطح های پر و آلوده</span>
            </div>
          </label>
        </div>
        <div className='flex items-center justify-between'>
          <label htmlFor="visualPollution" className='checkbox-label flex items-center justify-between gap-4 cursor-pointer'>
            <input type="checkbox" hidden name="visualPollution" id="visualPollution" />
            <div className='img-wrapper  p-4 w-[60px] h-[60px] rounded-xl transition'>
              <Image src="/images/graphics/paint.svg" alt="leaf" width={50} height={50} className='w-full h-full object-cover' />
            </div>
            <div>
              <span className='block text-sm md:text-md font-bold transition'>دیوارنویسی و آلودگی بصری</span>
              <span className='block text-sm md:text-md transition'>نوشته ها یا تبلیغات نا زیبا روی دیوار</span>
            </div>
          </label>
        </div>
        <div className='flex items-center justify-between'>
          <label htmlFor="lighting" className='checkbox-label flex items-center justify-between gap-4 cursor-pointer'>
            <input type="checkbox" hidden name="lighting" id="lighting" />
            <div className='img-wrapper  p-4 w-[60px] h-[60px] rounded-xl transition'>
              <Image src="/images/graphics/bulb.svg" alt="leaf" width={50} height={50} className='w-full h-full object-cover' />
            </div>
            <div>
              <span className='block text-sm md:text-md font-bold transition'>روشنایی معابر</span>
              <span className='block text-sm md:text-md transition'>چراغ خاموش یا نور ناکافی در خیابان</span>
            </div>
          </label>
        </div>
        <div className='flex items-center justify-between'>
          <label htmlFor="safety" className='checkbox-label flex items-center justify-between gap-4 cursor-pointer'>
            <input type="checkbox" hidden name="safety" id="safety" />
            <div className='img-wrapper  p-4 w-[60px] h-[60px] rounded-xl transition'>
              <Image src="/images/graphics/hurdle.svg" alt="leaf" width={50} height={50} className='w-full h-full object-cover' />
            </div>
            <div>
              <span className='block text-sm md:text-md font-bold transition'>ایمنی و خطرات شهری</span>
              <span className='block text-sm md:text-md transition'>محل ناایمن مثل چاه باز یامانع خطرناک</span>
            </div>
          </label>
        </div>
        <div className='flex items-center justify-between'>
          <label htmlFor="injury" className='checkbox-label flex items-center justify-between gap-4 cursor-pointer'>
            <input type="checkbox" hidden name="injury" id="injury" />
            <div className='img-wrapper  p-4 w-[60px] h-[60px] rounded-xl transition'>
              <Image src="/images/graphics/tools.svg" alt="leaf" width={50} height={50} className='w-full h-full object-cover' />
            </div>
            <div>
              <span className='block text-sm md:text-md font-bold transition'>خرابی و آسیب دیدگی</span>
              <span className='block text-sm md:text-md transition'>چاله، جدول شکسته یا تجهیزات خراب</span>
            </div>
          </label>
        </div>
      </div>
      <button type="submit" className='block px-4 py-2 mx-auto my-4 w-1/3 shadow-lg shadow-gray-400  cursor-pointer font-bold text-xl lg:text-2xl rounded-full bg-orange-400 hover:bg-orange-300 transition-colors duration-200'>ثبت گزارش</button>
    </div>

  )
}

export default Category