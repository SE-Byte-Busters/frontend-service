"use client";

import { useActionState, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { sendEmail } from "@/lib/actions/act";
import { useRouter } from "next/navigation";
import { Alert, AlertProps } from '@/components/Alert'

import '@/app/globals.css';


interface FormData {
  userName: string;
  number: string;
  password: string;
  rePassword: string;
  email: string;
  firstName: string;
  lastName: string;
}

const initialState = {
  errors: {
    userName: undefined,
    number: undefined,
    password: undefined,
    rePassword: undefined,
  },
  success: undefined,
};

export default function SignUp() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [state, formAction] = useActionState(sendEmail, initialState);
  const [alert, setAlert] = useState<AlertProps | null>(null);

  const [formData, setFormData] = useState<FormData>({
    userName: "",
    number: "",
    password: "",
    rePassword: "",
    email: "",
    firstName: "",
    lastName: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {

      const response = await fetch('https://shahriar.thetechverse.ir:3000/api/v1/auth/signup', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.userName,
          phoneNumber: "+98" + formData.number.replace(/^0/, ""),
          password: formData.password,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });
      const data = await response.json();

      if (response.status >= 200 && response.status < 300) {
        setAlert({
          type: 'success',
          message: 'صبت نام اولیه شما با موفقیت انجام شد.',
          duration: 3000,
          onClose: () => setAlert(null)
        });
      } else if (response.status >= 400 || response.status < 500) {
        setAlert({
          type: 'error',
          message: '.شما قبلا ثبت نام کرده اید',
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
        router.push(`/auth/otp?id=${data.data._id}&phonenumber=${data.data.otpSentTo}`);
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'خطای سرور. لطفاً بعداً تلاش کنید.',
        duration: 3000,
        onClose: () => setAlert(null)
      });
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
      {alert && <Alert {...alert} />}
      <form action={formAction}>

        <section className="sm:w-[416px] w-[230px] mt-[24px]">
          <label className="block text-right text-[18px] font-semibold font-vazirmatn text-[#685752] uppercase mb-[8px]">
            نام کاربری
          </label>
          <input
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className="w-full h-[30px] border border-[#A6A6A6] rounded-[20px] px-4 text-right text-[14px] font-roboto placeholder-[#A6A6A6] bg-[#FFF] focus:outline-none focus:border-[#997C70] text-[#685752]"
            placeholder="نام کاربری خود را وارد کنید"
          />
          {state.errors?.userName && (
            <p className="text-red-500 text-sm">{state.errors.userName}</p>
          )}
        </section>

        {/* Other form fields remain the same as in your original code */}
        {/* Number field */}
        <section className="sm:w-[416px] sm:h-[62px] w-[230px] h-[50px] mt-[8px]">
          <label className="block text-right text-[18px] font-semibold font-vazirmatn text-[#685752] uppercase mb-[8px]">
            شماره تلفن
          </label>
          <input
            name="number"
            value={formData.number}
            onChange={handleChange}
            className="w-full h-[30px] border border-[#A6A6A6] rounded-[20px] px-4 text-right text-[14px] font-roboto placeholder-[#A6A6A6] bg-[#FFF] focus:outline-none focus:border-[#997C70] text-[#685752]"
            placeholder="شماره تلفن خود را وارد کنید"
          />
          {state.errors?.number && (
            <p className="text-red-500 text-sm">{state.errors.number}</p>
          )}
        </section>

        {/* Password field */}
        <section className="sm:w-[416px] w-[230px] sm:mt-[8px] mt-[18px]">
          <label className="block text-right text-[18px] font-semibold font-vazirmatn uppercase mb-[8px] text-[#685752]">
            رمز عبور
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className="w-full h-[30px] border border-[#A6A6A6] rounded-[20px] px-4 text-right text-[14px] font-roboto placeholder-[#A6A6A6] bg-[#FFF] focus:outline-none focus:border-[#997C70] text-[#685752]"
              placeholder="رمز عبور خود را وارد کنید"
            />
            <button
              type="button"
              className={`absolute ${state.errors?.password ? 'top-4' : 'top-1/2'} left-3 transform -translate-y-1/2 text-[#A6A6A6]`}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {state.errors?.password && (
              <p className="text-red-500 text-sm">{state.errors.password}</p>
            )}
          </div>
        </section>

        {/* Repeat Password field */}
        <section className="sm:w-[416px] w-[230px] mt-[8px]">
          <label className="block text-right text-[18px] font-semibold font-vazirmatn text-[#685752] uppercase mb-[8px] text-[#685752]">
            تکرار رمز عبور
          </label>
          <div className="relative">
            <input
              name="rePassword"
              type={showRePassword ? "text" : "password"}
              value={formData.rePassword}
              onChange={handleChange}
              className="w-full h-[30px] border border-[#A6A6A6] rounded-[20px] px-4 text-right text-[14px] font-roboto placeholder-[#A6A6A6] bg-[#FFF] focus:outline-none focus:border-[#997C70] text-[#685752]"
              placeholder="تکرار رمز عبور خود را وارد کنید"
            />
            <button
              type="button"
              className={`absolute ${state.errors?.rePassword ? 'top-4' : 'top-1/2'} left-3 transform -translate-y-1/2 text-[#A6A6A6]`}
              onClick={() => setShowRePassword(!showRePassword)}
            >
              {showRePassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {state.errors?.rePassword && (
              <p className="text-red-500 text-sm">{state.errors.rePassword}</p>
            )}
          </div>
        </section>

        {/* First Name and Last Name fields */}
        <section className="sm:flex sm:flex-row-reverse block gap-[16px]">
          <section className="sm:w-[200px] w-[230px] mt-[8px]">
            <label className="block text-right text-[18px] font-semibold font-vazirmatn text-[#685752] uppercase mb-[8px]">
              نام <span className="text-xs">(اختیاری)</span>
            </label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full h-[30px] border border-[#A6A6A6] rounded-[20px] px-4 text-right text-[14px] font-roboto placeholder-[#A6A6A6] bg-[#FFF] focus:outline-none focus:border-[#997C70] text-[#685752]"
              placeholder="نام خود را وارد کنید"
            />
          </section>
          <section className="sm:w-[200px] w-[230px] mt-[8px]">
            <label className="block text-right text-[18px] font-semibold font-vazirmatn uppercase mb-[8px] text-[#685752]">
              نام خانوادگی
              <span className="text-xs">(اختیاری)</span>
            </label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full h-[30px] border border-[#A6A6A6] rounded-[20px] px-4 text-right text-[14px] font-roboto placeholder-[#A6A6A6] bg-[#FFF] focus:outline-none focus:border-[#997C70] text-[#685752]"
              placeholder="نام خانوادگی خود را وارد کنید"
            />
          </section>
        </section>

        {/* Email field */}
        <section className="sm:w-[416px] sm:h-[62px] w-[230px] h-[50px] mt-[8px]">
          <label className="block text-right text-[18px] font-semibold font-vazirmatn text-[#685752] uppercase mb-[8px]">
            ایمیل
          </label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full h-[30px] border border-[#A6A6A6] rounded-[20px] px-4 text-right text-[14px] font-roboto placeholder-[#A6A6A6] bg-[#FFF] focus:outline-none focus:border-[#997C70] text-[#685752]"
            placeholder="ایمیل خود را وارد کنید"
          />
        </section>

        <button
          type="submit"
          className="sm:w-[418px] sm:h-[52px] w-[231.81px] h-[42.15px] mt-[32px] sm:mt-[28px] text-[18px] font-semibold font-vazirmatn bg-accent bg-cover bg-center text-white py-2 px-6 rounded-[12px] hover:opacity-90 transition disabled:opacity-70"
        >
          ثبت نام
        </button>

        <Link href="/auth/sign-in" className="block text-right text-[#8EB486] text-[18px] font-semibold font-vazirmatn mt-[16px]">
          آیا قبلا ثبت نام کرده اید؟
        </Link>

      </form>
    </main>
  );
}

