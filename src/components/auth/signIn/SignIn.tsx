"use client";

import { useActionState, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { sendEmail } from "../../../lib/actions/sign-in";

// must imported for tailwind global
import '../../../app/globals.css';
import { useRouter } from "next/navigation";

interface FormData {
  userNameAndNumber: string;
  password: string;
}

const initialState = {
  errors: {
    userNameAndNumber: undefined,
    password: undefined,
  },
  success: undefined,
};

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction] = useActionState(sendEmail, initialState);

  const [formData, setFormData] = useState<FormData>({
    userNameAndNumber: "",
    password: "",
  });
  const [alert, setAlert] = useState({ type: '', message: '' });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async () => {
    try {

      const response = await fetch('https://shahriar.thetechverse.ir:3000/api/v1/auth/login', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: (state.type == "username") ? formData.userNameAndNumber : "+98" + formData.userNameAndNumber.replace(/^0/, ""),
          password: formData.password,
        }),
      });
      const data = await response.json();

      if (response.status >= 200 && response.status < 300) {
        setAlert({ type: 'success', message: 'تغییرات شما با موفقیت ذخیره شد.' });
      } else if (response.status >= 400 || response.status < 500) {
        setAlert({ type: 'error', message: 'در ثبت تغییرات مشکلی پیش آمد. لطفاً دوباره تلاش کنید.' });
      } else if (response.status >= 500 || response.status < 600) {
        setAlert({ type: 'error', message: 'خطای سرور. لطفاً بعداً تلاش کنید.' });
      }

      // مخفی شدن پیام بعد از ۲ ثانیه
      setTimeout(() => {
        setAlert({ type: '', message: '' });
      }, 2000);
      if (response.status >= 200 && response.status < 300) {
        router.push("/map"); // Navigate to map page after successful OTP verification
      }

    } catch (error) {
      setAlert({ type: 'error', message: 'خطای سرور. لطفاً بعداً تلاش کنید.' });
      setTimeout(() => {
        setAlert({ type: '', message: '' });
      }, 2000);
    }
  };

  useEffect(() => {
    console.log("Form State:", state); // اینو اضافه کن

    if (state.success) {
      handleSubmit();
    }
  }, [state.success]);


  return (
    <main>
      <form action={formAction}>

        <section className="sm:w-[416px]  w-[230px]  mt-[62px]  ">
          {/* add font  */}
          <label className="block text-right text-[18px] font-semibold font-vazirmatn text-[#685752] uppercase mb-[8px]">
            نام کاربری یا شماره تلفن
          </label>

          <input
            name="userNameAndNumber"
            value={formData.userNameAndNumber}
            onChange={handleChange}
            className="w-full h-[30px] text-[#685752] border border-[#A6A6A6] rounded-[20px] px-4 text-right text-[14px] font-roboto placeholder-[#A6A6A6] bg-[#FFF] focus:outline-none focus:border-[#997C70]"
            placeholder="نام کاربری خود را وارد کنید"
          />
          {state.errors?.userNameAndNumber && (
            <p className="text-red-500 text-sm">{state.errors.userNameAndNumber}</p>
          )}
        </section>

        <section className="sm:w-[416px]  w-[230px]  sm:mt-[8px] mt-[8px]">
          {/* add font  */}
          <label className="block text-right text-[18px] font-semibold font-vazirmatn text-[#685752] uppercase mb-[8px]">
            رمز عبور
          </label>

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className="w-full h-[30px] border border-[#A6A6A6] rounded-[20px] px-4 text-right text-[14px] text-[#685752] font-roboto placeholder-[#A6A6A6] bg-[#FFF] focus:outline-none focus:border-[#997C70]"
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
            {state.errors?.password && (
              <p className="text-red-500 text-sm">{state.errors.password}</p>
            )}
          </div>
        </section>
        <section className="sm:w-[416px] sm:h-[62px] w-[230px] h-[50px] mt-[8px] ">
          <button type="submit"
            className="sm:w-[418px] sm:h-[52px] w-[231.81px] h-[42.15px]  mt-[24px] sm:mt-[36px] text-[18px] font-semibold font-vazirmatn bg-accent bg-cover bg-center text-white py-2 px-6 rounded-[12px] hover:opacity-90 transition">
            ورود
          </button>
          <Link
            href="/auth/forget-password"
            className="block text-right  text-[#8EB486] text-[18px] font-semibold font-vazirmatn mt-[16px] "
          >
            آیا رمز خود را فراموش کرده اید ؟
          </Link>
          <Link
            href="/auth/sign-up"
            className="block text-right  text-[#8EB486] text-[18px] font-semibold font-vazirmatn mt-[16px] "
          >
            آیا ثبت نام نکرده اید؟
          </Link>
        </section>
      </form>
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
