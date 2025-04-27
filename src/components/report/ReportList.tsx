"use client";

import Image from 'next/image';
import { Report } from './ReportTypes';
import { ReportCard } from './ReportCard';

type ReportsListProps = {
  reports: Report[];
  loading?: boolean;
  adminView?: boolean;
  onStatusChange?: (reportId: string, newStatus: number) => void;
};

export const ReportsList = ({ reports, loading = false, adminView = false, onStatusChange }: ReportsListProps) => {
  if (reports.length === 0 && !loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col items-center gap-8 sm:gap-12 lg:gap-16 sm:flex-row sm:items-center">
          <Image
            src="/images/special/no-report.png"
            width={373}
            height={276}
            alt="no report image"
            className="w-48 sm:w-56 md:w-64 lg:w-72 h-auto"
          />

          <div className="flex flex-col items-center text-center gap-4 sm:gap-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark">
              گزارشی یافت نشد
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-row-reverse flex-wrap justify-end gap-6">
      {reports.map((report) => (
        <ReportCard
          key={report._id}
          report={report}
          loading={loading}
          adminView={adminView}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};
