import React, { useState } from 'react';
import Image from 'next/image';
import { useReport } from '@/context/ReportContext';
import { Alert, AlertProps } from '@/components/Alert';
import ImageUploader from './ImageUploader';
import Category from './Category';
import { setTimeout } from 'timers';

interface ReportFormProps {
  onSubmit?: (data: any) => void;
  className?: string;
}

const ReportForm: React.FC<ReportFormProps> = ({ onSubmit, className }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState([
    { id: 'cleaning', label: 'زباله و پاکسازی', icon: '/images/icons/bin.png' },
    { id: 'maintenance', label: 'خرابی یا تعمیرات', icon: '/images/icons/wrench.png' },
    { id: 'danger', label: 'خطرات احتمالی', icon: '/images/icons/danger.png' },
    { id: 'other', label: 'سایر موارد', icon: '/images/icons/question.png' },
  ]);
  const [images, setImages] = useState<File[]>([]);
  const { isLocatedNeedle, setIsLocatedNeedle } = useReport();
  const { isVisible, setIsVisible } = useReport();
  const { showNeedleOrange, setShowNeedleOrange } = useReport();
  const { position, setPosition } = useReport();

  const { imagesToSend, setImagesToSend } = useReport();
  const { alert, setAlert } = useReport();


  const { isReporting, setIsReporting } = useReport();




  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };


  // const handleSubmit = () => {
  //     setIsLocatedNeedle(false)
  //     setIsVisible(true)
  //     setShowNeedleOrange(false)
  //     const formData = {
  //         title,
  //         description,
  //         approximatePosition: address,
  //         city: "Tehran",
  //         category,
  //         imagesToSend,
  //         position
  //     };
  //     // if (onSubmit) onSubmit(formData);

  //     console.log(formData)
  // };

  const handleSubmit = async () => {
    try {
      setIsLocatedNeedle(false);
      setIsVisible(true);
      setShowNeedleOrange(false);

      // ایجاد FormData
      const formData = new FormData();

      // اضافه کردن فیلدهای اجباری
      formData.append("title", title);
      formData.append("description", description);
      formData.append("approximatePosition", address);
      formData.append("city", "Tehran");

      // مدیریت category با مقدار پیش‌فرض
      const defaultCategory = "cleaning"; // مقدار پیش‌فرض
      let categoryString = defaultCategory;

      if (Array.isArray(category) && category.length > 0) {
        categoryString = category.join(",");
      } else if (typeof category === 'string') {
        categoryString = category;
      }

      formData.append("category", categoryString);

      // موقعیت جغرافیایی
      formData.append("location", JSON.stringify({
        type: "Point",
        coordinates: position || [0, 0] // مقدار پیش‌فرض
      }));

      // اضافه کردن تصاویر
      imagesToSend.forEach((file) => {
        formData.append("images", file);
      });

      // دیباگ: نمایش محتوای FormData
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value instanceof File ? `${value.name} (File)` : value);
      }

      // ارسال درخواست
      const token = localStorage.getItem('token');
      const response = await fetch("https://shahriar.thetechverse.ir:3000/api/v1/report/create-report", {
        method: "POST",
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // مدیریت پاسخ
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `خطای سرور: ${response.status}`);
      }

      const data = await response.json();
      console.log("Success:", data);
      setAlert({
        type: 'success', message: 'گزارش با موفقیت ارسال شد.'
      });

      setTimeout(() => {
        setAlert(null)
      }, 3000)


    } catch (error) {
      console.error("Error:", error);
      setAlert({
        type: 'error',
        message: error instanceof Error
          ? error.message
          : 'خطا در ارسال گزارش'
      });
    }
  };


  return (
    <div className={className}>
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

          <ImageUploader />

        </div>
        <div className='col-span-12'>
          <label className="block mb-1 text-right text-[#685752] text-[24px] font-vazirmatn">انتخاب دسته بندی</label>

          <p className="text-sm text-[#87878B]">نوع مشکلی که میخوای گزارش بدی را انتخاب کن. این کمک می کنه گزارش سریع تر بررسی بشه</p>
        </div>

        <div className='col-span-6 space-y-0'>


          <Image src="/images/icons/tools.png" alt="tools" width={280} height={54} />

          <Image src="/images/icons/lightbulb.png" alt="lightbulb" width={280} height={54} />

          <Image src="/images/icons/trash.png" alt="trash" width={280} height={54} />

          {/* <Category /> */}
        </div>
        <div className='col-span-6 space-y-2'>
          <Image src="/images/icons/barrier.png" alt="barrier" width={320} height={74} />

          <Image src="/images/icons/smog.png" alt="smog" width={320} height={74} />
          <Image src="/images/icons/leaf.png" alt="leaf" width={320} height={74} />
        </div>




        <div className='col-span-12 text-center flex justify-center'>
          <button
            onClick={handleSubmit}
            className="bg-[#f89b2f] w-[234px] h-[44px] mt-4 py-2 rounded-full text-white shadow-md hover:bg-[#e38821] transition"
          >
            ثبت گزارش
          </button>
          <button
            onClick={() => {
              setIsReporting(true);
              setIsLocatedNeedle(false);
              setIsVisible(true);

            }}
          // className="bg-transparent border-0 p-0"
          >
            <Image
              src="/images/icons/X.png"  // مسیر تصویر لغو
              alt="Background Image"
              width={64}
              height={64}
              className="w-10 h-10"  // سایز دلخواه برای عکس
            />
          </button>
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
      {/* <div className='col-span-12 text-center'>
        <button
          onClick={handleSubmit}
          className="bg-[#f89b2f] w-[234px] h-[44px] mt-4 py-2 rounded-full text-white shadow-md hover:bg-[#e38821] transition"
        >
          ثبت گزارشننننی
        </button>
        <button
          onClick={() => {
            setIsReporting(true);
            setIsLocatedNeedle(true);

          }}
        // className="bg-transparent border-0 p-0"
        >
          <Image
            src="/images/icons/X.png"  // مسیر تصویر لغو
            alt="Background Image"
            width={64}
            height={64}
            className="w-10 h-10"  // سایز دلخواه برای عکس
          />
        </button>

      </div> */}




    </div >

  );
}





export default ReportForm;