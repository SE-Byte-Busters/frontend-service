"use client";

import { useState, useEffect } from 'react';
import { Alert, AlertProps } from '@/components/Alert';
import { ReportsList } from '@/components/report/ReportList';
import { Report } from '@/components/report/ReportTypes';

export default function PendingReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<AlertProps | null>(null);

  useEffect(() => {
    const fetchPendingReports = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(
          'https://shahriar.thetechverse.ir:3000/api/v1/report/reports?approvalStatus=0', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error('Failed to fetch pending reports');
        const data = await res.json();
        setReports(data.data.reports);
      } catch (err) {
        setAlert({
          type: 'error',
          message: 'خطا در دریافت گزارشات در انتظار تایید. لطفاً دوباره تلاش کنید.',
          duration: 3000,
          onClose: () => setAlert(null)
        });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingReports();
  }, []);

  const handleStatusChange = async (reportId: string, newStatus: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(
        `https://shahriar.thetechverse.ir:3000/api/v1/report/${reportId}/approval-status`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ approvalStatus: newStatus }),
        }
      );
      if (!res.ok) throw new Error('Failed to update report status');

      setReports(prev => prev.filter(report => report._id !== reportId));

      setAlert({
        type: 'success',
        message: 'وضعیت گزارش با موفقیت به‌روزرسانی شد',
        duration: 3000,
        onClose: () => setAlert(null)
      });
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'خطا در به‌روزرسانی وضعیت گزارش',
        duration: 3000,
        onClose: () => setAlert(null)
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-h-screen flex flex-col items-center px-4 pt-20 pb-12 lg:pt-10 lg:pb-10">
      {alert && <Alert {...alert} />}
      <div className="flex flex-col items-center w-full max-w-6xl gap-12 mt-10">
        <h1 className="text-2xl font-bold text-gray-900">گزارشات در انتظار تایید</h1>
        <ReportsList
          reports={reports}
          loading={loading}
          adminView={true}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}
