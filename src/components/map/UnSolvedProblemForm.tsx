'use client';

import React from 'react';
import Image from 'next/image';
import { Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

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
            <div dir="rtl" className="bg-[#fff5f3] rounded-xl p-5 w-full max-w-md mx-auto shadow-sm space-y-5">
                {/* بخش بالا: آیکون، وضعیت و تاریخ */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2 space-x-reverse">
                        <Image src="/images/special/pickaxe.png" alt="آیکون" width={40} height={40} />
                        <div className="flex flex-col items-start">
                            <span className="text-green-600 font-semibold text-lg">حل شده</span>
                        </div>
                    </div>

                    <div className="text-sm text-right">
                        <p className="text-gray-700">تاریخ حل مشکل: ۱۰ بهمن ۱۴۰۳</p>
                        <div className="flex items-center justify-end mt-1 space-x-2 space-x-reverse">
                            <Avatar sx={{ width: 24, height: 24 }}>
                                <PersonIcon sx={{ fontSize: 16 }} />
                            </Avatar>
                            <span className="text-gray-800 text-sm font-medium">hamed_Gangi24</span>
                        </div>
                    </div>
                </div>

                {/* اولویت */}
                <div className="flex items-center justify-end space-x-2 space-x-reverse">
                    <span className="text-sm text-gray-700">اولویت متوسط</span>
                    <span className="w-4 h-4 rounded-full bg-blue-600 inline-block" />
                </div>

                {/* نظرات */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800">نظرات و پیشنهادات</h3>

                    <textarea
                        placeholder="پیشنهاد و نظرت رو اینجا بنویس ..."
                        className="w-full h-20 border border-gray-300 rounded-lg p-2 text-sm resize-none outline-none focus:ring-1 focus:ring-orange-300 bg-white"
                    />

                    {/* نظرات کاربران */}
                    <div className="space-y-4 text-sm text-gray-800">
                        <div>
                            <p className="mb-1">ظاهر مغازه رو خیلی بد کرده، لطفاً سریع‌تر رسیدگی شه.</p>
                            <p className="text-xs text-gray-500 text-left">saraAH</p>
                            <hr className="my-2" />
                        </div>
                        <div>
                            <p className="mb-1">بچه‌م از اینجا رد میشه، ترک دیوار خطرناکه.</p>
                            <p className="text-xs text-gray-500 text-left">Hamid_453</p>
                            <hr className="my-2" />
                        </div>
                        <div>
                            <p className="mb-1">اگه لازم باشه خودم کمک می‌کنم رنگش کنیم!</p>
                            <p className="text-xs text-gray-500 text-left">hamed_Gangi24</p>
                        </div>
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
