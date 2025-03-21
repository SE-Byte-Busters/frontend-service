import SignUp from "@/components/auth/signup/SignUp";
export default function page({ params }: { params: { username?: string } }) {
  return (
    <div className="flex  justify-center mt-[140px] min-h-screen">
      <div className="flex flex-col gap-[18px] items-center text-center sm:w-[568px] sm:h-[672px] w-[315px] h-[681px] bg-[#FDF7F4] opacity-[95%] rounded-[80px] ">
        <SignUp />
      </div>
    </div>
  );
}
