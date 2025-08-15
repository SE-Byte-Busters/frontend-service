"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Alert, AlertProps } from "@/components/Alert";
import { ReportsList } from "@/components/report/ReportList";
import { Report } from "@/components/report/ReportTypes";

// Helper: fetch all paginated reports
const fetchAllReports = async (
  baseUrl: string,
  token: string,
  sortBy: string = "createdAt"
): Promise<Report[]> => {
  let all: Report[] = [];
  let page = 1;
  let keepFetching = true;

  while (keepFetching) {
    const res = await fetch(`${baseUrl}?page=${page}&limit=50&sortBy=${sortBy}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to fetch paginated reports");

    const data = await res.json();
    const reports: Report[] = data.data.reports || [];

    if (reports.length === 0) {
      keepFetching = false;
    } else {
      all = [...all, ...reports];
      page++;
    }
  }

  return all;
};

// Helper: merge unique reports
const mergeUnique = (arr1: Report[], arr2: Report[]) => {
  const map = new Map();
  [...arr1, ...arr2].forEach((r) => map.set(r._id, r));
  return Array.from(map.values());
};

// Pagination component (Persian)
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center mt-4 gap-2">
      <button
        className="px-3 py-1 border rounded text-dark disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        قبلی
      </button>
      <span className="px-3 py-1 text-dark">
        صفحه {currentPage} از {totalPages}
      </span>
      <button
        className="px-3 py-1 border rounded text-dark disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        بعدی
      </button>
    </div>
  );
}

export default function ProcessedReports() {
  const [approvedReports, setApprovedReports] = useState<Report[]>([]);
  const [unapprovedReports, setUnapprovedReports] = useState<Report[]>([]);
  const [deniedReports, setDeniedReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<AlertProps | null>(null);

  // pagination state
  const [approvedPage, setApprovedPage] = useState(1);
  const [unapprovedPage, setUnapprovedPage] = useState(1);
  const [deniedPage, setDeniedPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchReports = async () => {
      try {
        const [mainData, pendingReports, statedReports] = await Promise.all([
          fetch("https://shahriar.thetechverse.ir:3000/api/v1/report/reports", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => {
            if (!res.ok) throw new Error("Failed to fetch reports");
            return res.json();
          }),

          fetchAllReports(
            "https://shahriar.thetechverse.ir:3000/api/v1/admin/get-pending-reports",
            token!,
            "oldest"
          ),

          fetchAllReports(
            "https://shahriar.thetechverse.ir:3000/api/v1/admin/get-stated-reports",
            token!,
            "createdAt"
          ),
        ]);

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
        const statedApproved = statedReports.filter(
          (r: Report) => r.approvalStatus === 1
        );
        const statedDenied = statedReports.filter(
          (r: Report) => r.approvalStatus === 2
        );

        // Merge unique
        setApprovedReports(mergeUnique(approved, statedApproved));
        setUnapprovedReports(mergeUnique(pendingReports, unapproved));
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

  // Slice for frontend pagination
  const approvedSlice = approvedReports.slice(
    (approvedPage - 1) * pageSize,
    approvedPage * pageSize
  );
  const unapprovedSlice = unapprovedReports.slice(
    (unapprovedPage - 1) * pageSize,
    unapprovedPage * pageSize
  );
  const deniedSlice = deniedReports.slice(
    (deniedPage - 1) * pageSize,
    deniedPage * pageSize
  );

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
                reports={approvedSlice}
                loading={loading}
                adminView={true}
              />
              <Pagination
                currentPage={approvedPage}
                totalPages={Math.ceil(approvedReports.length / pageSize)}
                onPageChange={setApprovedPage}
              />
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
                reports={unapprovedSlice}
                loading={loading}
                adminView={true}
              />
              <Pagination
                currentPage={unapprovedPage}
                totalPages={Math.ceil(unapprovedReports.length / pageSize)}
                onPageChange={setUnapprovedPage}
              />
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
                reports={deniedSlice}
                loading={loading}
                adminView={true}
              />
              <Pagination
                currentPage={deniedPage}
                totalPages={Math.ceil(deniedReports.length / pageSize)}
                onPageChange={setDeniedPage}
              />
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
