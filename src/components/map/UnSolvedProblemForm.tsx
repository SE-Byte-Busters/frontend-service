'use client';

import React from 'react';
import Image from 'next/image';

interface ReportFormProps {
    onSubmit?: (data: any) => void;
    className?: string;
}

const UnSolvedProblemForm: React.FC<ReportFormProps> = ({ onSubmit, className }) => {
    // مقادیر داینامیک
    const totalVotes = 13;
    const positivePercent = 64;
    const negativePercent = 100 - positivePercent;

    return (
        <div dir="rtl" className="grid grid-cols-12 gap-6 p-6 bg-[#fff5f3] rounded-xl shadow-sm min-h-screen">
            {/* بخش اطلاعات و کامنت‌ها */}
            <div className="col-span-12 md:col-span-7 flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h2 className="font-bold text-lg text-gray-800">دیوار شکسته و خراب مغازه</h2>
                        <p className="text-sm text-gray-500">تاریخ ثبت: ۱۰ بهمن ۱۴۰۳</p>
                        <p className="text-sm text-gray-500">تهران، نرسیده به میدان توحید</p>
                    </div>
                    <div className="text-center text-sm text-gray-700">
                        <p className="text-xs">تاریخ حل مشکل:</p>
                        <p className="font-bold text-base">۱۰ بهمن ۱۴۰۳</p>
                        <p className="text-xs text-gray-500 mt-1">hamed_Gangi24</p>
                    </div>
                </div>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full w-fit text-sm font-semibold">
                    حل شده ✅
                </span>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">اولویت:</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">متوسط</span>
                </div>

                <div className="bg-white border rounded-xl p-4 space-y-3">
                    <textarea
                        placeholder="پیشنهاد و نظرت رو اینجا بنویس..."
                        className="w-full border border-gray-200 rounded-md p-2 resize-none outline-none focus:ring-1 focus:ring-orange-300 text-sm"
                    />
                    <div className="space-y-2 text-sm leading-relaxed text-gray-700">
                        <p><strong>saraAH:</strong> ظاهر مغازه رو خیلی بد کرده، لطفاً سریع‌تر رسیدگی شه.</p>
                        <p><strong>Hamid_453:</strong> بچه‌م از اینجا رد میشه، ترک دیوار خطرناکه.</p>
                        <p><strong>hamed_Gangi24:</strong> اگه لازم باشه خودم کمک می‌کنم رنگش کنیم!</p>
                    </div>
                </div>
            </div>

            {/* بخش تصویر و رأی‌دهی */}
            <div className="col-span-12 md:col-span-5 space-y-3">
                <Image src="/images/special/kharabi.png" alt="تصویر دیوار" width={350} height={310} />

                {/* نوار رأی‌دهی داینامیک */}
                <div className="w-full space-y-1">
                    <div className="flex w-full h-8 overflow-hidden rounded-full border border-gray-200 shadow-sm text-sm font-bold">
                        {/* درصد مخالف */}
                        <span className="text-green-600 font-semibold rounded-full">
                            <Image src="/images/icons/dislike.png" alt="like" width={56} height={64} />

                        </span>

                        <div
                            className="bg-red-200 text-red-600 flex items-center justify-center"
                            style={{
                                width: `${negativePercent}%`,
                                borderTopLeftRadius: '9999px',
                                borderBottomLeftRadius: '9999px',
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                            }}
                        >
                            {Math.round(negativePercent)}٪
                        </div>


                        {/* درصد موافق */}
                        <div
                            className="bg-green-200 text-green-600 flex items-center justify-center"
                            style={{
                                width: `${positivePercent}%`,
                                borderTopRightRadius: '9999px',
                                borderBottomRightRadius: '9999px',
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                            }}
                        >
                            {Math.round(positivePercent)}٪
                        </div>
                        <span className="text-red-500 font-semibold rounded-full">
                            <Image src="/images/icons/like.png" alt="like" width={56} height={64} />

                        </span>

                    </div>

                    <p className="text-center text-xs text-gray-700">{totalVotes} نفر رای داده‌اند</p>
                </div>
            </div>
        </div>
    );
};

export default UnSolvedProblemForm;
