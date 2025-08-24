"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Report, ReportState } from './ReportTypes';
import {
  priorityTranslations,
  getReportState,
} from './reportUtils';
import { Icon } from '@/components/Icon';

type ReportCardProps = {
  report: Report;
  loading?: boolean;
  adminView?: boolean;
  onStatusChange?: (reportId: string, newStatus: number) => void;
};

const statusConfig: Record<ReportState, {
  text: string;
  icon: string;
  color: string;
}> = {
  'not-approved': {
    text: 'در حال بررسی',
    icon: '/images/icons/clock.png',
    color: 'text-amber-800',
  },
  'approved-unresolved': {
    text: '',
    icon: '/images/icons/unSolved.png',
    color: 'text-green-500',
  },
  'approved-resolved': {
    text: '',
    icon: '/images/icons/solved.png',
    color: 'text-green-500',
  },
  'denied': {
    text: 'رد شده',
    icon: '/images/icons/circle-x.png',
    color: 'text-red-600',
  },
  'unknown': {
    text: 'نامشخص',
    icon: '/images/icons/help-circle.png',
    color: 'text-gray-500',
  }
};

export const ReportCard = ({
  report,
  loading = false,
  adminView = false,
  onStatusChange,
}: ReportCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const reportState = getReportState(report);
  const statusInfo = statusConfig[reportState];
  const router = useRouter();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (report.images?.length || 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      (prev - 1 + (report.images?.length || 1)) % (report.images?.length || 1)
    );
  };

  const calculateVotePercentage = () => {
    const total = report?.votes?.length || 0;
    if (total === 0) return { positive: 50, negative: 50 };
    const positive = report?.votes?.filter(v => v.direction === 'Up').length || 0;
    const negative = report?.votes?.filter(v => v.direction === 'Down').length || 0;

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

  const showInPriority = reportState === 'not-approved';
  const showPriority = reportState === 'approved-unresolved' || reportState === 'approved-resolved';

  return (
    <div className="relative h-full w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200">
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
      <div className="p-3 flex flex-col gap-2 text-right">
        <Link href={`/report/${report._id}`}>
          <div className="flex justify-between gap-2">
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
              <Icon name="MapPin" className='w-3 h-3' />
              {report.city}, {report.approximatePosition}
            </p>
          </div>

          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center justify-center">
              {showPriority && (
                <Image
                  src={`/images/icons/priority${report.priority}.png`}
                  alt={priorityTranslations[report.priority]}
                  width={96}
                  height={96}
                  className="object-contain transition-all"
                />
              )}
              {showInPriority && (
                <Image
                  src={`/images/icons/inPriority.png`}
                  alt={priorityTranslations[report.priority]}
                  width={96}
                  height={96}
                  className="object-contain transition-all"
                />
              )}
            </div>

            <div className={`flex flex-col items-center justify-center p-1.5 rounded-lg`}>
              <Image
                src={statusInfo.icon}
                alt={statusInfo.text}
                width={36}
                height={36}
                className="object-contain"
              />
              <span className={`text-xs font-medium ${statusInfo.color} mt-1`}>
                {statusInfo.text}
              </span>
            </div>
          </div>
        </Link>

        <button
          onClick={() => router.push(`/submit-ticket?reportId=${report._id}`)}
          className="flex items-center justify-center gap-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-dark transition-colors"
        >
          <Icon name="Ticket" className="w-5 h-5" />
          <span>ثبت تیکت</span>
        </button>

        {/* Admin Button & Category Icons */}
        {/* <div className="flex justify-between items-center mt-2">
           Category Icons
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
          )}
        </div> */}
      </div>
    </div>
  );
};
