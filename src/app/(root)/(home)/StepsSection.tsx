import Image from "next/image";

export default function StepsSection() {
  return (
    <section className="bg-accent py-8 md:py-10 px-4 sm:px-6 md:px-20" dir="rtl">
      {/* Title */}
      <header className="flex flex-row items-center mb-6">
        <Image
          src="/images/icons/steps.png"
          width={64}
          height={64}
          alt="Steps Icon"
          className="h-16 w-16 sm:h-20 sm:w-20 ml-4 mb-4 sm:mb-0"
        />
        <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl text-white text-right">
          چطور از CleanCity استفاده کنیم؟
        </h2>
      </header>

      {/* Timeline */}
      <div className="flex flex-col md:flex-row-reverse justify-center items-center">
        {/* Step 1 */}
        <article className="text-center max-w-xs sm:max-w-sm mb-8 md:mb-0">
          <Image
            src="/images/graphics/timeline_begin.svg"
            alt="Timeline Begin"
            width={440}
            height={144}
            className="w-auto h-20 md:h-auto mx-auto mb-4"
          />
          <div>
            <Image
              src="/images/icons/problem.png"
              alt="Problem Icon"
              width={64}
              height={64}
              className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4"
            />
            <h3 className="sr-only">گام اول: ثبت مشکل</h3>
            <p className="text-base sm:text-lg text-white leading-relaxed mx-2 sm:mx-5">
              مشکل شهری را با مشخص‌کردن موقعیت و نوع آن ثبت کنید. گزارش شما روی نقشه نمایش داده می‌شود.
            </p>
          </div>
        </article>

        {/* Step 2 */}
        <article className="text-center max-w-xs sm:max-w-sm mb-8 md:mb-0">
          <Image
            src="/images/graphics/timeline_continue.svg"
            alt="Timeline Continue"
            width={440}
            height={144}
            className="w-auto h-20 md:h-auto mx-auto mb-4"
          />
          <div>
            <Image
              src="/images/icons/teamwork.png"
              alt="Teamwork Icon"
              width={64}
              height={64}
              className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4"
            />
            <h3 className="sr-only">گام دوم: بررسی گزارش</h3>
            <p className="text-base sm:text-lg text-white leading-relaxed mx-2 sm:mx-5">
              مشکل شهری را با مشخص‌کردن موقعیت و نوع آن را ثبت کنید. گزارش شما روی نقشه نمایش داده می‌شود.
            </p>
          </div>
        </article>

        {/* Step 3 */}
        <article className="text-center max-w-xs sm:max-w-sm">
          <Image
            src="/images/graphics/timeline_end.svg"
            alt="Timeline End"
            width={440}
            height={144}
            className="w-auto h-20 md:h-auto mx-auto mb-4"
          />
          <div>
            <Image
              src="/images/icons/action.png"
              alt="Action Icon"
              width={64}
              height={64}
              className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4"
            />
            <h3 className="sr-only">گام سوم: حل مشکل</h3>
            <p className="text-base sm:text-lg text-white leading-relaxed mx-2 sm:mx-5">
              گزارش‌های تأییدشده به نهادهای مسئول ارسال شده و پس از حل مشکل، وضعیت آن به‌روزرسانی می‌شود.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
};
