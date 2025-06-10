"use client";

import { Icon } from "@/components/Icon";

export const Box = () => {
  const handleLogout = () => {
    // Remove cookies by expiring them
    deleteCookie("token");
    deleteCookie("role");
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Force full page reload to "/" so everything resets
    window.location.href = "/";
  };

  // Helper function to delete cookie
  function deleteCookie(name: string) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  return (
    <div className="bg-light rounded-lg shadow-md p-2 min-w-[150px]">
      <button
        onClick={handleLogout}
        className="flex items-center justify-end w-full gap-2 text-red-600 hover:text-red-800 transition-colors duration-200 text-sm"
      >
        <span>خروج از حساب</span>
        <Icon name="LogOut" className="w-4 h-4" />
      </button>
    </div>
  );
};
