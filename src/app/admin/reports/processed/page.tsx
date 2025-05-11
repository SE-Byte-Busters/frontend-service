"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Alert, AlertProps } from "@/components/Alert";
import { ReportsList } from "@/components/report/ReportList";
import { Report } from "@/components/report/ReportTypes";

export default function ProcessedReports() {
  const [approvedReports, setApprovedReports] = useState<Report[]>([]);
  const [unapprovedReports, setUnapprovedReports] = useState<Report[]>([]);
  const [deniedReports, setDeniedReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<AlertProps | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchReports = async () => {
      try {
        const [mainRes, pendingRes, statedRes] = await Promise.all([
          fetch(
            "https://shahriar.thetechverse.ir:3000/api/v1/report/reports",
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          fetch(
            "https://shahriar.thetechverse.ir:3000/api/v1/admin/get-pending-reports?page=1&limit=10&sortBy=oldest",
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          fetch(
            "https://shahriar.thetechverse.ir:3000/api/v1/admin/get-stated-reports?page=1&limit=10&sortBy=createdAt",
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        if (!mainRes.ok || !pendingRes.ok || !statedRes.ok)
          throw new Error("Failed to fetch reports");

        const mainData = await mainRes.json();
        const pendingData = await pendingRes.json();
        const statedData = await statedRes.json();

        // Filter main reports
        const approved = mainData.data.reports.filter(
          (r: Report) => r.approvalStatus === 1
        );
        const unapproved = mainData.data.reports.filter(
          (r: Report) => r.approvalStatus === 0
        );
        const denied = mainData.data.reports.filter(
          (r: Report) => r.approvalStatus === 2
        );

        // Filter stated reports
        const statedApproved = statedData.data.reports.filter(
          (r: Report) => r.approvalStatus === 1
        );
        const statedDenied = statedData.data.reports.filter(
          (r: Report) => r.approvalStatus === 2
        );

        // Merge all reports
        setApprovedReports([...approved, ...statedApproved]);
        setUnapprovedReports([...pendingData.data.reports, ...unapproved]);
        setDeniedReports([...denied, ...statedDenied]);
      } catch (err) {
        console.error(err);
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
    <div className="bg-light min-h-screen flex flex-col items-center px-4 pt-20 pb-12 lg:pt-10 lg:pb-10">
      {alert && <Alert {...alert} />}
      <div className="flex flex-col items-center w-full max-w-6xl gap-12 mt-10">

        {/* Approved Reports */}
        <div className="w-full">
          <h2 className="text-xl font-semibold text-green-600 mb-4 border-b border-green-200 pb-2 flex items-center gap-2" dir="rtl">
            <Image src="/images/icons/badge-check.png" alt="" width={24} height={24} className="shrink-0" />
            لیست گزارشات تایید شده
          </h2>
          {approvedReports.length > 0 ? (
            <ReportsList reports={approvedReports} loading={loading} adminView={true} />
          ) : (
            !loading && (
              <div className="bg-green-50 p-4 rounded-lg text-center text-green-700">
                هیچ گزارشی تایید نشده است
              </div>
            )
          )}
        </div>

        {/* Unapproved + Pending Reports */}
        <div className="w-full">
          <h2 className="text-xl font-semibold text-yellow-600 mb-4 border-b border-yellow-200 pb-2 flex items-center gap-2" dir="rtl">
            <Image src="/images/icons/clock.png" alt="" width={24} height={24} className="shrink-0" />
            لیست گزارشات تایید نشده / در انتظار بررسی
          </h2>
          {unapprovedReports.length > 0 ? (
            <ReportsList reports={unapprovedReports} loading={loading} adminView={true} />
          ) : (
            !loading && (
              <div className="bg-yellow-50 p-4 rounded-lg text-center text-yellow-700">
                گزارشی تایید نشده یا در انتظار بررسی وجود ندارد
              </div>
            )
          )}
        </div>

        {/* Denied Reports */}
        <div className="w-full">
          <h2 className="text-xl font-semibold text-red-600 mb-4 border-b border-red-200 pb-2 flex items-center gap-2" dir="rtl">
            <Image src="/images/icons/circle-x.png" alt="" width={24} height={24} className="shrink-0" />
            لیست گزارشات رد شده
          </h2>
          {deniedReports.length > 0 ? (
            <ReportsList reports={deniedReports} loading={loading} adminView={true} />
          ) : (
            !loading && (
              <div className="bg-red-50 p-4 rounded-lg text-center text-red-700">
                هیچ گزارشی رد نشده است
              </div>
            )
          )}
        </div>
        
      </div>
    </div>
  );
}