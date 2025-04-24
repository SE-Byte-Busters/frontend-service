import React, { useState } from 'react';
import Image from 'next/image';

interface ReportFormProps {
    onSubmit?: (data: any) => void;
    className?: string;
}

const ReportForm: React.FC<ReportFormProps> = ({ onSubmit, className }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [category, setCategory] = useState('');
    const [images, setImages] = useState<File[]>([]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleSubmit = () => {
        const formData = {
            title,
            description,
            address,
            category,
            images,
        };
        if (onSubmit) onSubmit(formData);
        alert("گزارش ثبت شد!");
    };

    const categories = [
        { id: 'cleaning', label: 'زباله و پاکسازی', icon: '/images/icons/bin.png' },
        { id: 'maintenance', label: 'خرابی یا تعمیرات', icon: '/images/icons/wrench.png' },
        { id: 'danger', label: 'خطرات احتمالی', icon: '/images/icons/danger.png' },
        { id: 'other', label: 'سایر موارد', icon: '/images/icons/question.png' },
    ];

    return (
        <div className={className}>
            <div className=" grid grid-cols-12 md:flex-row gap-6 w-full p-6 bg-[#fff9f5] rounded-lg shadow-md " >
                {/* فرم */}
                <div className="col-span-5 space-y-4">
                    <div>
                        <label className="block mb-1 text-right text-[#685752] text-[24px] font-vazirmatn">عنوان گزارش</label>
                        <label className="block mb-1 text-right text-[#685752]">یک جمله کوتاه و واضح برای عنوان مشکلت بنویس.</label>
                        <input
                            type="text"
                            className="w-full border border-[#685752] p-2 rounded-[30px]"
                            placeholder="مثلا: دیواره کنار پل ترک برداشته"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-right">توضیح مشکل</label>
                        <textarea
                            className="w-full border border-gray-300 p-2 rounded-md"
                            placeholder="مثلا: ترک عمیق به‌وجود آمده و ترس ریزش پل وجود دارد."
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-right">آدرس حدودی</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 p-2 rounded-md"
                            placeholder="مثلا: تهران، خیابان ولیعصر، روبروی پارک دانشجو"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    {/* انتخاب دسته‌بندی */}
                    <div>
                        <label className="block mb-2 text-right">انتخاب دسته بندی</label>
                        <div className="grid grid-cols-2 gap-3">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setCategory(cat.id)}
                                    className={`flex items-center gap-2 p-2 rounded-md border ${category === cat.id ? 'bg-[#fef1e8]' : 'bg-white'}`}
                                >
                                    <Image src={cat.icon} alt={cat.label} width={32} height={32} />
                                    <span className="text-right text-sm">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="bg-[#f89b2f] w-full mt-4 py-2 rounded-full text-white shadow-md hover:bg-[#e38821] transition"
                    >
                        ثبت گزارش
                    </button>
                </div>
                {/* تصاویر */}
                <div className="col-span-7">
                    <h3 className="text-right mb-2">ارسال عکس ها</h3>
                    <div className="border border-dashed border-[#c1a291] p-6 rounded-md text-center">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mb-4"
                        />
                        <p className="text-sm">عکس‌های مربوط به گزارش را اینجا بکشید و رها کنید یا برای انتخاب از دستگاه خود کلیک کنید.</p>
                    </div>
                </div>


            </div>
        </div >
    );
};

export default ReportForm;