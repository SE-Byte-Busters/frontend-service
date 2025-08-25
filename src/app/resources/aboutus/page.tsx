"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Mail,
  Github,
  Phone,
  MapPin,
  Recycle,
  AlertTriangle,
  Users,
  Award,
} from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  description: string;
  image?: string;
  socials: {
    github: string;
    email: string;
  };
}

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const AboutPage = () => {
  const [selectedEmail, setSelectedEmail] = useState<string>("");
  const [showEmailPopover, setShowEmailPopover] = useState<boolean>(false);
  const [showContactEmail, setShowContactEmail] = useState<boolean>(false);

  const handleEmailClick = (email: string) => {
    setSelectedEmail(email);
    setShowEmailPopover(true);
    setTimeout(() => setShowEmailPopover(false), 3000);
  };

  const teamMembers: TeamMember[] = [
    {
      name: "امیرحسین راعقی",
      role: "Team Leader & Backend Developer",
      description: "مسئول هماهنگی تیم و توسعه بک‌اند پروژه CleanCity",
      socials: {
        github: "https://github.com/amirhosseinraeqi",
        email: "amirhossein.raeqi@example.com",
      },
    },
    {
      name: "امیرحسین قدردان",
      role: "Frontend Developer",
      description: "متخصص در توسعه رابط کاربری و تجربه کاربری",
      socials: {
        github: "https://github.com/ghadrdan",
        email: "ghadrdan@example.com",
      },
    },
    {
      name: "امیرحسین کشکوئی جهرمی",
      role: "Backend Developer",
      description: "توسعه‌دهنده بک‌اند و مدیریت پایگاه داده",
      socials: {
        github: "https://github.com/kashkouei",
        email: "kashkouei@example.com",
      },
    },
    {
      name: "سید عرفان مسعودی",
      role: "Frontend Developer",
      description: "متخصص React و Next.js برای توسعه وب اپلیکیشن",
      socials: {
        github: "https://github.com/erfanmasoudi",
        email: "erfanmasoudiba@gmail.com",
      },
    },
    {
      name: "احمدرضا ذبیحی",
      role: "Backend Developer",
      description: "توسعه‌دهنده API و سیستم‌های امنیتی",
      socials: {
        github: "https://github.com/ahmadrezazabihi",
        email: "zabihi@example.com",
      },
    },
    {
      name: "دانیال یگانه",
      role: "System Analyst",
      description: "تحلیلگر سیستم و مدیریت پروژه",
      socials: {
        github: "https://github.com/danialyeganeh",
        email: "danial.yeganeh@example.com",
      },
    },
  ];

  const services: ServiceCard[] = [
    {
      id: "01",
      title: "گزارش‌دهی هوشمند",
      description:
        "امکان ثبت و گزارش مشکلات شهری به صورت آنلاین با موقعیت دقیق",
      icon: <AlertTriangle className="w-8 h-8" />,
    },
    {
      id: "02",
      title: "نقشه تعاملی",
      description: "نمایش زنده مشکلات شهری و وضعیت رسیدگی به آن‌ها",
      icon: <MapPin className="w-8 h-8" />,
    },
    {
      id: "03",
      title: "مدیریت زباله",
      description: "سیستم هوشمند مدیریت و بازیافت زباله‌های شهری",
      icon: <Recycle className="w-8 h-8" />,
    },
    {
      id: "04",
      title: "مشارکت شهروندی",
      description: "ایجاد انگیزه برای مشارکت فعال شهروندان در پاکسازی شهر",
      icon: <Users className="w-8 h-8" />,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-[#8EB486] via-[#997C70] to-[#685752] text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-[#FDF7F4]/30 rounded-full backdrop-blur-sm">
                <span className="text-[#FDF7F4] font-medium">
                  BYTE BUSTERS TEAM
                </span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Clean City
                <span className="block text-[#FDF7F4] text-3xl lg:text-4xl mt-2">
                  پلتفرم هوشمند شهر پاک
                </span>
              </h1>

              <p className="text-[#FDF7F4] text-lg leading-relaxed max-w-2xl">
                پلتفرمی نوآورانه برای گزارش و مدیریت مشکلات شهری، ایجاد شهری
                پاک‌تر و سالم‌تر با مشارکت همه شهروندان
              </p>

              <button
                onClick={() =>
                  document
                    .getElementById("contact-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center px-8 py-4 bg-[#FDF7F4] text-[#685752] font-semibold rounded-full hover:bg-[#FDF7F4]/90 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                تماس با ما
                <Mail className="ml-2 w-5 h-5" />
              </button>
            </div>

            {/* Placeholder for project image/illustration */}
            <div className="relative">
              <div className="bg-[#FDF7F4]/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                <div className="aspect-square bg-gradient-to-br from-[#8EB486] to-[#997C70] rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <Recycle className="w-24 h-24 mx-auto mb-4 text-white" />
                    <h3 className="text-2xl font-bold text-white">
                      Clean City
                    </h3>
                    <p className="text-[#FDF7F4]/80">شهر پاک</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#8EB486] to-[#997C70]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div>
                <h2 className="text-[#685752] font-bold text-lg mb-4 uppercase tracking-wide">
                  آنچه ما انجام می‌دهیم
                </h2>
                <h3 className="text-3xl font-bold text-white mb-6">
                  راه‌حل‌های نوین برای شهر پاک
                </h3>
                <p className="text-[#FDF7F4] leading-relaxed text-lg">
                  ما با استفاده از فناوری‌های روز دنیا، پلتفرمی ایجاد کرده‌ایم
                  که به شهروندان امکان گزارش مشکلات شهری را می‌دهد و به
                  سازمان‌های مربوطه کمک می‌کند تا بهتر و سریع‌تر این مشکلات را
                  حل کنند.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  مشارکت فعال شهروندان
                </h3>
                <p className="text-[#FDF7F4] leading-relaxed">
                  با سیستم امتیازدهی و پاداش‌دهی، انگیزه شهروندان را برای مشارکت
                  در پاک‌سازی و نگهداری شهر افزایش می‌دهیم.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-[#685752] font-bold text-lg mb-4 uppercase tracking-wide">
                  ویژگی‌های کلیدی
                </h2>
                <h3 className="text-2xl font-bold text-white mb-4">
                  فناوری‌های پیشرفته
                </h3>
                <p className="text-[#FDF7F4] leading-relaxed">
                  استفاده از هوش مصنوعی برای تشخیص و دسته‌بندی مشکلات، نقشه‌های
                  تعاملی برای نمایش وضعیت شهر و سیستم‌های امنیتی پیشرفته.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  مدیریت هوشمند
                </h3>
                <p className="text-[#FDF7F4] leading-relaxed">
                  پنل مدیریتی جامع برای سازمان‌ها و شهرداری‌ها جهت مدیریت بهینه
                  و شفاف مشکلات شهری.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-[#685752] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">خدمات ما</h2>
            <p className="text-[#FDF7F4] text-lg max-w-3xl mx-auto">
              پلتفرم CleanCity مجموعه‌ای از خدمات هوشمند برای مدیریت و بهبود
              کیفیت زندگی شهری ارائه می‌دهد
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-[#FDF7F4]/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-[#FDF7F4]/20 transition-all duration-300 transform hover:scale-105"
              >
                <div className="bg-[#8EB486] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  {service.icon}
                </div>
                <div className="bg-[#997C70] text-white text-2xl font-bold w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  {service.id}
                </div>
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <p className="text-[#FDF7F4] leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#8EB486] to-[#997C70]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              تیم Byte Busters
            </h2>
            <p className="text-[#FDF7F4] text-lg">
              تیمی از متخصصان جوان و با انگیزه که برای ایجاد شهری پاک‌تر تلاش
              می‌کنند
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#685752] to-[#997C70] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                    {member.name.split(" ")[0].charAt(0)}
                    {member.name.split(" ")[1]?.charAt(0)}
                  </div>
                  <p className="text-gray-600 text-sm font-medium mb-2">
                    {member.role}
                  </p>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {member.description}
                  </p>
                </div>

                <div className="flex justify-center space-x-4">
                  <a
                    href={member.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-300"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <button
                    title={`ارسال ایمیل به ${member.name}`}
                    onClick={() => handleEmailClick(member.socials.email)}
                    className="w-12 h-12 bg-[#8EB486] text-white rounded-full flex items-center justify-center hover:bg-[#997C70] transition-colors duration-300"
                  >
                    <Mail className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Email Popover */}
          {showEmailPopover && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-4 shadow-xl z-50 border">
              <div className="text-center">
                <Mail className="w-8 h-8 text-[#8EB486] mx-auto mb-2" />
                <p className="text-gray-800 font-medium">ایمیل کپی شد!</p>
                <p className="text-gray-600 text-sm">{selectedEmail}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="py-20 px-4 bg-[#FDF7F4]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              تماس با ما
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              برای هرگونه سوال، پیشنهاد یا همکاری با تیم Byte Busters در ارتباط
              باشید
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Email Contact */}
            <div
              onClick={() => setShowContactEmail(!showContactEmail)}
              className="bg-gradient-to-br from-white to-[#FDF7F4] border border-[#8EB486]/20 rounded-2xl p-8 text-center cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="w-16 h-16 bg-[#8EB486] rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              {!showContactEmail ? (
                <>
                  <h3 className="text-xl font-bold text-[#685752] mb-2">
                    ایمیل
                  </h3>
                  <p className="text-[#997C70]">برای نمایش ایمیل کلیک کنید</p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-[#685752] mb-2">
                    ایمیل تماس
                  </h3>
                  <p className="text-[#8EB486] font-bold text-lg">
                    contact@cleancity.ir
                  </p>
                </>
              )}
            </div>

            {/* GitHub */}
            <a
              href="https://github.com/SE-Byte-Busters"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-white to-[#FDF7F4] border border-[#997C70]/20 rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="w-16 h-16 bg-[#685752] rounded-full flex items-center justify-center mx-auto mb-6">
                <Github className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#685752] mb-2">گیت‌هاب</h3>
              <p className="text-[#997C70]">مشاهده پروژه‌های ما در گیت‌هاب</p>
            </a>

            {/* Phone */}
            <div className="bg-gradient-to-br from-white to-[#FDF7F4] border border-[#8EB486]/20 rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="w-16 h-16 bg-[#8EB486] rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#685752] mb-2">
                تلفن تماس
              </h3>
              <p className="text-[#997C70] font-medium">021-77889985</p>
            </div>
          </div>

          {/* Project Info Box */}
          <div className="mt-16 bg-white border border-[#8EB486]/20 rounded-2xl p-8 shadow-lg">
            <div className="text-center">
              <Award className="w-12 h-12 text-[#8EB486] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-[#685752] mb-4">
                پروژه Clean City
              </h3>
              <p className="text-[#997C70] leading-relaxed max-w-4xl mx-auto">
                این پروژه در درس مهندسی نرم‌افزار تحت نظر دکتر محمدزاده لاجوردی
                توسعه یافته است. هدف ما ایجاد پلتفرمی است که بتواند مشکلات محیط
                زیستی شهرها را به صورت هوشمند مدیریت کرده و شهروندان را برای
                مشارکت فعال در پاکسازی شهر تشویق کند.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
