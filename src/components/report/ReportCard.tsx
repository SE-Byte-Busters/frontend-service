"use client";

import { Report } from './ReportTypes';
import { useState } from 'react';

type ReportCardProps = {
  report: Report;
  loading?: boolean;
  adminView?: boolean;
  onStatusChange?: (reportId: string, newStatus: number) => void;
};

export const ReportCard = ({
  report,
  loading = false,
  adminView = false,
  onStatusChange,
}: ReportCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (report.images?.length || 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + (report.images?.length || 1)) % (report.images?.length || 1));
  };

  const getStatusText = (status: number): string => {
    if (adminView) {
      if (report.approvalStatus === 1) {
        switch (status) {
          case 0: return 'اولویت بالا';
          case 1: return 'اولویت متوسط';
          case 2: return 'اولویت کم';
          default: return 'نامشخص';
        }
      } else if (report.approvalStatus === 2) {
        return ''; // No status label for declined reports
      }
    }

    switch (status) {
      case 0: return 'درحال اولویت بندی';
      case 1: return 'در حال بررسی';
      case 2: return 'بررسی شده';
      case 3: return 'حل شده';
      default: return 'نامشخص';
    }
  };

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fa-IR', options);
  };

  return (
    <div className="w-full sm:w-[300px] bg-white border border-gray-300 rounded-xl shadow-md overflow-hidden flex flex-col">
      {/* Image Carousel */}
      <div className="relative w-full h-48 bg-gray-100">
        {loading ? (
          <div className="w-full h-full bg-gray-200 animate-pulse" />
        ) : report.images && report.images.length > 0 ? (
          <>
            <img
              src={report.images[currentImageIndex]?.url || "/images/special/No_Image_Available.jpg"}
              alt={report.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {report.images.map((_, index) => (
                <span
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-green-400' : 'bg-gray-300'
                  }`}
                ></span>
              ))}
            </div>
            <div
              className="absolute top-1/2 left-2 transform -translate-y-1/2 cursor-pointer"
              onClick={prevImage}
            >
              <img src="/images/icons/icons8-left-arrow-100.png" alt="Previous" className="w-6 h-6" />
            </div>
            <div
              className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer"
              onClick={nextImage}
            >
              <img src="/images/icons/icons8-right-arrow-100.png" alt="Next" className="w-6 h-6" />
            </div>
          </>
        ) : (
          <img
            src="/images/special/No_Image_Available.jpg"
            alt="No image available"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 text-right flex flex-col gap-2">
        <h3 className="text-gray-900 text-lg font-bold">
          {loading ? (
            <span className="inline-block w-3/4 h-6 bg-gray-200 rounded animate-pulse"></span>
          ) : report.title}
        </h3>
        <p className="text-sm text-gray-900">
          {loading ? (
            <span className="inline-block w-1/2 h-4 bg-gray-200 rounded animate-pulse"></span>
          ) : formatDate(report.createdAt)}
        </p>
        <p className="text-sm text-gray-900 leading-relaxed">
          {loading ? (
            <>
              <span className="inline-block w-full h-3 bg-gray-200 rounded animate-pulse mb-2"></span>
              <span className="inline-block w-4/5 h-3 bg-gray-200 rounded animate-pulse"></span>
            </>
          ) : report.description}
        </p>
        <p className="text-sm font-semibold text-gray-800 mt-1">
          {loading ? (
            <span className="inline-block w-2/3 h-4 bg-gray-200 rounded animate-pulse"></span>
          ) : `${report.city}, ${report.approximatePosition}`}
        </p>

        {/* Status & Admin Button */}
        <div className="flex justify-between items-center mt-2">
          {!loading && getStatusText(report.status) && (
            <span className={`text-xs border px-3 py-1 rounded-full ${
              adminView && report.approvalStatus === 1 ? (
                report.status === 0 ? 'border-red-400 text-red-700' :
                report.status === 1 ? 'border-yellow-400 text-yellow-700' :
                'border-gray-400 text-gray-700'
              ) : (
                report.status === 0 ? 'border-yellow-400 text-yellow-700' :
                report.status === 1 ? 'border-blue-400 text-blue-700' :
                report.status === 2 ? 'border-green-400 text-green-700' :
                'border-gray-400 text-gray-700'
              )
            }`}>
              {getStatusText(report.status)}
            </span>
          )}

          {adminView ? (
            <button
              onClick={() => onStatusChange?.(report._id, 1)}
              className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition"
              disabled={loading}
            >
              بررسی 
            </button>
          ) : (
            <div className="flex flex-col items-center text-sm text-gray-600">
              {loading ? (
                <span className="inline-block w-6 h-6 bg-gray-200 rounded-full animate-pulse mb-1"></span>
              ) : (
                <img src="/images/icons/clock.png" alt="Clock" className="w-5 h-5 mb-1" />
              )}
              <span>
                {loading ? (
                  <span className="inline-block w-12 h-4 bg-gray-200 rounded animate-pulse"></span>
                ) : `امتیاز: ${report.voteScore}`}
              </span>
            </div>
          )}
        </div>

        {/* Category icons */}
        <div className="flex flex-row-reverse justify-end mt-4 gap-3">
          {loading ? (
            <span className="inline-block w-6 h-6 bg-gray-200 rounded animate-pulse"></span>
          ) : (
            <>
              {report.category?.includes('road') && (
                <img src="/images/icons/road-barrier-solid.svg" alt="Road Barrier" className="w-6 h-6" />
              )}
              {report.category?.includes('pollution') && (
                <img src="/images/icons/smog-solid.svg" alt="Smog" className="w-6 h-6" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
