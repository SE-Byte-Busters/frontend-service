"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import MaterialSymbol from "../MaterialSymbol";

export default function Header() {
  const pathname = usePathname();
  const navItems = [
    { name: "صفحه اصلی", href: "/", logo: "home" },
    { name: "گزارشات اخیر", href: "/reports", logo: "description" },
    { name: "نقشه", href: "/map", logo: "pin_drop" },
    { name: "تابلوی بهترین‌ها", href: "/leaderboard", logo: "leaderboard" },
  ];

  return (
    <header className="bg-white/60 shadow-md fixed top-0 left-0 w-full z-20 backdrop-blur">
      <div className="flex justify-between items-center container mx-auto px-6 py-2">
        {/* Logo */}
        <div className="flex items-center space-x-6">
          <Image
            src="/logo.png"
            width={256}
            height={256}
            alt="CleanCity Logo"
            className="h-16 w-16" />
          <span className="text-xl font-semibold text-black">CleanCity</span>
        </div>

        {/* Navigation */}
        <nav className="flex bg-light rounded-lg p-2" dir="rtl">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center rounded-lg pl-2 py-1
                transition-colors duration-300 hover:text-black
                ${pathname === item.href
                  ? "bg-primary text-white"
                  : "text-gray-500"
                }`}
            >
              <MaterialSymbol
                name={item.logo}
                className="mx-1" />
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Authentication */}
        <div dir="rtl">
          <Link
            href="/signup"
            className="flex items-center bg-accent rounded-lg px-2 py-2
            text-white hover:text-black transition-colors duration-300"
          >
            <MaterialSymbol name="person" />
            <span className="text-sm hidden md:inline px-2">ورود / ثبت نام</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
