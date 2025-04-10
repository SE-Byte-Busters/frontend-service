"use client";

import Link from 'next/link';
import Image from "next/image";

import MaterialSymbol from '../MaterialSymbol';

export default function Footer() {
  const navItems = [
    { name: "درباره ما", href: "/about-us", logo: "groups" },
    { name: "تماس با ما", href: "/contact-us", logo: "mail" },
    { name: "سوالات متداول", href: "/faq", logo: "help" },
    { name: "سیاست‌های حفظ حریم خصوصی", href: "/privacy-policy", logo: "text_snippet" },
  ];

  return (
    <footer className="bg-dark py-4 px-4 sm:px-0">
      <div className="container mx-auto sm:px-10">
        <div className="flex flex-row items-start justify-between mb-6">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Image
              src="/logo.png"
              width={256}
              height={256}
              alt="CleanCity Logo"
              className="bg-light rounded-xl h-16 w-16 md:h-20 md:w-20 p-1 mr-3 md:mr-5"
            />
            <span className="text-black font-bold text-xl md:text-2xl">CleanCity</span>
          </div>

          {/* Links */}
          <nav className="flex flex-col md:flex-row flex-wrap gap-1 md:gap-1" dir="rtl">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} className="rounded-lg p-1 md:p-2">
                <div className="flex items-center text-black font-bold">
                  <MaterialSymbol
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
