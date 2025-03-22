import ForgetPassword from "@/components/auth/forgetPassword/ForgetPassword";
import Image from "next/image";
export default function page({ params }: { params: { username?: string } }) {
  return (
    <>
      <div className="relative flex  justify-center mt-[323px] min-h-screen">
        <Image
          src="/images-removebg.png"
          alt="Background Image"
          width={75.74}
          height={75.74}
          priority
          className="absolute top-[-45px] left-1/2 -translate-x-1/2 z-10"
        />
        <div className="flex flex-col  items-center text-center sm:w-[568px] sm:h-[261px] w-[315px] h-[261px] bg-[#FDF7F4] opacity-[95%] rounded-[80px] z-0">
          <ForgetPassword />
        </div>
      </div>
    </>
  );
}
