import React, { useState } from 'react';
import Image from 'next/image';
import { useReport } from '@/context/ ReportContext';
import { Alert, AlertProps } from '@/components/Alert';

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
    const { isLocatedNeedle, setIsLocatedNeedle } = useReport();
    const { isVisible, setIsVisible } = useReport();
    const { showNeedleOrange, setShowNeedleOrange } = useReport();
    const [alert, setAlert] = useState<AlertProps | null>(null);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = () => {
    setIsLocatedNeedle(false)
    setIsVisible(true)

    const formData = {
      title,
      description,
      address,
      category,
      images,
    };
    if (onSubmit) onSubmit(formData);
    setAlert({
      message: "گزارش ثبت شد!",
      type: "success",
      duration: 3000,
      onClose: () => setAlert(null)
    });
  };

  const categories = [
    { id: 'cleaning', label: 'زباله و پاکسازی', icon: '/images/icons/bin.png' },
    { id: 'maintenance', label: 'خرابی یا تعمیرات', icon: '/images/icons/wrench.png' },
    { id: 'danger', label: 'خطرات احتمالی', icon: '/images/icons/danger.png' },
    { id: 'other', label: 'سایر موارد', icon: '/images/icons/question.png' },
  ];

  return (
    <div className={className}>
      {alert && <Alert {...alert} />}
      <div className=" grid grid-cols-12 md:flex-row gap-6 w-full p-6 bg-[#fff9f5] rounded-lg shadow-md min-h-screen" >
        {/* فرم */}
        <div className="col-span-5 space-y-4">
          <div>
            <label className="block mb-1 text-right text-[#685752] text-[24px] font-vazirmatn">عنوان گزارش</label>
            <label className="block mb-1 text-right text-[#685752]">یک جمله کوتاه و واضح برای عنوان مشکلت بنویس.</label>
            <input
              type="text"
              className="w-full border border-[#685752] p-2 rounded-[30px] text-[#685752]"
              placeholder="مثلا: دیواره کنار پل ترک برداشته"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 text-right text-[#685752] text-[24px] font-vazirmatn">توضیح مشکل</label>
            <label className="block mb-1 text-right text-[#685752]">یک جمله کوتاه و واضح برای عنوان مشکلت بنویس.</label>

            <textarea
              className="w-full border border-[#685752] p-2 rounded-[30px] text-[#685752]"
              placeholder="مثلا: ترک عمیق به‌وجود آمده و ترس ریزش پل وجود دارد."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 text-right text-[#685752] text-[24px] font-vazirmatn">آدرس حدودی</label>
            <label className="block mb-1 text-right text-[#685752]">یک جمله کوتاه و واضح برای عنوان مشکلت بنویس.</label>

            <input
              type="text"
              className="w-full border border-[#685752] p-2 rounded-[30px] text-[#685752]"
              placeholder="مثلا: تهران، خیابان ولیعصر، روبروی پارک دانشجو"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>


        </div>
        {/* تصاویر */}
        <div className="col-span-7">
          <h3 className="text-right mb-2 text-[#685752] ">ارسال عکس ها</h3>
          <div className="border border-dashed border-[#c1a291] p-6 rounded-md text-center flex flex-col justify-center items-center ">

            <Image src="/images/icons/cloudUpload.png" alt="cloud-upload" width={72} height={73} />
            <p className="text-md text-[#685752]">عکس‌های مربوط به گزارش را اینجا بکشید و رها کنید یا برای انتخاب از دستگاه خود کلیک کنید.</p>
            <p className="text-sm text-[#87878B]">حداکثر ۵ تصویر | فرمت‌های مجاز: JPG, PNG | حجم هر تصویر تا ۵ مگابایت</p>
            <div className="mb-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                id="image-upload"
                className="hidden"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer bg-[#6B5147] text-white py-2 px-6 rounded-xl inline-block text-sm text-center"
              >
                جستجو
              </label>
            </div>
          </div>
        </div>
        <div className='col-span-12'>
          <p className="text-md text-[#685752]">عکس‌های مربوط به گزارش را اینجا بکشید و رها کنید یا برای انتخاب از دستگاه خود کلیک کنید.</p>
          <p className="text-sm text-[#87878B]">حداکثر ۵ تصویر | فرمت‌های مجاز: JPG, PNG | حجم هر تصویر تا ۵ مگابایت</p>
        </div>

        <div className='col-span-6 space-y-0'>

          {/* انتخاب دسته‌بندی */}
          <Image src="/images/icons/tools.png" alt="tools" width={280} height={54} />

          <Image src="/images/icons/lightbulb.png" alt="lightbulb" width={280} height={54} />

          <Image src="/images/icons/trash.png" alt="trash" width={280} height={54} />




        </div>
        <div className='col-span-6 space-y-2'>
          <Image src="/images/icons/barrier.png" alt="barrier" width={320} height={74} />

          <Image src="/images/icons/smog.png" alt="smog" width={320} height={74} />
          <Image src="/images/icons/leaf.png" alt="leaf" width={320} height={74} />
        </div>
        <div className='col-span-12 text-center'>
          <button
            onClick={handleSubmit}
            className="bg-[#f89b2f] w-[234px] h-[44px] mt-4 py-2 rounded-full text-white shadow-md hover:bg-[#e38821] transition"
          >
            ثبت گزارش
          </button>
        </div>




      </div>


    </div >
  );
};

export default ReportForm;