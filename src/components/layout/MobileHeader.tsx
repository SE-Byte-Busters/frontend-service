"use client"; // Ensure this is a client-side component

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
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // 🔥

  // Fetch username from API using the token stored in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("https://shahriar.thetechverse.ir:3000/api/v1/user-profile/score-and-rank", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data?.data?.username) {
            setUsername(data.data.username); // Set the username from the API response
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        })
        .finally(() => {
          setLoading(false); // 🔥
        });
    } else {
      setLoading(false); // 🔥
    }
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile header */}
      <div className="flex items-center justify-between w-full py-1">
        {/* Auth or username display */}
        {loading ? (
          <div className="p-2 bg-accent rounded-lg w-24 h-10 animate-pulse" />
        ) : username ? (
          <Link
            href="/admin/profile/edit" // ⬅️ Navigate to profile edit when username exists
            className="p-2 bg-accent rounded-lg hover:text-black transition-colors"
          >
            {username}
          </Link>
        ) : (
          <Link
            href="/auth/sign-up"
            className="p-2 bg-accent rounded-lg hover:text-black transition-colors"
            aria-label="ورود / ثبت نام"
          >
            <Icon name="User" className="text-2xl" />
          </Link>
        )}

        {/* Logo */}
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

        {/* Menu button */}
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
