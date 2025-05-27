"use server";

import { z } from "zod";

type FormState = {
    errors?: {
        userNameAndNumber?: string[];
        password?: string[];
    };
    success?: boolean;
    message?: string;
    type?: "number" | "username"; // 🔥 این اضافه شده
};

const contactFormSchema = z.object({
    userNameAndNumber: z.string().trim().min(1, { message: "لطفا نام کاربری یا شماره را وارد کنید" }),
    password: z.string().trim().min(1, { message: "لطفا رمز عبور را وارد کنید" }),
}).superRefine((data, ctx) => {
    const value = data.userNameAndNumber;

    if (/^\d+$/.test(value)) {
        if (!/^\d{10,15}$/.test(value)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "شماره موبایل باید بین ۱۰ تا ۱۵ رقم باشد",
                path: ["userNameAndNumber"],
            });
        }
    } else {
        if (value.length < 3) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "نام کاربری باید حداقل ۳ کاراکتر باشد",
                path: ["userNameAndNumber"],
            });
        }
    }
});

export async function sendEmail(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    const contactFormData = Object.fromEntries(formData);
    const validated = contactFormSchema.safeParse(contactFormData);

    if (!validated.success) {
        const fieldErrors = validated.error.flatten().fieldErrors;
        return {
            errors: {
                userNameAndNumber: fieldErrors.userNameAndNumber,
                password: fieldErrors.password,
            },
            success: false,
        };
    }

    const { userNameAndNumber } = validated.data;

    const type: "number" | "username" = /^\d+$/.test(userNameAndNumber) ? "number" : "username";

    return {
        errors: undefined,
        success: true,
        message: "پیام شما با موفقیت ارسال شد!",
        type, // 👈 خروجی نهایی که مشخص می‌کنه نوع چی بوده
    };
}
