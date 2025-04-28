"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

import { LucideIconName, Icon } from "@/components/Icon";
import { NavLink } from "./DesktopHeaderNavLink";
import { Box } from "./Box";

export default function DesktopHeader({ navItems }: { navItems: Array<{ name: string; href: string; logo: LucideIconName }> }) {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // برای کنترل تاخیر

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
            setUsername(data.data.username);
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 200); // 200 میلی‌ثانیه تاخیر
  };

  return (
    <div className="flex items-center justify-between w-full sm:w-auto py-2 sm:py-0">
      {/* Authentication */}
      <div
        dir="rtl"
        className="block relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div>
          {loading ? (
            <div className="flex items-center bg-accent rounded-lg px-6 py-2 animate-pulse w-32 h-10" />
          ) : username ? (
            <Link
              href={"/user/profile/edit"}
              className="flex items-center bg-accent rounded-lg px-3 py-2 text-white hover:text-black transition-colors duration-300 text-sm"
            >
              <Icon name="User" />
              <span className="hidden md:inline px-2">{username}</span>
            </Link>
          ) : localStorage.getItem("role") === "admin" ? (
            <Link
              href={"/admin/profile/edit"}
              className="flex items-center bg-accent rounded-lg px-3 py-2 text-white hover:text-black transition-colors duration-300 text-sm"
            >
              <Icon name="User" />
              <span className="hidden md:inline px-2">admin</span>
            </Link>) : (
            <Link
              href="/auth/sign-up"
              className="flex items-center bg-accent rounded-lg px-3 py-2 text-white hover:text-black transition-colors duration-300"
            >
              <Icon name="User" />
              <span className="text-sm hidden md:inline px-2">ورود / ثبت نام</span>
            </Link>
          )}
        </div>

        {isHovered && (username || localStorage.getItem("role") === "admin") && (
          <div className="absolute right-0 top-full mt-1 z-50">
            <Box />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav dir="rtl" className="flex bg-light rounded-lg p-1 sm:p-2">
        {navItems.map((item) => (
          <NavLink key={item.name} item={item} />
        ))}
      </nav>

      {/* Logo */}
      <div className="flex items-center space-x-2 sm:space-x-6">
        <span className="text-lg sm:text-xl font-semibold text-black ml-2">CleanCity</span>
        <Link href="/">
          <Image
            src="/images/logo.png"
            width={64}
            height={64}
            alt="CleanCity Logo"
            className="h-12 w-12 sm:h-14 sm:w-14 bg-light rounded-lg my-2"
            priority
          />
        </Link>
      </div>
    </div>
  );
}