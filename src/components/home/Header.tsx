"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import MaterialSymbol from '../MaterialSymbol';

export default function Header() {
  const pathname = usePathname();
  const navItems = [
    { name: "صفحه اصلی", href: "/", logo: "home" },
    { name: "گزارشات شهری", href: "/reports", logo: "description" },
    { name: "نقشه", href: "/map", logo: "pin_drop" },
    { name: "تابلوی بهترین‌ها", href: "/leaderboard", logo: "leaderboard" },
  ];

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/logo.png" alt="CleanCity Logo" className="h-20 w-20" />
          <span className="text-xl font-bold text-gray-800">CleanCity</span>
        </div>

        {/* Navigation */}
        <nav className="bg-red-100 rounded-lg p-4 flex flex-row-reverse">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={
                `flex items-center rounded-md 
                                ${pathname === item.href
                  ? "bg-red-900 text-white"
                  : "text-black"
                }`
              }
            >
              <div className="flex items-center">
                <MaterialSymbol
                  name={item.logo}
                />
                <span>{item.name}</span>
              </div>
            </Link>
          ))}
        </nav>

        {/* Sign Up / Sign In */}
        <div className="flex items-center">
          <Link href="/signup" className="bg-green-500 text-white rounded hover:bg-green-600">
            <MaterialSymbol name="person" />
            <span>ورود / ثبت نام</span>
          </Link>
        </div>
      </div>
    </header>
  );
}