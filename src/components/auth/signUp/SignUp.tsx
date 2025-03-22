"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  return (
    <>
      <div className="sm:w-[416px]  w-[230px]  mt-[24px]  ">
        {/* add font  */}
        <label className="block text-right text-[18px] font-semibold font-vazirmatn text-[#685752] uppercase mb-[8px]">
          نام کاربری
        </label>

        <input
          className="w-full h-[30px] border border-[#A6A6A6] rounded-[20px] px-4 text-right text-[14px] font-roboto placeholder-[#A6A6A6] bg-[#FFF] focus:outline-none focus:border-[#997C70]"
          placeholder="نام کاربری خود را وارد کنید"
        />
      </div>
      <div className="sm:w-[416px] sm:h-[62px] w-[230px] h-[50px] mt-[8px]">
        {/* add font  */}
        <label className="block text-right text-[18px] font-semibold font-vazirmatn text-[#685752] uppercase mb-[8px]">
          شماره تلفن
        </label>

        <input
          className="w-full h-[30px] border border-[#A6A6A6] rounded-[20px] px-4 text-right text-[14px] font-roboto placeholder-[#A6A6A6] bg-[#FFF] focus:outline-none focus:border-[#997C70]"
          placeholder="شماره تلفن خود را وارد کنید"
        />
      </div>
      <div className="sm:w-[416px]  w-[230px]  sm:mt-[8px] mt-[18px]">
        {/* add font  */}
        <label className="block text-right text-[18px] font-semibold font-vazirmatn text-[#685752] uppercase mb-[8px]">
          رمز عبور
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full h-[30px] border border-[#A6A6A6] rounded-[20px] px-4 text-right text-[14px] font-roboto placeholder-[#A6A6A6] bg-[#FFF] focus:outline-none focus:border-[#997C70]"
            placeholder="رمز عبور خود را وارد کنید"
          />
          {/* آیکون نمایش/مخفی رمز عبور */}
          <button
            type="button"
            className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#A6A6A6]"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      <div className="sm:w-[416px]  w-[230px]   mt-[8px]">
        {/* add font  */}
        <label className="block text-right text-[18px] font-semibold font-vazirmatn text-[#685752] uppercase mb-[8px]">
          تکرار رمز عبور
        </label>

        <div className="relative">
          <input
            type={showRePassword ? "text" : "password"}
            className="w-full h-[30px] border border-[#A6A6A6] rounded-[20px] px-4 text-right text-[14px] font-roboto placeholder-[#A6A6A6] bg-[#FFF] focus:outline-none focus:border-[#997C70]"
            placeholder="تکرار رمز عبور خود را وارد کنید"
          />
          <button
            type="button"
            className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#A6A6A6]"
            onClick={() => setShowRePassword(!showRePassword)}
          >
            {showRePassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <div className="sm:flex sm:flex-row-reverse block gap-[16px] ">
          <div className="sm:w-[200px] w-[230px] mt-[8px]  ">
            {/* add font  */}
            <label className="block text-right text-[18px] font-semibold font-vazirmatn text-[#685752] uppercase mb-[8px]">
              نام <span className="text-xs">(اختیاری)</span>
            </label>

            <input
              className="w-full h-[30px] border border-[#A6A6A6] rounded-[20px] px-4 text-right text-[14px] font-roboto placeholder-[#A6A6A6] bg-[#FFF] focus:outline-none focus:border-[#997C70]"
              placeholder="نام خود را وارد کنید"
            />
          </div>
          <div className="sm:w-[200px] w-[230px]  mt-[8px]">
            {/* add font  */}
            <label className="block text-right text-[18px] font-semibold font-vazirmatn text-[#685752] uppercase mb-[8px]">
              نام خانوادگی
              <span className="text-xs">(اختیاری)</span>
            </label>
            <input
              className="w-full h-[30px] border border-[#A6A6A6] rounded-[20px] px-4 text-right text-[14px] font-roboto placeholder-[#A6A6A6] bg-[#FFF] focus:outline-none focus:border-[#997C70]"
              placeholder="نام خانوادگی خود را وارد کنید"
            />
          </div>
        </div>
        <div className="sm:w-[416px] sm:h-[62px] w-[230px] h-[50px] mt-[8px] ">
          {/* add font  */}
          <label className="block text-right text-[18px] font-semibold font-vazirmatn text-[#685752] uppercase mb-[8px]">
            ایمیل <span className="text-xs">(اختیاری)</span>
          </label>

          <input
            className="w-full h-[30px] border border-[#A6A6A6] rounded-[20px] px-4 text-right text-[14px] font-roboto placeholder-[#A6A6A6] bg-[#FFF] focus:outline-none focus:border-[#997C70]"
            placeholder="ایمیل خود را وارد کنید"
          />
        </div>
        <button className="sm:w-[418px] sm:h-[52px] w-[231.81px] h-[42.15px]  mt-[32px] sm:mt-[28px] text-[18px] font-semibold font-vazirmatn bg-[url('/colorkitGreen.png')] bg-cover bg-center text-white py-2 px-6 rounded-[12px] hover:opacity-90 transition">
          عضو شدن
        </button>
        <Link
          href="/auth/sign-in"
          className="block text-right  text-[#8EB486] text-[18px] font-semibold font-vazirmatn mt-[16px] "
        >
          آیا قبلا ثبت نام کرده اید؟
        </Link>
      </div>
    </>
  );
}
