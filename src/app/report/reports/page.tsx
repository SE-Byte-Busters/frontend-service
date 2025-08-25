"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ReportsList } from "@/components/report/ReportList";
import { Report } from "@/components/report/ReportTypes";

export default function ProcessedReports() {
  const router = useRouter();
  const [approvedReports, setApprovedReports] = useState<Report[]>([]);
  const [lastTenReports, setLastTenReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAuthAlert, setShowAuthAlert] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    /*     if (!token) {
      setShowAuthAlert(true);
      const timer = setTimeout(() => {
        router.push("/auth/sign-up");
      }, 3000);
      return () => clearTimeout(timer);
    } */

    const fetchReports = async () => {
      try {
        // First verify token validity
        const verifyRes = await fetch(
          "https://shahriar.thetechverse.ir:3000/api/v1/user-profile/score-and-rank",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!verifyRes.ok) throw new Error("Invalid token");

        // Then fetch reports
        const res = await fetch(
          "https://shahriar.thetechverse.ir:3000/api/v1/admin/get-stated-reports?page=1&limit=10&sortBy=createdAt",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch reports");

        const data = await res.json();

        // Filter for approvalStatus = 1
        const approved = data.data.reports.filter((r: Report) => r.approvalStatus === 1);

        // Sort by priority (High > Low) and then by voteScore (High > Low) for top reports
        const prioritySorted = [...approved].sort((a: Report, b: Report) => {
          const priorityOrder = ["High", "Medium", "Low"];
          const aPriorityIndex = priorityOrder.indexOf(a.priority);
          const bPriorityIndex = priorityOrder.indexOf(b.priority);

          if (aPriorityIndex !== bPriorityIndex) {
            return aPriorityIndex - bPriorityIndex;
          }
          return b.voteScore - a.voteScore;
        });

        // Get top 3 prioritized reports
        setApprovedReports(prioritySorted.slice(0, 3));

        // Get last 10 approved reports (newest first)
        const lastTen = [...approved]
          .sort((a: Report, b: Report) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10);

        setLastTenReports(lastTen);

      } catch (err) {
        console.error("Error:", err);
        if (err instanceof Error && err.message === "Invalid token") {
          localStorage.removeItem("token");
          setShowAuthAlert(true);
          /* setTimeout(() => router.push("/auth/sign-up"), 3000); */
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [router]);

  if (showAuthAlert) {
    return (
      <div className="bg-light min-h-screen flex items-center justify-center">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md shadow-lg max-w-md">
          <div className="flex items-center gap-2 text-yellow-700" dir="rtl">
            <span>⚠️</span>
            <span>ابتدا وارد اکانت کاربری خود شوید</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-h-screen flex flex-col items-center px-4 pb-12 pt-10 lg:pt-20 lg:pb-10">
      <div className="flex flex-col items-center w-full max-w-6xl gap-12 mt-10">
        {/* Top 3 Approved Reports */}
        <div className="w-full">
          <div className="flex flex-col items-center mb-4">
            <div className="flex items-center gap-2 justify-center">
              <Image
                src="/images/icons/worldcrown.jpg"
                alt="Top reports icon"
                width={24}
                height={24}
                className="shrink-0"
              />
              <h2 className="text-xl font-semibold text-gray-900 text-center">
                صدر لیست گزارشات محبوب
              </h2>
            </div>
            <p className="text-m text-primary mb-4 text-center mt-2 max-w-2xl">
              این گزارش‌ها بیشترین میزان پسند و مشارکت کاربران را داشته‌اند و در صدر توجه قرار گرفته‌اند.
            </p>
          </div>
          {loading ? (
            <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-700">در حال بارگذاری...</div>
          ) : approvedReports.length > 0 ? (
            <ReportsList reports={approvedReports} loading={loading} adminView={true} />
          ) : (
            <div className="bg-green-50 p-4 rounded-lg text-center text-green-700">
              هیچ گزارشی تایید نشده است
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-full border-t border-gray-300 my-2"></div>

        {/* Last 10 Approved Reports */}
        <div className="w-full">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-2 justify-center">
              <Image
                src="/images/icons/handguy.jpg"
                alt="Recent reports icon"
                width={24}
                height={24}
                className="shrink-0"
              />
              <h2 className="text-xl font-semibold text-gray-900 text-center">
                آخرین گزارش‌های ثبت‌شده
              </h2>
            </div>
            <p className="text-m text-primary mb-4 text-center mt-2 max-w-2xl">
              گزارش‌هایی که همین حالا ارسال شدن—شاید مشکلی باشه که تو هم بتونی براش کاری بکنی!
            </p>
          </div>
          {loading ? (
            <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-700">در حال بارگذاری...</div>
          ) : lastTenReports.length > 0 ? (
            <ReportsList reports={lastTenReports} loading={loading} adminView={true} />
          ) : (
            <div className="bg-blue-50 p-4 rounded-lg text-center text-blue-700">
              هیچ گزارشی تایید نشده است
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
