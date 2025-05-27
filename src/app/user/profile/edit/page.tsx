"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  status: number;
  createdAt: string;
  updatedAt: string;
};

export default function EditProfile() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Verify token validity and get user profile
        const response = await fetch("https://shahriar.thetechverse.ir:3000/api/v1/user-profile/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data?.data) {
          throw new Error('Invalid token or no user data');
        }

        setUserProfile(data.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication error:", error);
        // Clear invalid token
        if (typeof window !== 'undefined') {
          localStorage.removeItem("token");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <h2 className="text-xl font-semibold mb-4">ابتدا وارد اکانت کاربری خود شوید</h2>
          <p className="mb-6">برای دسترسی به این صفحه باید وارد حساب کاربری خود شوید.</p>
          <button
            onClick={() => router.push('/auth/sign-in')}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md"
          >
            رفتن به صفحه ورود
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20 py-8 px-4 sm:px-8 lg:px-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-20 items-start mt-40">
        {userProfile && (
          <>
            <InfoSection 
              userData={{
                username: userProfile.username,
                email: userProfile.email,
                phoneNumber: userProfile.phoneNumber,
                firstName: userProfile.firstName,
                lastName: userProfile.lastName
              }} 
            />
            <PasswordSection 
              userData={{
                email: userProfile.email,
                isVerified: userProfile.isVerified
              }} 
            />
          </>
        )}
      </div>
    </div>
  );
}