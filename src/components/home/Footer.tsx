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
    <footer className="bg-dark py-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          {/* Logo */}
          <div className="flex items-center mb-6 md:mb-0">
            <Image
              src="/logo.png"
              width={256}
              height={256}
              alt="CleanCity Logo"
              className="bg-light rounded-xl h-20 w-20 p-1 mr-5"
            />
            <span className="text-black font-bold text-2xl">CleanCity</span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-5" dir="rtl">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center text-black font-bold">
                  <MaterialSymbol
                    name={item.logo}
                    className="mx-2 !text-[48px]"
                  />
                  <span className="text-base">{item.name}</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        {/* Copyright notice */}
        <div className="text-center text-black font-bold text-sm" dir="rtl">
          <p>&copy; 2025 CleanCity. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}
