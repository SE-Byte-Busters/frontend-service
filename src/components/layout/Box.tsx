"use client";

import { Icon } from "@/components/Icon";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const Box = () => {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const local = localStorage.getItem("role");
      const fromCookie = getCookie("role");
      const value = (local ?? fromCookie ?? "").toLowerCase() || null;
      setRole(value);
    } catch {
      setRole(null);
    }
  }, []);

  if (!mounted) return null;

  const handleLogout = () => {
    deleteCookie("token");
    deleteCookie("role");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  function deleteCookie(name: string) {
    document.cookie = `${name}=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
  }

  function getCookie(name: string): string | null {
    const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return m ? decodeURIComponent(m[1]) : null;
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md p-2 min-w-[180px] flex flex-col gap-1"
      dir="rtl"
    >
      {role === "user" && (
        <>
          {/* گزارشات من button */}
          <button
            onClick={() => router.push("/user/my-reports")}
            className="flex items-center justify-start gap-2 w-full rounded-md px-3 py-2 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 transition-colors duration-200"
          >
            <span>گزارشات من</span>
            <Icon name="FileText" className="w-4 h-4" />
          </button>

          <button
            onClick={() => router.push("/user/ticket")}
            className="flex items-center justify-start gap-2 w-full rounded-md px-3 py-2 text-sm text-orange-600 hover:text-orange-800 hover:bg-orange-50 transition-colors duration-200"
          >
            <span>تیکت های من</span>
            <Icon name="MessageCircle" className="w-4 h-4" />
          </button>

          {/* به سایت نظر بده button */}
          <button
            onClick={() => router.push("/user/leave-a-review")}
            className="flex items-center justify-start gap-2 w-full rounded-md px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-200"
          >
            <span>به سایت نظر بده</span>
            <Icon name="MessageSquare" className="w-4 h-4" />
          </button>
        </>
      )}

      {role === "admin" && (
        <>
          <button
            onClick={() => router.push("/admin/ticket")}
            className="flex items-center justify-start gap-2 w-full rounded-md px-3 py-2 text-sm text-orange-600 hover:text-orange-800 hover:bg-orange-50 transition-colors duration-200"
          >
            <span>تیکت ها</span>
            <Icon name="MessageCircle" className="w-4 h-4" />
          </button>

          {/* آمار button */}
          <button
            onClick={() => router.push("/admin/statistic")}
            className="flex items-center justify-start gap-2 w-full rounded-md px-3 py-2 text-sm text-purple-600 hover:text-purple-800 hover:bg-purple-50 transition-colors duration-200"
          >
            <span>آمار</span>
            <Icon name="BarChart" className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-start gap-2 w-full rounded-md px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors duration-200"
      >
        <span>خروج از حساب</span>
        <Icon name="LogOut" className="w-4 h-4" />
      </button>
    </div>
  );
};
