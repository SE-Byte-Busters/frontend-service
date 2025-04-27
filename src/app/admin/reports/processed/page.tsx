"use client";

import { useState, useEffect } from 'react';
import { Alert, AlertProps } from '@/components/Alert';
import { ReportsList } from '@/components/report/ReportList';
import { Report } from '@/components/report/ReportTypes';

export default function ProcessedReports() {
  const [approvedReports, setApprovedReports] = useState<Report[]>([]);
  const [deniedReports, setDeniedReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<AlertProps | null>(null);

  useEffect(() => {
    const fetchProcessedReports = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(
          'https://shahriar.thetechverse.ir:3000/api/v1/report/reports?approvalStatus[ne]=0', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error('Failed to fetch processed reports');
        const data = await res.json();

        const approved = data.data.reports.filter((r: Report) => r.approvalStatus === 1);
        const denied = data.data.reports.filter((r: Report) => r.approvalStatus === 2);

        setApprovedReports(approved);
        setDeniedReports(denied);
      } catch (err) {
        setAlert({
          type: 'error',
          message: 'خطا در دریافت گزارشات تایید یا رد شده. لطفاً دوباره تلاش کنید.',
          duration: 3000,
          onClose: () => setAlert(null)
        });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProcessedReports();
  }, []);

  return (
    <div className="bg-light min-h-screen flex flex-col items-center px-4 pt-20 pb-12 lg:pt-10 lg:pb-10">
      {alert && <Alert {...alert} />}
      <div className="flex flex-col items-center w-full max-w-6xl gap-12 mt-10">
        <h1 className="text-2xl font-bold text-gray-900">گزارشات پردازش شده</h1>

        {/* Approved Reports Section */}
        <div className="w-full">
          <h2 className="text-xl font-semibold text-green-600 mb-4 border-b border-green-200 pb-2">
            گزارشات تایید شده ({approvedReports.length})
          </h2>
          {approvedReports.length > 0 ? (
            <ReportsList
              reports={approvedReports}
              loading={loading}
              adminView={true}
            />
          ) : (
            !loading && (
              <div className="bg-green-50 p-4 rounded-lg text-center text-green-700">
                هیچ گزارشی تایید نشده است
              </div>
            )
          )}
        </div>

        {/* Denied Reports Section */}
        <div className="w-full mt-8">
          <h2 className="text-xl font-semibold text-red-600 mb-4 border-b border-red-200 pb-2">
            گزارشات رد شده ({deniedReports.length})
          </h2>
          {deniedReports.length > 0 ? (
            <ReportsList
              reports={deniedReports}
              loading={loading}
              adminView={true}
            />
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
