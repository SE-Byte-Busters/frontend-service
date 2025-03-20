"use client";

import Link from "next/link";
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
          <img src="/logo.png" alt="CleanCity Logo" className="h-16 w-16" />
          <span className="text-xl text-black">CleanCity</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-row-reverse bg-light rounded-lg p-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-row-reverse items-center rounded-lg transition-colors duration-300 pl-2 py-1
                ${pathname === item.href
                  ? "bg-primary text-white hover:text-black"
                  : "text-gray-600 hover:text-black"
                }`}
            >
              <MaterialSymbol name={item.logo} className="mr-2" />
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Authentication */}
        <div>
          <Link
            href="/signup"
            className="flex flex-row-reverse items-center 
            bg-accent text-white hover:text-black transition-colors duration-300 rounded-lg pl-4 pr-2 py-2"
          >
            <MaterialSymbol name="person" className="ml-2" />
            <span className="text-sm">ورود / ثبت نام</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
