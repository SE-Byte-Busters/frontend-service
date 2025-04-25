'use client';

<<<<<<< HEAD
import React, { useState } from 'react';
import Image from 'next/image';
=======
import React from 'react';
import Image from 'next/image';
import { Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
>>>>>>> 668d7ac (add : add features to map)

interface ReportFormProps {
    onSubmit?: (data: any) => void;
    className?: string;
}

const UnSolvedProblemForm: React.FC<ReportFormProps> = ({ onSubmit, className }) => {
<<<<<<< HEAD
    const totalVotes = 13;
    const positivePercent = 64;
    const negativePercent = 100 - positivePercent;
    const [description, setDescription] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [
        "/images/special/kharabi.png",
        "/images/special/kharabi.png",
        "/images/special/kharabi.png",

    ];
=======
    // مقادیر داینامیک
    const totalVotes = 13;
    const positivePercent = 64;
    const negativePercent = 100 - positivePercent;
>>>>>>> 668d7ac (add : add features to map)


    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div dir="rtl" className="grid grid-cols-12 gap-6 p-6 bg-[#fff5f3] rounded-xl shadow-sm min-h-screen">
            {/* بخش اطلاعات و کامنت‌ها */}
<<<<<<< HEAD
            <div className="col-span-12 md:col-span-7 flex flex-row">
                <div className="flex justify-between items-start flex-row">
                    <div>


                        <Image src="/images/icons/priorityMiddle.png" alt="profile" className="m-[10px]" width={150} height={150}></Image>
                        <label className="font-bold text-[24px] text-[#685752] font-vazirmatn m-[10px]">نظرات و پیشنهادات</label>

                        <textarea
                            className="w-[90%] border border-[#685752] p-3  m-2 rounded-[30px] text-[#685752]"
                            placeholder="مثلا: ترک عمیق به‌وجود آمده و ترس ریزش پل وجود دارد."
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />


                        <h2 className="flex border-b border-[#685752] pb-6 pt-4 m-2">
                            <span className="font-bold text-[20px] text-[#685752] font-vazirmatn ml-8">
                                JAVADI334                            </span>
                            <span className="font-bold text-[20px] text-[#685752] font-vazirmatn">
                                واقعا خطرناکه مخصوصاً شب‌ها که دیده نمی‌شه.                            </span>
                        </h2>
                        <h2 className="flex border-b border-[#685752] pb-6 pt-4 m-2">
                            <span className="font-bold text-[20px] text-[#685752] font-vazirmatn ml-8">
                                saraH12
                            </span>
                            <span className="font-bold text-[20px] text-[#685752] font-vazirmatn">
                                لطفاً یه تابلوی هشدار حداقل بذارید تا رسیدگی شه.                            </span>
                        </h2>
                        <h2 className="flex border-b border-[#685752] pb-6 pt-4 m-2">
                            <span className="font-bold text-[20px] text-[#685752] font-vazirmatn ml-8">
                                hamed_Gangi24                            </span>
                            <span className="font-bold text-[20px] text-[#685752] font-vazirmatn">
                                امروز بارون اومد، چاله پر آب شده بود!                            </span>
                        </h2>

                    </div>


                    <Image src="/images/icons/solved.png" alt="profile" width={80} height={40}></Image>

                    <textarea
                        className="w-[90%] border border-[#685752] p-3 m-2 rounded-[30px] text-[#685752]"
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

                <Image src="/images/icons/unSolved.png" alt="solved" width={80} height={40} />
            </div>

            {/* بخش تصویر و رأی‌دهی */}
            < div className="col-span-12 md:col-span-5 space-y-3" >
                {/* تغییر عکس اینجاست */}
                < div className="relative w-80 h-80 overflow-hidden rounded-xl mx-auto" >

                    <section className="flex items-center gap-2">
                        <Image src={images[currentIndex]}
                            className="object-cover"
                            alt="report" width={350} height={310} />

                    </section>

                    <button
                        onClick={prevSlide}
                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white rounded-full shadow"
                    >
                        <Image src="/images/icons/LeftArrow.png"
                            className="object-cover"
                            alt="report" width={50} height={50} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white rounded-full shadow"
                    >
                        <Image src="/images/icons/RightArrow.png"
                            className="object-cover"
                            alt="report" width={50} height={50} />
                    </button>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full ${idx === currentIndex ? "bg-green-400" : "bg-gray-300"
                                    }`}
                            />
                        ))}
                    </div>
                </div >

                {/* نوار رأی‌دهی داینامیک */}
                < div className="w-full space-y-1" >
                    <div className="flex w-full h-8 overflow-hidden rounded-full border border-gray-200 shadow-sm text-sm font-bold mt-[10px]">
                        {/* درصد مخالف */}
                        <span className="text-green-600 font-semibold rounded-full">
                            <Image src="/images/icons/dislike.png" alt="dislike" width={56} height={64} />
=======
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

>>>>>>> 668d7ac (add : add features to map)
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

<<<<<<< HEAD
=======

>>>>>>> 668d7ac (add : add features to map)
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
<<<<<<< HEAD

                        <span className="text-red-500 font-semibold rounded-full">
                            <Image src="/images/icons/like.png" alt="like" width={56} height={64} />
                        </span>
                    </div>

                    <p className="text-center text-xs text-gray-700">{totalVotes} نفر رای داده‌اند</p>

                    <section className="flex justify-between items-center gap-0 mt-10">
                        <Image src="/images/icons/profile.png" alt="profile" width={80} height={40} />
                        <section>
                            <h2 className="font-bold text-xl text-gray-800 mr-0 mt-4">دیوار شکسته و خراب مغازه</h2>
                            <h2 className="font-bold text-lg text-gray-800 mr-0">تاریخ ثبت گزارش : ۱۰ بهمن ۱۴۰۳</h2>
                            <h4 className="font-bold text-sm text-gray-800">hamed_Gangi24</h4>
                        </section>
                    </section>

                    <p className="text-[#000000] m-4">
                        دیوار سمت چپ مغازه پر از ترک‌خوردگی و نوشته‌های زشت شده. هم خطرناکه، هم ظاهر محل رو خراب کرده. لطفاً رسیدگی شه چون توی مسیر عبور بچه‌هاست.
                    </p>

                    <p className="text-[#000000] text-2xl font-bold m-4">تهران، نرسیده به میدان توحید</p>
                </div >
            </div >
        </div >
=======
                        <span className="text-red-500 font-semibold rounded-full">
                            <Image src="/images/icons/like.png" alt="like" width={56} height={64} />

                        </span>

                    </div>

                    <p className="text-center text-xs text-gray-700">{totalVotes} نفر رای داده‌اند</p>
                </div>
            </div>
        </div>
>>>>>>> 668d7ac (add : add features to map)
    );
};

export default UnSolvedProblemForm;
