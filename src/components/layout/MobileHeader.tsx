"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { LucideIconName, Icon } from "@/components/Icon";

export default function MobileHeader({
  navItems,
}: {
  navItems: Array<{
    name: string;
    href: string;
    logo: LucideIconName;
  }>;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile header */}
      <div className="flex items-center justify-between w-full py-1">
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

        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            width={64}
            height={64}
            alt="CleanCity Logo"
            className="h-12 w-12 bg-light rounded-lg transition-all duration-300"
            priority
          />
        </Link>

        <Link
          href="/auth/sign-up"
          className="p-2 bg-accent rounded-lg hover:text-black transition-colors"
          aria-label="ورود / ثبت نام"
        >
          <Icon name="User" className="text-2xl" />
        </Link>
      </div>

      {/* Mobile Navigation */}
      <div
        dir="rtl"
        className={`
          sm:hidden w-full overflow-hidden
          transition-all duration-500 ease-in-out
          ${isMobileMenuOpen ? "max-h-[500px] opacity-100 pt-4" : "max-h-0 opacity-0 pt-0"}
        `}
      >
        <div
          className={`
            bg-white/95 backdrop-blur-lg rounded-2xl
            transform transition-all duration-500 ease-in-out pt-1
            ${isMobileMenuOpen ? "translate-y-0" : "-translate-y-5"}
          `}
        >
          {navItems.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-4 py-3 mx-2 first:mt-2 last:mb-2 rounded-xl
                transition-colors duration-300 hover:text-black active:text-black
                ${
                  pathname === item.href
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }
                transition-transform duration-300 ease-out
                ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
              `}
              style={{
                transitionDelay: isMobileMenuOpen ? `${index * 75}ms` : "0ms",
              }}
            >
              <Icon name={item.logo} className="ml-2" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
