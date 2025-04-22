import Link from 'next/link';
import Image from "next/image";

import { LucideIconName, Icon } from "@/components/Icon";

export default function Footer() {
  const navItems: Array<{
    name: string;
    href: string;
    logo: LucideIconName;
  }> = [
    { name: "درباره ما", href: "/about-us", logo: "Users" },
    { name: "تماس با ما", href: "/contact-us", logo: "Mail" },
    { name: "سوالات متداول", href: "/faq", logo: "CircleHelp" },
    { name: "سیاست‌های حفظ حریم خصوصی", href: "/privacy-policy", logo: "FileText" },
  ];

  return (
    <footer className="bg-dark py-4 px-4 sm:px-0">
      <div className="container mx-auto sm:px-10">
        <div className="flex flex-row items-start justify-between mb-6">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Image
              src="/images/logo.png"
              width={64}
              height={64}
              alt="CleanCity Logo"
              className="bg-light rounded-xl h-16 w-16 md:h-20 md:w-20 p-1 mr-3 md:mr-5"
              priority
            />
            <span className="text-black font-bold text-xl md:text-2xl">CleanCity</span>
          </div>

          {/* Links */}
          <nav className="flex flex-col md:flex-row flex-wrap gap-1 md:gap-1" dir="rtl">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} className="rounded-lg p-1 md:p-2">
                <div className="flex items-center text-black font-bold">
                  <Icon
                    name={item.logo}
                    className="mx-1 md:mx-2 !text-[24px] md:!text-[48px]"
                  />
                  <span className="text-xs md:text-base">{item.name}</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        {/* Copyright notice */}
        <div className="text-center text-black font-bold text-xs md:text-sm" dir="rtl">
          <p>&copy; 2025 CleanCity. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}
