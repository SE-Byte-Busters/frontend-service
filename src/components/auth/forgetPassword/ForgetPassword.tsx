// dont use client
// dont use server
// by importing in app/ alwayes is considered like use server

// static data without hooks and react components
import Link from "next/link";
export default function forgetPassword() {
  return (
    <>
      <div className="sm:w-[416px]  w-[230px]  mt-[62px]  ">
        {/* add font  */}
        <label className="block text-right text-[18px] font-semibold font-vazirmatn text-[#685752] uppercase mb-[8px]">
          نام کاربری یا شماره تلفن
        </label>

        <input
          className="w-full h-[30px] border border-[#A6A6A6] rounded-[20px] px-4 text-right text-[12px] font-roboto placeholder-[#A6A6A6] bg-[#FFF] focus:outline-none focus:border-[#997C70]"
          placeholder="نام کاربری یا شماره تلفن خود را وارد کنید"
        />
      </div>

      <div className="sm:w-[416px] sm:h-[62px] w-[230px] h-[50px] mt-[2px] ">
        <button className="sm:w-[418px] sm:h-[52px] w-[231.81px] h-[42.15px]  mt-[24px] sm:mt-[32px] text-[18px] font-semibold font-vazirmatn bg-accent bg-cover bg-center text-white py-2 px-6 rounded-[12px] hover:opacity-90 transition">
          بازیابی
        </button>
      </div>
    </>
  );
}
