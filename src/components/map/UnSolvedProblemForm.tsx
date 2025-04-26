'use client';

import React, { useState } from 'react';
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
    const [description, setDescription] = useState("")

    return (
        <div dir="rtl" className="grid grid-cols-12 gap-6 p-6 bg-[#fff5f3] rounded-xl shadow-sm min-h-screen">
            {/* بخش اطلاعات و کامنت‌ها */}
            <div className="col-span-12 md:col-span-7 flex flex-row space-y-4">
                <div className="flex justify-between items-start flex-row">
                    <div >
                        <section className="flex justify-between items-center">
                            <Image src="/images/icons/profile.png" alt="profile" width={80} height={40}></Image>
                            <section>
                                <h2 className="font-bold text-lg text-gray-800">تاریخ حل مشکل : ۱۰ بهمن ۱۴۰۳</h2>
                                <h4 className="font-bold text-sm text-gray-800">hamed_Gangi24</h4>

                            </section>

                        </section>
                        <Image src="/images/icons/priorityMiddle.png" alt="profile" className="m-[10px]" width={150} height={150}></Image>
                        <label className="font-bold text-[24px] text-[#685752] font-vazirmatn m-[10px]">نظرات و پیشنهادات</label>

                        <textarea
                            className="w-[90%] border border-[#685752] p-3  m-2 rounded-[30px] text-[#685752]"
                            placeholder="مثلا: ترک عمیق به‌وجود آمده و ترس ریزش پل وجود دارد."
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <h2 className="inline-block border-b border-[#685752] pb-6 pt-4 m-2">
                            <span className="font-bold text-[20px] text-[#685752] font-vazirmatn ml-8">
                                saraH
                            </span>
                            <span className="font-bold text-[20px] text-[#685752] font-vazirmatn">
                                من دارم میایم شما کجتاینن
                            </span>
                        </h2>
                        <h2 className="inline-block border-b border-[#685752] pb-6 pt-4 m-2">
                            <span className="font-bold text-[20px] text-[#685752] font-vazirmatn ml-8">
                                saraH
                            </span>
                            <span className="font-bold text-[20px] text-[#685752] font-vazirmatn">
                                من دارم میایم شما کجتاینن
                            </span>
                        </h2>
                        <h2 className="inline-block border-b border-[#685752] pb-6 pt-4 m-2">
                            <span className="font-bold text-[20px] text-[#685752] font-vazirmatn ml-8">
                                saraH
                            </span>
                            <span className="font-bold text-[20px] text-[#685752] font-vazirmatn">
                                من دارم میایم شما کجتاینن
                            </span>
                        </h2>

                    </div>


                    <Image src="/images/icons/solved.png" alt="profile" width={80} height={40}></Image>


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
        </div >
    );
};

export default UnSolvedProblemForm;
