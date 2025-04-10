"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { LucideIconName, Icon } from "@/components/Icon";

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: Array<{
    name: string;
    href: string;
    logo: LucideIconName;
  }> = [
    { name: "صفحه اصلی", href: "/", logo: "Home" },
    { name: "گزارشات اخیر", href: "/reports", logo: "ScrollText" },
    { name: "نقشه", href: "/map", logo: "MapPin" },
    { name: "تابلوی بهترین‌ها", href: "/leaderboard", logo: "Medal" },
  ];

  return (
    <header className={`bg-white/60 shadow-md fixed top-0 left-0 w-full z-20 backdrop-blur transition-all duration-300 ${
      isScrolled ? 'py-0' : 'py-2'
    }`}>
      <div className="flex flex-col sm:flex-row justify-between items-center container mx-auto px-4 sm:px-6 gap-2 sm:gap-0">
        {/* Mobile Header */}
        <div className="flex items-center justify-between w-full sm:hidden py-1">
          {/* Dropdown menu icon */}
          <button 
            className="p-2 rounded-lg text-gray-300 hover:text-black transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="منو"
          >
            <Icon 
              name={isMobileMenuOpen ? "X" : "Menu"} 
              className="text-2xl transition-transform duration-300 ease-in-out"
            />
          </button>
          
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              width={256}
              height={256}
              alt="CleanCity Logo"
              className={`h-12 w-12 bg-light rounded-lg transition-all duration-300 ${
                isScrolled ? 'scale-90' : 'scale-125'
              }`}
              priority
            />
          </Link>
          
          {/* Signup/login */}
          <Link
            href="/signup"
            className="p-2 bg-accent rounded-lg hover:text-black transition-colors"
            aria-label="ورود / ثبت نام"
          >
            <Icon name="User" className="text-2xl" />
          </Link>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:flex items-center justify-between w-full sm:w-auto py-2 sm:py-0">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-6">
            <Link href="/">
              <Image
                src="/logo.png"
                width={256}
                height={256}
                alt="CleanCity Logo"
                className={`h-12 w-12 sm:h-14 sm:w-14 bg-light rounded-lg transition-all duration-300 ${
                  isScrolled ? 'scale-90' : 'scale-100'
                }`}
                priority
              />
            </Link>
            <span className="text-lg sm:text-xl font-semibold text-black">CleanCity</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex bg-light rounded-lg p-1 sm:p-2" dir="rtl">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center rounded-lg px-2 sm:pl-3 py-1 mx-1
                transition-colors duration-300 hover:text-black active:text-black
                ${pathname === item.href
                  ? "bg-primary text-white"
                  : "text-gray-500"
                }`}
            >
              <Icon name={item.logo} className="mx-1" />
              <span className="text-xs sm:text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Desktop Authentication */}
        <div dir="rtl" className="hidden sm:block">
          <Link
            href="/signup"
            className="flex items-center bg-accent rounded-lg px-3 py-2
            text-white hover:text-black transition-colors duration-300"
          >
            <Icon name="User" />
            <span className="text-sm hidden md:inline px-2">ورود / ثبت نام</span>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div dir="rtl" className={`
          sm:hidden w-full overflow-hidden
          transition-all duration-500 ease-in-out
          ${isMobileMenuOpen ? 'max-h-[500px] opacity-100 pt-4' : 'max-h-0 opacity-0 pt-0'}
        `}>
          <div className={`
            bg-white/95 backdrop-blur-lg rounded-2xl
            transform transition-all duration-500 ease-in-out pt-1
            ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-5'}
          `}>
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-4 py-3 mx-2 first:mt-2 last:mb-2 rounded-xl
                  transition-colors duration-300 hover:text-black active:text-black
                  ${pathname === item.href ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-50'}
                  transition-transform duration-300 ease-out
                  ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
                style={{ transitionDelay: isMobileMenuOpen ? `${index * 75}ms` : '0ms' }}
              >
                <Icon name={item.logo} className="ml-2" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
