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

  // pagination states
  const [approvedPage, setApprovedPage] = useState(1);
  const [unapprovedPage, setUnapprovedPage] = useState(1);
  const [deniedPage, setDeniedPage] = useState(1);

  const pageSize = 5;

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchReports = async () => {
      try {
        const [mainRes, pendingRes, statedRes] = await Promise.all([
          fetch("https://shahriar.thetechverse.ir:3000/api/v1/report/reports", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }),
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

        // Merge unique reports (remove duplicates by _id)
        const mergeUnique = (arr1: Report[], arr2: Report[]) => {
          const map = new Map();
          [...arr1, ...arr2].forEach((r) => map.set(r._id, r));
          return Array.from(map.values());
        };

        setApprovedReports(mergeUnique(approved, statedApproved));
        setUnapprovedReports(mergeUnique(pendingData.data.reports, unapproved));
        setDeniedReports(mergeUnique(denied, statedDenied));
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

  // Pagination helper
  const paginate = (data: Report[], page: number) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  };

  const renderPagination = (
    total: number,
    page: number,
    setPage: (p: number) => void
  ) => {
    const totalPages = Math.ceil(total / pageSize);
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center gap-4 mt-4 text-dark" dir="rtl">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          قبلی
        </button>
        <span>
          صفحه {page} از {totalPages}
        </span>
        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          بعدی
        </button>
      </div>
    );
  };

  return (
    <div className="bg-light min-h-screen flex flex-col items-center px-4 pt-20 pb-12 lg:pt-10 lg:pb-10">
      {alert && <Alert {...alert} />}
      <div className="flex flex-col items-center w-full max-w-6xl gap-12 mt-10">

        {/* Approved Reports */}
        <div className="w-full">
          <h2
            className="text-xl font-semibold text-green-600 mb-4 border-b border-green-200 pb-2 flex items-center gap-2"
            dir="rtl"
          >
            <Image
              src="/images/icons/badge-check.png"
              alt=""
              width={24}
              height={24}
              className="shrink-0"
            />
            لیست گزارشات تایید شده
          </h2>
          {approvedReports.length > 0 ? (
            <>
              <ReportsList
                reports={paginate(approvedReports, approvedPage)}
                loading={loading}
                adminView={true}
              />
              {renderPagination(approvedReports.length, approvedPage, setApprovedPage)}
            </>
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
          <h2
            className="text-xl font-semibold text-yellow-600 mb-4 border-b border-yellow-200 pb-2 flex items-center gap-2"
            dir="rtl"
          >
            <Image
              src="/images/icons/clock.png"
              alt=""
              width={24}
              height={24}
              className="shrink-0"
            />
            لیست گزارشات تایید نشده / در انتظار بررسی
          </h2>
          {unapprovedReports.length > 0 ? (
            <>
              <ReportsList
                reports={paginate(unapprovedReports, unapprovedPage)}
                loading={loading}
                adminView={true}
              />
              {renderPagination(unapprovedReports.length, unapprovedPage, setUnapprovedPage)}
            </>
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
          <h2
            className="text-xl font-semibold text-red-600 mb-4 border-b border-red-200 pb-2 flex items-center gap-2"
            dir="rtl"
          >
            <Image
              src="/images/icons/circle-x.png"
              alt=""
              width={24}
              height={24}
              className="shrink-0"
            />
            لیست گزارشات رد شده
          </h2>
          {deniedReports.length > 0 ? (
            <>
              <ReportsList
                reports={paginate(deniedReports, deniedPage)}
                loading={loading}
                adminView={true}
              />
              {renderPagination(deniedReports.length, deniedPage, setDeniedPage)}
            </>
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
