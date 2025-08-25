"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Phone, Mail } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQPage = () => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const faqData: FAQItem[] = [
    {
      question: "پلتفرم CleanCity چیست و چگونه کار می‌کند؟",
      answer:
        "CleanCity یک پلتفرم هوشمند برای گزارش و مدیریت مشکلات شهری است. شهروندان می‌توانند مشکلاتی مانند زباله‌های پراکنده، خرابی لوله‌ها یا تجهیزات پارک را عکس‌برداری کرده و موقعیت آن را در نقشه ثبت کنند. سازمان‌های مربوطه نیز می‌توانند این گزارش‌ها را مشاهده و پیگیری کنند.",
    },
    {
      question: "چگونه می‌توانم گزارش جدید ثبت کنم؟",
      answer:
        "برای ثبت گزارش جدید، وارد حساب کاربری خود شوید، از عکس مشکل بگیرید، نوع مشکل را انتخاب کنید و موقعیت جغرافیایی آن را روی نقشه مشخص کنید. سپس توضیح مختصری اضافه کرده و گزارش را ارسال کنید.",
    },
    {
      question: "سیستم امتیازدهی چگونه کار می‌کند؟",
      answer:
        "کاربران با ثبت گزارش‌های صحیح، تأیید گزارش‌های دیگران و مشارکت در فعالیت‌های پاک‌سازی امتیاز دریافت می‌کنند. این امتیازها قابل تبدیل به تخفیف‌ها، جوایز و یا تقدیرنامه‌های محیط زیستی هستند.",
    },
    {
      question: "آیا می‌توانم ناشناس گزارش ارسال کنم؟",
      answer:
        "بله، سیستم امکان ارسال گزارش ناشناس را فراهم می‌کند. این ویژگی برای مواقعی که کاربران نمی‌خواهند هویت خود را فاش کنند، طراحی شده است.",
    },
    {
      question: "چگونه صحت گزارش‌ها بررسی می‌شود؟",
      answer:
        "سیستم ما از دو روش استفاده می‌کند: تأیید توسط کاربران دیگر و بررسی توسط ادمین‌های سیستم. در آینده قابلیت‌های هوش مصنوعی نیز برای تشخیص خودکار مشکلات اضافه خواهد شد.",
    },
    {
      question: "شرکت‌ها و سازمان‌ها چگونه از پلتفرم استفاده می‌کنند؟",
      answer:
        "شرکت‌های بازیافت، شهرداری‌ها و سازمان‌های محیط زیستی می‌توانند حساب سازمانی تهیه کنند. آن‌ها دسترسی به پنل مدیریتی دارند که امکان مشاهده گزارش‌ها، برنامه‌ریزی عملیات پاک‌سازی و دریافت گزارش‌های تحلیلی را فراهم می‌کند.",
    },
    {
      question: "آیا برای استفاده از پلتفرم باید هزینه‌ای پرداخت کنم؟",
      answer:
        "استفاده پایه از پلتفرم برای شهروندان رایگان است. سازمان‌ها و شرکت‌ها برای دسترسی به ویژگی‌های پیشرفته و داده‌های تحلیلی ممکن است نیاز به اشتراک ویژه داشته باشند.",
    },
    {
      question: "چگونه می‌توانم در چالش‌های محیط زیستی شرکت کنم؟",
      answer:
        "در بخش چالش‌ها می‌توانید چالش‌های هفتگی و ماهانه مانند 'پاکسازی ۵ نقطه در هفته' را مشاهده کنید. با شرکت در این چالش‌ها امتیازات بیشتری کسب کرده و با سایر کاربران رقابت کنید.",
    },
    {
      question: "نقشه آلودگی چگونه تشکیل می‌شود؟",
      answer:
        "نقشه آلودگی بر اساس تجمیع گزارش‌های ارسالی کاربران و داده‌های تحلیلی سیستم تشکیل می‌شود. مناطق با رنگ‌های مختلف نشان داده شده و وضعیت هر منطقه را به‌روزرسانی می‌کند.",
    },
    {
      question: "چگونه می‌توانم گروه پاک‌سازی محلی تشکیل دهم؟",
      answer:
        "در بخش اجتماعی پلتفرم، می‌توانید گروه‌های محلی ایجاد کرده، سایر کاربران منطقه خود را دعوت کرده و رویدادهای پاک‌سازی جمعی برنامه‌ریزی کنید.",
    },
    {
      question: "اگر گزارش نادرستی مشاهده کردم چه کار کنم؟",
      answer:
        "هر گزارش دارای گزینه 'گزارش تخلف' است. اگر گزارشی نادرست، تکراری یا اسپم بود، می‌توانید آن را گزارش دهید تا توسط تیم پشتیبانی بررسی شود.",
    },
    {
      question: "آیا اپلیکیشن موبایل وجود دارد؟",
      answer:
        "در حال حاضر نسخه وب پلتفرم در دسترس است. اپلیکیشن موبایل در مراحل بعدی توسعه قرار دارد و به زودی برای Android و iOS عرضه خواهد شد.",
    },
    {
      question: "چگونه حریم خصوصی من محفوظ می‌ماند؟",
      answer:
        "ما از بالاترین استانداردهای امنیتی برای حفظ اطلاعات کاربران استفاده می‌کنیم. داده‌های موقعیت و تصاویر شما طبق قوانین GDPR مدیریت می‌شود و تنها برای بهبود خدمات استفاده می‌شود.",
    },
    {
      question: "چگونه از وضعیت رسیدگی به گزارشم مطلع شوم؟",
      answer:
        "پس از ثبت گزارش، از طریق اعلان‌های درون برنامه‌ای از مراحل مختلف رسیدگی (دریافت، در حال بررسی، در دست اقدام، حل شده) مطلع خواهید شد.",
    },
    {
      question:
        "آیا می‌توانم گزارش‌هایم را در شبکه‌های اجتماعی به اشتراک بگذارم؟",
      answer:
        "بله، شما می‌توانید گزارش‌های خود را در اینستاگرام، تلگرام و سایر شبکه‌های اجتماعی به اشتراک بگذارید و دوستان خود را نیز تشویق به مشارکت کنید.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-[#8EB486] via-[#997C70] to-[#685752] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <HelpCircle className="w-12 h-12 text-[#FDF7F4] mr-4" />
            <h1 className="text-4xl lg:text-5xl font-bold">سوالات متداول</h1>
          </div>
          <p className="text-[#FDF7F4] text-lg max-w-2xl mx-auto">
            پاسخ سوالات رایج درباره پلتفرم CleanCity و نحوه استفاده از امکانات
            آن
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="border border-[#8EB486]/20 rounded-2xl overflow-hidden bg-[#FDF7F4] shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-5 text-right focus:outline-none focus:ring-2 focus:ring-[#8EB486] focus:ring-opacity-50 bg-[#FDF7F4] hover:bg-white transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 text-right">
                      <h3 className="text-lg font-semibold text-[#685752] leading-relaxed">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="mr-4 flex-shrink-0">
                      {openAccordion === index ? (
                        <ChevronUp className="w-5 h-5 text-[#8EB486]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#8EB486]" />
                      )}
                    </div>
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openAccordion === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-5 bg-white border-t border-[#8EB486]/10">
                    <p className="text-[#997C70] leading-relaxed text-right pt-4 text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Support Section */}
      <div className="bg-[#FDF7F4] py-16 px-4 border-t border-[#8EB486]/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#685752] mb-4">
              سوال خود را پیدا نکردید؟
            </h2>
            <p className="text-[#997C70] text-lg">
              تیم پشتیبانی ما آماده پاسخگویی به سوالات شماست
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Email Support */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#8EB486]/20">
              <div className="w-16 h-16 bg-[#8EB486] rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#685752] mb-3">
                ایمیل پشتیبانی
              </h3>
              <p className="text-[#997C70] mb-4">
                برای سوالات تخصصی و راهنمایی کامل
              </p>
              <a
                href="mailto:support@cleancity.ir"
                className="inline-block bg-[#8EB486] text-white px-6 py-2 rounded-full hover:bg-[#997C70] transition-colors duration-300 font-medium"
              >
                support@cleancity.ir
              </a>
            </div>

            {/* Phone Support */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#8EB486]/20">
              <div className="w-16 h-16 bg-[#685752] rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#685752] mb-3">
                تماس تلفنی
              </h3>
              <p className="text-[#997C70] mb-4">
                پشتیبانی آنلاین در ساعات اداری
              </p>
              <a
                href="tel:02177889985"
                className="inline-block bg-[#685752] text-white px-6 py-2 rounded-full hover:bg-[#997C70] transition-colors duration-300 font-medium"
              >
                021-77889985
              </a>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 p-6 bg-white rounded-2xl border border-[#8EB486]/20">
            <h4 className="text-lg font-bold text-[#685752] mb-3">
              ساعات پشتیبانی
            </h4>
            <p className="text-[#997C70]">
              شنبه تا چهارشنبه: ۸:۰۰ تا ۱۷:۰۰ | پنج‌شنبه: ۸:۰۰ تا ۱۳:۰۰
            </p>
            <p className="text-[#997C70] text-sm mt-2">
              ایمیل‌های ارسالی در کمتر از ۲۴ ساعت پاسخ داده می‌شوند
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
