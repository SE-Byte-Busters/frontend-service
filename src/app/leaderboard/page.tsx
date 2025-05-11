"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Alert, AlertProps } from "@/components/Alert";
import { ReportsList } from "@/components/report/ReportList";
import { Report } from "@/components/report/ReportTypes";

export default function ProcessedReports() {
  const [approvedReports, setApprovedReports] = useState<Report[]>([]);
  const [lastTenReports, setLastTenReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<AlertProps | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchReports = async () => {
      try {
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

        // Get top 3 prioritized reports for first section
        setApprovedReports(prioritySorted.slice(0, 3));

        // Get last 10 approved reports (sorted by createdAt descending - newest first)
        const lastTen = [...approved]
          .sort((a: Report, b: Report) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10);

        setLastTenReports(lastTen);

      } catch (err) {
        console.error("Error fetching data:", err);
        setAlert({
          type: "error",
          message: "خطا در دریافت گزارشات.",
          duration: 3000,
          onClose: () => setAlert(null),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="bg-light min-h-screen flex flex-col items-center px-4 pb-12 lg:pt-24 lg:pb-10">
      {alert && <Alert {...alert} />}
      <div className="flex flex-col items-center w-full max-w-6xl gap-12 mt-10">

        {/* Space added for top */}
        <div className="w-full h-16" />

        {/* Top 3 Approved Reports (sorted by priority and votescore) */}
        <div className="w-full">
          <h2 className="text-xl font-semibold text-gray-900 mb-1 pb-2 flex items-center gap-2" dir="rtl">
            <Image src="/images/icons/worldcrown.jpg" alt="" width={24} height={24} className="shrink-0" />
            صدر لیست گزارشات محبوب
          </h2>
          <p className="text-m text-primary mb-4">
            {/* Brown placeholder text - you can fill this later */}
            این گزارش‌ها بیشترین میزان پسند و مشارکت کاربران را داشته‌اند و در صدر توجه قرار گرفته‌اند.
          </p>
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

        {/* Last 10 Approved Reports */}
        <div className="w-full">
          <h2 className="text-xl font-semibold text-gray-900 mb-1 pb-2 flex items-center gap-2" dir="rtl">
            <Image src="/images/icons/handguy.jpg" alt="" width={24} height={24} className="shrink-0" />
            آخرین گزارش‌های ثبت‌شده
          </h2>
          <p className="text-m text-primary mb-4">
          گزارش‌هایی که همین حالا ارسال شدن—شاید مشکلی باشه که تو هم بتونی براش کاری بکنی!
          </p>
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