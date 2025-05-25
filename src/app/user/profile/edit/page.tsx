"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InfoSection from "@/components/profile/Info";
import PasswordSection from "@/components/profile/Password";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function EditProfile() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        
        if (!token) {
          router.push('/auth/sign-up'); // Changed to sign-up page
          return;
        }

        // Verify token validity with your API
        const response = await fetch("https://shahriar.thetechverse.ir:3000/api/v1/user-profile/score-and-rank", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data?.data?.username) {
          throw new Error('Invalid token');
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication error:", error);
        // Clear invalid token
        if (typeof window !== 'undefined') {
          localStorage.removeItem("token");
        }
        router.push('/auth/sign-up'); // Changed to sign-up page
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
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20 py-8 px-4 sm:px-8 lg:px-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-20 items-start mt-40">
        <InfoSection />
        <PasswordSection />
      </div>
    </div>
  );
}