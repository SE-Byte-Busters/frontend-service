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




  const handleSubmit = async () => {
    try {

      if (!images || !title || !description || !address) {
        setAlert({
          type: 'error',
          message: "لطفا تمام فیلد هارا پر کنید!!"
        });
        setTimeout(() => {
          setAlert(null)
        }, 3000);
        return;

      }
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


      {/* 
          failure => tools
          lightbulb => lightbulb
          trash => trash
          unsafe = < Barrier
            smog => smog
          nature => leaf */}
      let categoryList = [];
      if (isSelTools) categoryList.push("failure")
      if (isSelLightbulb) categoryList.push("lightbulb")
      if (isSelBarrier) categoryList.push("unsafe")
      if (isSelTrash) categoryList.push("trash")
      if (isSelSmog) categoryList.push("smog")
      if (isSelLeaf) categoryList.push("leaf")

      let categoryString = "";
      if (categoryList.length > 0) {
        categoryString = categoryList.join(",");
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
      setTimeout(() => {
        setAlert(null)
      }, 3000)
    }
  };


  // State to track if the user has interacted with the field
  const [isTitleTouched, setIsTitleTouched] = useState(false);
  const [isDescriptionTouched, setIsDescriptionTouched] = useState(false);
  const [isAddressTouched, setIsAddressTouched] = useState(false);

  const [isSelTools, setIsSelTools] = useState(false);
  const [isSelLightbulb, setIsSelLightbulb] = useState(false);
  const [isSelTrash, setIsSelTrash] = useState(false);
  const [isSelBarrier, setIsSelBarrier] = useState(false);
  const [isSelSmog, setIsSelSmog] = useState(false);
  const [isSelLeaf, setIsSelLeaf] = useState(false);





  // Helper function to determine border color class
  const getBorderClass = (value: any, isTouched: any) => {
    if (value) return 'border-green-500'; // If there's a value, border is green
    if (isTouched) return 'border-red-500';  // If touched and empty, border is red
    return 'border-[#685752]';             // Default border color
  };



  return (
    <div className={className}>
      <div className=" grid grid-cols-12 md:flex-row gap-6 w-full p-6 bg-[#fff9f5] rounded-lg shadow-md min-h-screen" >
        <div className="col-span-5 space-y-4">
          <div>
            <label className="block mb-1 text-right text-[#685752] text-[24px] font-vazirmatn">عنوان گزارش</label>
            <label className="block mb-1 text-right text-[#685752]">یک جمله کوتاه و واضح برای عنوان مشکلت بنویس.</label>
            <input
              type="text"
              className={`w-full border p-2 rounded-[30px] text-[#685752] ${getBorderClass(title, isTitleTouched)}`}
              placeholder="مثلا: دیواره کنار پل ترک برداشته"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setIsTitleTouched(true)} // Mark as touched when the user clicks away
            />
          </div>
          <div>
            <label className="block mb-1 text-right text-[#685752] text-[24px] font-vazirmatn">توضیح مشکل</label>
            <label className="block mb-1 text-right text-[#685752]">یک جمله کوتاه و واضح برای عنوان مشکلت بنویس.</label>
            <textarea
              className={`w-full border p-2 rounded-[30px] text-[#685752] ${getBorderClass(description, isDescriptionTouched)}`}
              placeholder="مثلا: ترک عمیق به‌وجود آمده و ترس ریزش پل وجود دارد."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => setIsDescriptionTouched(true)} // Mark as touched
            />
          </div>
          <div>
            <label className="block mb-1 text-right text-[#685752] text-[24px] font-vazirmatn">آدرس حدودی</label>
            <label className="block mb-1 text-right text-[#685752]">یک جمله کوتاه و واضح برای عنوان مشکلت بنویس.</label>
            <input
              type="text"
              className={`w-full border p-2 rounded-[30px] text-[#685752] ${getBorderClass(address, isAddressTouched)}`}
              placeholder="مثلا: تهران، خیابان ولیعصر، روبروی پارک دانشجو"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onBlur={() => setIsAddressTouched(true)} // Mark as touched
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

          {/* انتخاب دسته‌بندی */}
          <button onClick={() => setIsSelTools(!isSelTools)} className='flex justify-start items-start gap-x-[10px]'>

            {!isSelTools ? <Image src="/images/icons/category/tools.svg" alt="tools" width={56} height={54} /> : <Image src="/images/icons/category/tools-green.svg" alt="tools" width={56} height={54} />}

            <div className='flex flex-col items-start mt-1'>
              <span className={`${!isSelTools ? "text-[#685752]" : "text-[#8EB486]"} text-sm font-bold`}>خرابی یا آسیب دیدگی</span>
              <span className={`${!isSelTools ? "text-[#685752]" : "text-[#8EB486]"} text-sm`}>چاله، جدول شکسته یا تجهیزات خراب</span>
            </div>
          </button>
          {/* text-[#8EB486] */}
          <button onClick={() => setIsSelLightbulb(!isSelLightbulb)} className='flex justify-start items-start gap-x-[10px]'>

            {!isSelLightbulb ?
              <Image src="/images/icons/category/lightbulb.svg" alt="lightbulb" width={56} height={54} /> : <Image src="/images/icons/category/lightbulb-green.svg" alt="lightbulb" width={56} height={54} />
            }
            <div className='flex flex-col items-start mt-1'>
              <span className={`${!isSelLightbulb ? "text-[#685752]" : "text-[#8EB486]"} text-sm font-bold`}>روشنایی معابر</span>
              <span className={`${!isSelLightbulb ? "text-[#685752]" : "text-[#8EB486]"} text-sm`}>چراغ خاموش یا نور ناکافی در خیابان</span>
            </div>
          </button>

          <button onClick={() => setIsSelTrash(!isSelTrash)} className='flex justify-start items-start gap-x-[10px]'>

            {!isSelTrash ?
              <Image src="/images/icons/category/trash.svg" alt="trash" width={56} height={54} /> : <Image src="/images/icons/category/trash-green.svg" alt="trash" width={56} height={54} />
            }
            <div className='flex flex-col items-start mt-1'>
              <span className={`${!isSelTrash ? "text-[#685752]" : "text-[#8EB486]"} text-sm font-bold`}> زباله و نظافت</span>
              <span className={`${!isSelTrash ? "text-[#685752]" : "text-[#8EB486]"} text-sm`}>رها شدن زباله یا سطل‌های پر و آلوده</span>
            </div>
          </button>





        </div>
        <div className='col-span-6 space-y-2'>
          <button onClick={() => setIsSelBarrier(!isSelBarrier)} className='flex justify-start items-start gap-x-[10px]'>

            {!isSelBarrier ?
              <Image src="/images/icons/category/barrier.svg" alt="barrier" width={56} height={74} /> : <Image src="/images/icons/category/barrier-green.svg" alt="barrier" width={56} height={54} />
            }
            <div className='flex flex-col items-start mt-1'>
              <span className={`${!isSelBarrier ? "text-[#685752]" : "text-[#8EB486]"} text-sm font-bold`}> ایمنی و خطرات شهری</span>
              <span className={`${!isSelBarrier ? "text-[#685752]" : "text-[#8EB486]"} text-sm`}>محل ناایمن مثل چاه باز یا مانع خطرناک</span>
            </div>
          </button>

          <button onClick={() => setIsSelSmog(!isSelSmog)} className='flex justify-start items-start gap-x-[10px]'>

            {!isSelSmog ?
              <Image src="/images/icons/category/smog.svg" alt="smog" width={56} height={74} /> : <Image src="/images/icons/category/smog-green.svg" alt="smog" width={56} height={54} />
            }
            <div className='flex flex-col items-start mt-1'>
              <span className={`${!isSelSmog ? "text-[#685752]" : "text-[#8EB486]"} text-sm font-bold`}> دیوارنویسی و آلودگی بصری</span>
              <span className={`${!isSelSmog ? "text-[#685752]" : "text-[#8EB486]"} text-sm`}>نوشته‌ها یا تبلیغات نازیبا روی دیوارها</span>
            </div>
          </button>
          <button onClick={() => setIsSelLeaf(!isSelLeaf)} className='flex justify-start items-start gap-x-[10px]'>

            {!isSelLeaf ?
              <Image src="/images/icons/category/leaf.svg" alt="leaf" width={56} height={74} /> : <Image src="/images/icons/category/leaf-green.svg" alt="leaf" width={56} height={54} />
            }
            <div className='flex flex-col items-start mt-1'>
              <span className={`${!isSelLeaf ? "text-[#685752]" : "text-[#8EB486]"} text-sm font-bold`}> ایمنی و خطرات شهری</span>
              <span className={`${!isSelLeaf ? "text-[#685752]" : "text-[#8EB486]"} text-sm`}>آسیب به درختان یا وضعیت نامناسب پارک</span>
            </div>
          </button>


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

      </div >


      {/* تصاویر */}
      < div className="col-span-7" >
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
      </div >
      <div className='col-span-12'>
        <p className="text-md text-[#685752]">عکس‌های مربوط به گزارش را اینجا بکشید و رها کنید یا برای انتخاب از دستگاه خود کلیک کنید.</p>
        <p className="text-sm text-[#87878B]">حداکثر ۵ تصویر | فرمت‌های مجاز: JPG, PNG | حجم هر تصویر تا ۵ مگابایت</p>
      </div>

    </div >

  );
}





export default ReportForm;