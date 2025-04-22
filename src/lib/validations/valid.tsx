// validationSchema.ts
import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().min(3, "نام کاربری باید حداقل ۳ حرف باشد"),
  phone: z.string().regex(/^09\d{9}$/, "شماره تلفن معتبر نیست"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
  confirmPassword: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("ایمیل معتبر نیست").optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "رمز عبور و تکرار آن یکسان نیستند",
  path: ["confirmPassword"],
});
