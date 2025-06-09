"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import UserAvatar from "@/components/UserAvatar";

interface User {
  _id: string;
  username: string;
  totalScore: number;
  profileUrl?: string;
  firstName?: string;
  lastName?: string;
  updatedAt: string;
}

export default function RankingSection() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const res = await fetch(
          "https://shahriar.thetechverse.ir:3000/api/v1/user-profile/top?limit=3"
        );
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch top users:", error);
      }
    };

    fetchTopUsers();
  }, []);

  return (
    <section className="flex flex-col items-center bg-primary px-4 sm:px-6 md:px-20 py-8 md:py-10" dir="rtl">
      {/* Title */}
      <header className="flex flex-row items-center mb-6 w-full">
        <Image
          src="/images/icons/ranking.png"
          width={64}
          height={64}
          alt="Ranking Icon"
          className="h-16 w-16 sm:h-20 sm:w-20 ml-4 mb-4 sm:mb-0"
        />
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-right">
          با فعالیت در CleanCity، قهرمان محیط‌زیست شوید!
        </h2>
      </header>

      {/* Table */}
      <div className="bg-light w-full rounded-lg px-2 sm:px-3 md:px-5 py-2 md:py-4 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="grid grid-cols-6 bg-gray-200 rounded-lg py-2 md:py-3 text-black text-sm md:text-lg text-center font-bold">
              <th className="flex justify-center items-center">رتبه</th>
              <th className="flex justify-center items-center">عکس کاربر</th>
              <th className="flex justify-center items-center">نام کاربر</th>
              <th className="flex justify-center items-center">امتیاز کل</th>
              <th className="flex justify-center items-center">نشان دریافتی</th>
              <th className="flex justify-center items-center">آخرین فعالیت</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user._id}
                className={`grid grid-cols-6 items-center text-center py-2 md:py-3 bg-light ${
                  index < users.length - 1 ? "border-b" : ""
                } border-black`}
              >
                <td className="flex justify-center items-center text-black text-sm">{index + 1}</td>
                <td className="flex justify-center">
                  <UserAvatar
                    picture={user.profileUrl || ""}
                    username={user.username}
                    className="h-8 w-8 sm:h-10 sm:w-10"
                    width={64}
                    height={64}
                  />
                </td>
                <td className="flex justify-center items-center text-xs sm:text-sm text-black">
                  {user.firstName || user.lastName
                    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                    : user.username}
                </td>
                <td className="flex justify-center items-center text-xs sm:text-sm text-black">
                  {user.totalScore}
                </td>
                <td className="flex justify-center items-center text-xs sm:text-sm text-black">
                  {index === 0
                    ? "قهرمان محیط‌زیست و فعال‌ترین گزارش‌دهنده"
                    : index === 1
                    ? "فعال‌ترین گزارش‌دهنده"
                    : "فعال برتر"}
                </td>
                <td className="flex justify-center items-center text-xs sm:text-sm text-black">
                  {new Date(user.updatedAt).toLocaleDateString("fa-IR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Button */}
      <nav className="flex w-full justify-center sm:justify-start">
        <Link
          href="/leaderboard"
          className="bg-accent text-white font-bold text-base sm:text-lg rounded-lg mt-4 sm:mt-6 px-4 py-2 sm:px-6 sm:py-3 transition duration-300 hover:text-black w-auto"
          aria-label="مشاهده تابلوی برترین‌ها"
        >
          مشاهده تابلوی برترین‌ها
        </Link>
      </nav>
    </section>
  );
}
