"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Report } from './ReportTypes';
import {
  priorityTranslations,
  priorityColors,
  statusTranslations,
} from './reportTranslations';

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
    setCurrentImageIndex((prev) =>
      (prev - 1 + (report.images?.length || 1)) % (report.images?.length || 1)
    );
  };

  const calculateVotePercentage = () => {
    if (!report.voteScore || report.voteScore === 0) return { positive: 50, negative: 50 };

    const positive = report.voteScore > 0 ? report.voteScore : 0;
    const negative = report.voteScore < 0 ? -report.voteScore : 0;
    const total = positive + negative !== 0 ? positive + negative : 1;

    return {
      positive: Math.round((positive / total) * 100),
      negative: Math.round((negative / total) * 100)
    };
  };

  const votePercentages = calculateVotePercentage();

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const showStatusRow = report.approvalStatus === 1;
  const showPriority = showStatusRow && report.status !== 2;

  return (
    <div className="relative w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200">
      {/* Image Carousel */}
      <div className="relative w-full aspect-square bg-gray-100">
        {loading ? (
          <div className="w-full h-full bg-gray-200 animate-pulse" />
        ) : report.images && report.images.length > 0 ? (
          <>
            <Link href={`/report/${report._id}`} tabIndex={-1} aria-hidden="true">
              <img
                src={report.images[currentImageIndex]?.url || "/images/special/No_Image_Available.jpg"}
                alt={report.title}
                className="w-full h-full object-cover"
              />
            </Link>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {report.images.map((_, index) => (
                <span
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-accent' : 'bg-gray-300'
                  }`}
                ></span>
              ))}
            </div>
            <button
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/30 rounded-full p-1"
              onClick={prevImage}
              aria-label="Previous image"
            >
              <img
                src="/images/icons/icons8-left-arrow-100.png"
                alt="Previous"
                className="w-5 h-5 invert"
              />
            </button>
            <button
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/30 rounded-full p-1"
              onClick={nextImage}
              aria-label="Next image"
            >
              <img
                src="/images/icons/icons8-right-arrow-100.png"
                alt="Next"
                className="w-5 h-5 invert"
              />
            </button>
          </>
        ) : (
          <Link href={`/report/${report._id}`} tabIndex={-1} aria-hidden="true">
            <img
              src="/images/special/No_Image_Available.jpg"
              alt="No image available"
              className="w-full h-full object-cover"
            />
          </Link>
        )}
      </div>

      {/* Card Content */}
      <Link href={`/report/${report._id}`} className="p-3 flex flex-col gap-2 text-right">
        {/* Vote bar + Title/Date row */}
        <div className="flex justify-between gap-2">
          {/* Title and Date */}
          <div className="flex-1">
            <h3 className="text-gray-900 text-sm font-bold line-clamp-1">
              {report.title}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {formatDate(report.createdAt)}
            </p>
          </div>

          {/* Vote visualization bar */}
          <div className="flex flex-col items-center w-1/4 min-w-[70px]">
            <div className="w-full flex h-3 rounded-full overflow-hidden border border-gray-300">
              <div
                className="bg-green-500"
                style={{ width: `${votePercentages.positive}%` }}
              ></div>
              <div
                className="bg-red-500"
                style={{ width: `${votePercentages.negative}%` }}
              ></div>
            </div>
            <div className="flex justify-between w-full text-[10px] mt-1 text-gray-500">
              <span>{votePercentages.positive}%</span>
              <span>{votePercentages.negative}%</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-1">
          <p className="text-xs text-gray-700 leading-relaxed line-clamp-3">
            {report.description}
          </p>
        </div>

        {/* Approximate Location */}
        <div className="mt-1">
          <p className="text-xs font-medium text-gray-800 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {report.city}, {report.approximatePosition}
          </p>
        </div>

        {/* Status & Priority Row */}
        {showStatusRow && (
          <div className="flex justify-between items-center mt-2">
            {/* Resolved Status */}
            <div className="text-xs font-medium text-gray-700">
              وضعیت: {statusTranslations[report.status]}
            </div>

            {/* Priority Status */}
            {showPriority && (
              <div className={`px-2 py-0.5 rounded-full text-[10px] text-white ${priorityColors[report.priority]}`}>
                {priorityTranslations[report.priority]}
              </div>
            )}
          </div>
        )}

        {/* Admin Button & Category Icons */}
        <div className="flex justify-between items-center mt-2">
          {/* Category Icons
          <div className="flex flex-row-reverse gap-1">
            {report.category?.includes('road') && (
              <div className="bg-gray-100 rounded-full p-1">
                <img
                  src="/images/icons/road-barrier-solid.svg"
                  alt="Road Barrier"
                  className="w-4 h-4"
                />
              </div>
            )}
            {report.category?.includes('pollution') && (
              <div className="bg-gray-100 rounded-full p-1">
                <img
                  src="/images/icons/smog-solid.svg"
                  alt="Smog"
                  className="w-4 h-4"
                />
              </div>
            )}
          </div> */}

          {/* Admin Action Button
          {adminView && report.approvalStatus === 0 && (
            <button
              onClick={() => onStatusChange?.(report._id, 1)}
              className="bg-yellow-500 text-white px-2 py-0.5 rounded text-xs hover:bg-yellow-600 transition"
              disabled={loading}
            >
              بررسی
            </button>
          )} */}
        </div>
      </Link>
    </div>
  );
};
