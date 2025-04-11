"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from "next/navigation";

export default function Otp() {
    const [seconds, setSeconds] = useState(60);
    const [isDisabled, setIsDisabled] = useState(false);
    const [code, setCode] = useState(''); // State to store phone number
    const router = useRouter(); // Next.js router to redirect after successful OTP submission
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const phoneNumber = searchParams.get('phonenumber');

    const handleSubmit = async () => {
        try {
            const response = await fetch('https://shahriar.thetechverse.ir:3000/api/v1/auth/confirm-signup', {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code,
                    method: "phone",
                    _id: id,
                    phoneNumber


                }),
            });
            const data = await response.json();

            if (data.success) {
                router.push("/map"); // Navigate to map page after successful OTP verification
            } else {
                console.error('Failed to verify OTP:', data.message);
            }
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    useEffect(() => {
        if (seconds > 0) {
            const timer = setInterval(() => {
                setSeconds(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer); // Cleanup interval on unmount
        } else {
            setIsDisabled(false);
        }
    }, [seconds]);

    const handleResendOtp = () => {
        setSeconds(60); // Reset the timer
        setIsDisabled(true);
        // Add the resend OTP logic here (e.g., make an API request)
        handleSubmit(); // Trigger the submit handler to send the request again
    };

    return (
        <>
            <div className="sm:w-[416px] w-[230px] mt-[62px]">
                <label className="block text-right text-[18px] font-semibold font-vazirmatn text-[#685752] uppercase mb-[8px]">
                    لطفا برای احراز هویت عدد ارسالی به شماره تلفن خود را وارد کنید
                </label>

                <input
                    className="w-full h-[30px] border border-[#A6A6A6] rounded-[20px] px-4 text-right text-[12px] font-roboto placeholder-[#A6A6A6] bg-[#FFF] focus:outline-none focus:border-[#997C70] text-[#685752]"
                    placeholder="عدد چهار رقمی خود را وارد کنید"
                    value={code} // Bind the input field to the code state
                    onChange={(e) => setCode(e.target.value)} // Update code state on input change
                />
            </div>

            <div className="sm:w-[416px] sm:h-[62px] w-[230px] h-[50px] mt-[2px]">
                <button
                    onClick={handleResendOtp}
                    className={`sm:w-[418px] sm:h-[52px] w-[231.81px] h-[42.15px] mt-[24px] sm:mt-[32px] text-[18px] font-semibold font-vazirmatn bg-[url('/colorkitGreen.png')] bg-cover bg-center text-white py-2 px-6 rounded-[12px] hover:opacity-90 transition ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                // disabled={isDisabled}
                >
                    ارسال مجدد پیامک ({seconds}s)
                </button>
            </div>
        </>
    );
}
