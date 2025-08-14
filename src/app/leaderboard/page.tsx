"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";

interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileUrl?: string;
  totalScore: number;
}

export default function Leaderboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://shahriar.thetechverse.ir:3000/api/v1/user-profile/top?limit=10"
    )
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-32 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <h1 className="text-3xl md:text-5xl font-extrabold text-center mb-12 text-gradient-to-r text-primary">
          🏆 ستارگان شهر
        </h1>

        {/* Users List */}
        <ul className="divide-y divide-gray-200">
          {users.map((user, index) => (
            <li
              key={user._id}
              className="flex items-center justify-between py-4 px-6 hover:bg-light rounded-xl transition"
            >
              {/* Rank */}
              <div className="w-10 text-center font-bold text-lg text-gray-700">
                {index + 1}
              </div>

              {/* Profile & Name */}
              <div className="flex items-center gap-4 flex-1">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  {user.profileUrl ? (
                    <Image
                      src={user.profileUrl}
                      alt={user.firstName || user.username || "کاربر"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-500">
                      👤
                    </div>
                  )}
                </div>
                <span className="font-semibold text-gray-800">
                  {user.firstName || ""} {user.lastName || ""}
                  {!user.firstName && !user.lastName && user.username}
                </span>
              </div>

              {/* Score */}
              <div className="font-bold text-accent text-lg">{user.totalScore} امتیاز</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
