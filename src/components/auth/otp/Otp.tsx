"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { Alert , AlertProps } from '@/components/Alert'

export default function Otp() {
  const [seconds, setSeconds] = useState(60);
  const [isDisabled, setIsDisabled] = useState(false);
  const [code, setCode] = useState(''); // State to store phone number
  const router = useRouter(); // Next.js router to redirect after successful OTP submission
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const phoneNumber = searchParams.get('phonenumber');
  const [alert, setAlert] = useState<AlertProps | null>(null);

  const handleSubmit = async () => {
    console.log(JSON.stringify({
      code: code,
      method: "phone",
      _id: id,
      phoneNumber: "+" + phoneNumber


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
      console.log(data)
      if (response.status >= 200 && response.status < 300) {
        setAlert({
          type: 'success',
          message: 'تغییرات شما با موفقیت ذخیره شد.',
          duration: 3000,
          onClose: () => setAlert(null)
        });
      } else if (response.status == 400) {
        setAlert({
          type: 'error',
          message: 'مقدار ورودی را درست وارد نمایید',
          duration: 3000,
          onClose: () => setAlert(null)
        });
      } else if (response.status == 403) {
        setAlert({
          type: 'error',
          message: 'بیش از حد تلاش کرده اید',
          duration: 3000,
          onClose: () => setAlert(null)
        });
      } else if (response.status == 404) {
        setAlert({
          type: 'error',
          message: 'مدت زمان استفاده از توکن گذشته است',
          duration: 3000,
          onClose: () => setAlert(null)
        });
      } else if (response.status >= 500 || response.status < 600) {
        setAlert({
          type: 'error',
          message: 'خطای سرور. لطفاً بعداً تلاش کنید.',
          duration: 3000,
          onClose: () => setAlert(null)
        });
      }

      if (response.status >= 200 && response.status < 300) {
        router.push("/map"); // Navigate to map page after successful OTP verification
      }
    }
    catch (error) {
      setAlert({
        type: 'error',
        message: 'خطای سرور. لطفاً بعداً تلاش کنید.',
        duration: 3000,
        onClose: () => setAlert(null)
      });
    }
  }
  const handleResendOtp = async () => {
    // console.log(JSON.stringify({
    //   code: code,
    //   method: "phone",
    //   _id: id,
    //   phoneNumber: "+" + phoneNumber


    // }))
    try {
      const response = await fetch('https://shahriar.thetechverse.ir:3000/api/v1/auth/resend-signup-otp', {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: "phone",
          _id: id,

        }),
      });
      const data = await response.json();
      console.log(data)
      if (response.status >= 200 && response.status < 300) {
        setAlert({
          type: 'success',
          message: 'ارسال مجدد انجام شد',
          duration: 3000,
          onClose: () => setAlert(null)
        });
      } else if (response.status == 400) {
        setAlert({
          type: 'error',
          message: 'مقدار ورودی را درست وارد نمایید',
          duration: 3000,
          onClose: () => setAlert(null)
        });
      } else if (response.status == 403) {
        setAlert({
          type: 'error',
          message: 'بیش از حد تلاش کرده اید',
          duration: 3000,
          onClose: () => setAlert(null)
        });
      } else if (response.status == 404) {
        setAlert({
          type: 'error',
          message: 'مدت زمان استفاده از توکن گذشته است',
          duration: 3000,
          onClose: () => setAlert(null)
        });
      } else if (response.status >= 500 || response.status < 600) {
        setAlert({
          type: 'error',
          message: 'خطای سرور. لطفاً بعداً تلاش کنید.',
          duration: 3000,
          onClose: () => setAlert(null)
        });
      }

      // if (response.status >= 200 && response.status < 300) {
      //   setAlert({
      //     type: 'success',
      //     message: '',
      //     duration: 3000,
      //     onClose: () => setAlert(null)
      //   });
      // }
    }
    catch (error) {
      setAlert({
        type: 'error',
        message: 'خطای سرور. لطفاً بعداً تلاش کنید.',
        duration: 3000,
        onClose: () => setAlert(null)
      });
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

  const handleSendOtp = () => {
    setSeconds(10); // Reset the timer
    setIsDisabled(true);
    // Add the resend OTP logic here (e.g., make an API request)
    handleSubmit(); // Trigger the submit handler to send the request again
  };

  return (
    <main>
      {alert && <Alert {...alert} />}
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
          onClick={handleSendOtp}
          className={`sm:w-[418px] sm:h-[52px] w-[231.81px] h-[42.15px] mt-[24px] sm:mt-[32px] text-[18px] font-semibold font-vazirmatn bg-accent bg-cover bg-center text-white py-2 px-6 rounded-[12px] hover:opacity-90 transition ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        // disabled={isDisabled}
        >
          تایید
        </button>
        <div className="flex  flex-col  items-start mt-1.5 px-2 text-[14px] text-[#685752] font-vazirmatn">
          <button
            onClick={handleResendOtp}
            disabled={isDisabled}
            className={` ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"}`}
          >
            ارسال مجدد ({seconds}s)
          </button>
          <button
            onClick={() => router.push('/auth/sign-up')}
            className=" hover:opacity-80 "
          >
            تغییر شماره
          </button>
        </div>
      </section>
    </main>
  );
}
