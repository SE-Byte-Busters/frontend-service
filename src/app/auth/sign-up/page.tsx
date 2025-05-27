import SignUp from "@/components/auth/signUp/SignUp";
import Image from "next/image";
export default function page() {
  return (
    <>
      <div className=" flex  justify-center mt-[228px] min-h-screen">
        <Image
          src="/images/logo.png"
          alt="Background Image"
          width={64}
          height={64}
          priority
          className="fixed top-[60px] left-1/2 -translate-x-1/2 z-10"
        />
        <div className="flex flex-col  items-center text-center sm:w-[568px] sm:h-[672px] w-[315px] h-[700px] bg-[#FDF7F4] opacity-[95%] rounded-[80px] z-0 fixed top-[100px]  ">
          <SignUp />
        </div>
      </div>
    </>
  );
}
