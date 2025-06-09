"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InfoSection from "@/components/profile/Info";
import PasswordSection from "@/components/profile/Password";
import LoadingSpinner from "@/components/LoadingSpinner";

type UserProfile = {
  _id: string;
  username: string;
  phoneNumber: string;
  role: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  profileUrl?: string | null; 
};

export default function EditAdminProfile() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

        if (!token) {
          setError("لطفاً ابتدا وارد حساب کاربری خود شوید");
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          "https://shahriar.thetechverse.ir:3000/api/v1/admin/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data?.data) {
          throw new Error(data.message || "خطا در دریافت اطلاعات کاربر");
        }

        if (data.data.role !== "admin") {
          throw new Error("شما دسترسی ادمین ندارید");
        }

        setUserProfile(data.data);
        setIsAuthenticated(true);
      } catch (err: any) {
        console.error("Error:", err);
        setError(err.message || "خطا در احراز هویت");
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchProfile();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">خطا</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => router.push("/auth/sign-in")}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md"
          >
            رفتن به صفحه ورود
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !userProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20 py-8 px-4 sm:px-8 lg:px-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-20 items-start mt-40">
        <InfoSection
          userData={{
            username: userProfile.username,
            phoneNumber: userProfile.phoneNumber,
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            email: userProfile.email,
            profileUrl: userProfile.profileUrl ?? null, // Pass profileUrl here
          }}
        />
        <PasswordSection
          userData={{
            email: userProfile.email,
            isVerified: userProfile.isVerified,
          }}
        />
      </div>
    </div>
  );
}
