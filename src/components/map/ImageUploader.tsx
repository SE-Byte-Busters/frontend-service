"use client";

import { useReport } from '@/context/ ReportContext';
import Image from 'next/image';
import React from 'react';
import ImageUploading, { ImageListType } from "react-images-uploading";

const ImageUploader = () => {
  const [images, setImages] = React.useState<any[]>([]);
  const { imagesToSend, setImagesToSend } = useReport();

  const onChange = (imageList: ImageListType) => {
    setImages(imageList as never[]);

    // تغییر این قسمت - ذخیره فایل‌ها به جای dataURL
    const files = imageList.map((image) => image.file as File);
    setImagesToSend(files);
  };
  return (
    <div className='w-full h-full row-[2] lg:row-auto'>
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        acceptType={['jpg', 'png']}
        maxFileSize={5000000}
        maxNumber={4}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemove,
          dragProps,
          errors
        }) => (
          <>
            <h3 className="text-right mb-2 text-[#685752] ">ارسال عکس ها</h3>
            <div
              className="upload__image-wrapper border border-dashed border-[#c1a291] p-6 rounded-md text-center flex flex-col justify-center items-center"
              onClick={onImageUpload}
              {...dragProps}
            >
              <Image src="/images/icons/cloudUpload.png" alt="cloud-upload" width={72} height={73} />
              <p className="text-md text-[#685752]">عکس‌های مربوط به گزارش را اینجا بکشید و رها کنید یا برای انتخاب از دستگاه خود کلیک کنید.</p>
              <p className="text-sm text-[#87878B]">حداکثر ۵ تصویر | فرمت‌های مجاز: JPG, PNG | حجم هر تصویر تا ۵ مگابایت</p>
              <div className="mb-4">
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer bg-[#6B5147] text-white py-2 px-6 rounded-xl inline-block text-sm text-center"
                >
                  جستجو
                </label>
              </div>
            </div>

            <div className='w-full grid grid-cols-5 h-[100px] my-4 text-left gap-1' dir='ltr'>
              {errors && (
                <div>
                  {errors.maxNumber && <span className='text-xs text-red-400 block'>* فقط ۵ عکس میتوانید انتخاب نمایید</span>}
                  {errors.acceptType && <span className='text-xs text-red-400 block'>* فایل انتخابی مجاز نیست</span>}
                  {errors.maxFileSize && <span className='text-xs text-red-400 block'>* فایل انتخابی از حداکثر سایز بیشتر است</span>}
                </div>
              )}
              {imageList.map((image, index) => (
                <div key={index} className="image-item relative h-[60px] w-[60px] rounded-2xl">
                  <Image
                    src='/img/x.png'
                    width={15}
                    height={15}
                    alt='X'
                    className='absolute top-2 left-2 cursor-pointer z-20'
                    onClick={() => onImageRemove(index)}
                  />
                  <Image
                    src={image.dataURL as string}
                    alt="Image uploaded"
                    width={60}
                    height={60}
                    className='w-full h-full object-cover rounded-2xl brightness-75 z-10'
                  />
                </div>
              ))}
            </div>

            {/* فقط برای تست، مثلا اینجا میتونی ببینی imagesToSend چیه */}
            {/* <pre>{JSON.stringify(imagesToSend, null, 2)}</pre> */}
          </>
        )}
      </ImageUploading>
    </div>
  );
};

export default ImageUploader;
