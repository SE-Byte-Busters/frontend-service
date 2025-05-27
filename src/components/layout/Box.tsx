"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";

export const Box = () => {

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    };

    return (
        <div className="bg-light rounded-lg shadow-md p-2 min-w-[150px]">
            <Link
                href="/auth/sign-in"
                onClick={handleLogout}
                className="flex items-center justify-end w-full gap-2 text-red-600 hover:text-red-800 transition-colors duration-200 text-sm"
            >
                <>
                    <span>خروج از حساب</span>
                    <Icon name="LogOut" className="w-4 h-4" />
                </>
            </Link>
        </div>
    );
};
