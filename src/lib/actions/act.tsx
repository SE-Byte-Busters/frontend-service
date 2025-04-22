"use server";

import { z } from "zod";

// Define the return type for the server action
type FormState = {
  errors?: {
    userName?: string[];
    number?: string[];
    password?: string[];
    rePassword?: string[];
  };
  success?: any;
  message?: string;
};

const contactFormSchema = z.object({
  userName: z.string().trim().min(1, { message: "لطفا نام خود را وارد کنید" }),
  number: z.string().trim(),
  password: z.string().trim().min(1, { message: "لطفا رمز عبور را وارد کنید" }),
  rePassword: z.string().trim().min(1, { message: "لطفا رمز عبور خود را تایید کنید" }),
}).superRefine((data, ctx) => {
  if (!data.number) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "شماره موبایل الزامی است",
      path: ["number"],
    });
  } else if (!/^\d{10,15}$/.test(data.number)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "شماره باید بین ۱۰ تا ۱۵ رقم باشد",
      path: ["number"],
    });
  }

  if (data.password !== data.rePassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "رمزهای عبور با هم مطابقت ندارند",
      path: ["rePassword"],
    });
  }
});

export async function sendEmail(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const contactFormData = Object.fromEntries(formData);
  const validatedContactFormData = contactFormSchema.safeParse(contactFormData);

  if (!validatedContactFormData.success) {
    const formFieldErrors = validatedContactFormData.error.flatten().fieldErrors;
    return {
      errors: {
        userName: formFieldErrors.userName,
        number: formFieldErrors.number,
        password: formFieldErrors.password,
        rePassword: formFieldErrors.rePassword,
      },
      success: false,
    };
  }

  return {
    errors: undefined,
    success: true,
    message: "پیام شما با موفقیت ارسال شد!",
  };
}