"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import MaterialSymbol from "../MaterialSymbol";

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

  const navItems = [
    { name: "صفحه اصلی", href: "/", logo: "home" },
    { name: "گزارشات اخیر", href: "/reports", logo: "description" },
    { name: "نقشه", href: "/map", logo: "pin_drop" },
    { name: "تابلوی بهترین‌ها", href: "/leaderboard", logo: "leaderboard" },
  ];

  return (
    <header className={`bg-white/60 shadow-md fixed top-0 left-0 w-full z-20 backdrop-blur transition-all duration-300 ${
      isScrolled ? 'py-0' : 'py-2'
    }`}>
      <div className="flex flex-col sm:flex-row justify-between items-center container mx-auto px-4 sm:px-6 gap-2 sm:gap-0">
        {/* Logo and Mobile Menu Button */}
        <div className="flex items-center justify-between w-full sm:w-auto py-2 sm:py-0">
          <div className="flex items-center space-x-2 sm:space-x-6">
            <Link href="/">
              <Image
                src="/logo.png"
                width={256}
                height={256}
                alt="CleanCity Logo"
                className={`h-12 w-12 sm:h-14 sm:w-14 transition-all duration-300 ${
                  isScrolled ? 'scale-90' : 'scale-100'
                }`}
                priority
              />
            </Link>
            <span className="text-lg sm:text-xl font-semibold text-black">CleanCity</span>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="منو"
          >
            <MaterialSymbol 
              name={isMobileMenuOpen ? "close" : "menu"} 
              className="text-2xl transition-transform duration-300 ease-in-out"
            />
          </button>
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
              <MaterialSymbol name={item.logo} className="mx-1" />
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
            <MaterialSymbol name="person" />
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
                <MaterialSymbol name={item.logo} className="ml-2" />
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Authentication */}
            <div className={`
              p-2 mx-2
              transition-transform duration-300 ease-out
              ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            `} style={{ transitionDelay: isMobileMenuOpen ? `${navItems.length * 75}ms` : '0ms' }}>
              <Link
                href="/signup"
                className="flex items-center justify-center bg-accent rounded-lg px-4 py-3
                text-white transition-colors duration-300 active:text-black"
              >
                <MaterialSymbol name="person" className="ml-2" />
                <span>ورود / ثبت نام</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
