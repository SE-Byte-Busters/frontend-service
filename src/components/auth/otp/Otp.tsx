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
    const [alert, setAlert] = useState({ type: '', message: '' });


    const handleSubmit = async () => {
        console.log(JSON.stringify({
            code: code,
            method: "phone",
            _id: id,
            phoneNumber


        }))
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
            if (response.status >= 200 || response.status < 300) {
                setAlert({ type: 'success', message: 'تغییرات شما با موفقیت ذخیره شد.' });
            } else if (response.status == 400) {
                setAlert({ type: 'error', message: 'مقدار ورودی را درست وارد نمایید' });
            } else if (response.status == 403) {
                setAlert({ type: 'error', message: 'بیش از حد تلاش کرده اید' });
            } else if (response.status == 404) {
                setAlert({ type: 'error', message: 'مدت زمان استفاده از توکن گذشته است' });
            } else if (response.status >= 500 || response.status < 600) {
                setAlert({ type: 'error', message: 'خطای سرور. لطفاً بعداً تلاش کنید.' });
            }

            // مخفی شدن پیام بعد از ۲ ثانیه
            setTimeout(() => {
                setAlert({ type: '', message: '' });
            }, 2000);
            if (response.status >= 200 || response.status < 300) {
                router.push("/map"); // Navigate to map page after successful OTP verification
            }
        }
        catch (error) {
            setAlert({ type: 'error', message: 'خطای سرور. لطفاً بعداً تلاش کنید.' });
            setTimeout(() => {
                setAlert({ type: '', message: '' });
            }, 2000);
        }
    }

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
        <main>
            <section className="sm:w-[416px] w-[230px] mt-[62px]">
                <label className="block text-right text-[18px] font-semibold font-vazirmatn text-[#685752] uppercase mb-[8px]">
                    لطفا برای احراز هویت عدد ارسالی به شماره تلفن خود را وارد کنید
                </label>

                <input
                    className="w-full h-[30px] border border-[#A6A6A6] rounded-[20px] px-4 text-right text-[12px] font-roboto placeholder-[#A6A6A6] bg-[#FFF] focus:outline-none focus:border-[#997C70] text-[#685752]"
                    placeholder="عدد چهار رقمی خود را وارد کنید"
                    value={code} // Bind the input field to the code state
                    onChange={(e) => setCode(e.target.value)} // Update code state on input change
                />
            </section>

            <section className="sm:w-[416px] sm:h-[62px] w-[230px] h-[50px] mt-[2px]">
                <button
                    onClick={handleResendOtp}
                    className={`sm:w-[418px] sm:h-[52px] w-[231.81px] h-[42.15px] mt-[24px] sm:mt-[32px] text-[18px] font-semibold font-vazirmatn bg-accent bg-cover bg-center text-white py-2 px-6 rounded-[12px] hover:opacity-90 transition ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                // disabled={isDisabled}
                >
                    ارسال مجدد پیامک ({seconds}s)
                </button>
            </section>
            {alert.message && (
                <section
                    className={`fixed top-4 right-4 z-50
      ${alert.type === 'success' ? 'alert-success' : ''}
      ${alert.type === 'error' ? 'alert-error' : ''}
    `}
                    role="alert"
                >
                    <span>{alert.message}</span>
                    {alert.type === 'success' && (
                        <svg className="icon-success" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    )}
                    {alert.type === 'error' && (
                        <svg className="icon-error" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l6.518 11.597c.75 1.334-.214 2.995-1.743 2.995H3.482c-1.53 0-2.493-1.661-1.743-2.995L8.257 3.1z" clipRule="evenodd" />
                        </svg>
                    )}
                </section>
            )}
        </main>
    );
}
