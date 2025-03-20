"use client";

import Link from 'next/link';

import MaterialSymbol from '../MaterialSymbol';

export default function Footer() {
  const navItems = [
    { name: "درباره ما", href: "/about-us", logo: "groups" },
    { name: "تماس با ما", href: "/contact-us", logo: "mail" },
    { name: "سوالات متداول", href: "/faq", logo: "help" },
    { name: "سیاست‌های حفظ حریم خصوصی", href: "/privacy-policy", logo: "text_snippet" },
  ];

  return (
    <footer className="bg-dark">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/logo.png" alt="CleanCity Logo" className="h-20" />
            <span className="font-bold text-black">CleanCity</span>
          </div>

          {/* Links */}
          <nav className="flex flex-row-reverse gap-x-5">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <div className="flex flex-row-reverse items-center text-black">
                  <MaterialSymbol
                    name={item.logo}
                    className="mx-2"
                  />
                  <span>{item.name}</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        {/* Copyright notice */}
        <div className="text-center text-black">
          <p>&copy; 2025 CleanCity. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}
