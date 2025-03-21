import React from "react";

export default function page({ params }: { params: { username?: string } }) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-[568px] h-[672px] bg-white rounded-[80px] flex flex-col justify-center items-center text-center">
        <div className="w-[416px] h-[62px]  ">
          <label className="block text-right text-3xl ">نام کاربری</label>
          <input
            className="w-full h-[40px] border border-[#A6A6A6] rounded-[20px] px-4 text-right text-[12px] font-roboto placeholder-[#A6A6A6] focus:outline-none focus:border-[#997C70]"
            placeholder="نام کاربری خود را وارد کنید"
            defaultValue={params?.username || ""}
          />
        </div>
      </div>
    </div>
  );
}
