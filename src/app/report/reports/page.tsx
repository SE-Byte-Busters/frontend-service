"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

type UserData = {
  _id: string;
  score: number;
  rank: number;
  username: string;
};

type ReportImage = {
  key: string;
  url: string;
};

type Location = {
  type: string;
  coordinates: [number, number];
};

type Report = {
  _id: string;
  user: string;
  title: string;
  description: string;
  approximatePosition: string;
  location: Location;
  city: string;
  category: string[];
  images: ReportImage[];
  status: number;
  approvalStatus: number;
  voteScore: number;
  createdAt: string;
  updatedAt: string;
};

type ReportsResponse = {
  reports: Report[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
};

export default function NewReport() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentImageIndices, setCurrentImageIndices] = useState<Record<number, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // user profile data
        const userRes = await fetch(
          'https://shahriar.thetechverse.ir:3000/api/v1/user-profile/score-and-rank', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        if (!userRes.ok) throw new Error('Failed to fetch user data');
        const userData = await userRes.json();
        setUserData(userData.data);

        // reports data
        const reportsRes = await fetch(
          'https://shahriar.thetechverse.ir:3000/api/v1/report/reports', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        if (!reportsRes.ok) throw new Error('Failed to fetch reports');
        const reportsData = await reportsRes.json();
        setReports(reportsData.data.reports);

        // Initialize image indices for each report
        const indices: Record<number, number> = {};
        reportsData.data.reports.forEach((_: Report, index: number) => {
          indices[index] = 0;
        });
        setCurrentImageIndices(indices);
      } catch (err) {
        // silently handle errors
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const nextImage = (reportIndex: number) => {
    setCurrentImageIndices(prev => ({
      ...prev,
      [reportIndex]: (prev[reportIndex] + 1) % (reports[reportIndex]?.images?.length || 1)
    }));
  };

  const prevImage = (reportIndex: number) => {
    setCurrentImageIndices(prev => ({
      ...prev,
      [reportIndex]: (prev[reportIndex] - 1 + (reports[reportIndex]?.images?.length || 1)) % (reports[reportIndex]?.images?.length || 1)
    }));
  };

  const getStatusText = (status: number): string => {
    switch(status) {
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

  // placeholder data for loading state
  const placeholderReports: Report[] = Array(3).fill(null).map((_, index) => ({
    _id: `placeholder-${index}`,
    user: '',
    title: 'در حال بارگذاری...',
    description: 'توضیحات گزارش در حال بارگذاری می‌باشد',
    approximatePosition: 'موقعیت نامشخص',
    location: {type: '', coordinates: [0, 0]},
    city: 'شهر نامشخص',
    category: [],
    images: [],
    status: 0,
    approvalStatus: 0,
    voteScore: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  const displayReports = loading ? placeholderReports : reports;
  const displayUserData = loading ? {
    _id: 'placeholder',
    score: 0,
    rank: 0,
    username: 'کاربر'
  } : userData;

  return (
    <div className="bg-light min-h-screen flex flex-col items-center px-4 pt-20 pb-12 lg:pt-10 lg:pb-10">
      <div className="flex flex-col items-center w-full max-w-6xl gap-12 mt-10">
        {/* Profile Info & Stats */}
        <div className="w-full flex flex-col-reverse lg:flex-row-reverse items-center lg:items-center lg:justify-center gap-6">
          {/* Stats Section */}
          <div className="flex flex-col items-center gap-2 w-full max-w-md">
            <div className="w-full flex justify-between px-6 text-lg text-gray-900">
              <span className="text-right w-1/3">رتبه</span>
              <span className="text-center w-1/3">نشان دریافتی</span>
              <span className="text-left w-1/3">امتیاز کل</span>
            </div>
            <div className="bg-accent rounded-full px-6 py-3 flex justify-between items-center w-full text-sm md:text-base text-gray-900">
              <span className="text-right w-1/3">{displayUserData?.rank ?? '--'}</span>
              <span className="text-center w-1/3">
                {displayUserData?.rank === 1 ? 'قهرمان محیط زیست و فعال ترین گزارش دهنده' : '--'}
              </span>
              <span className="text-left w-1/3">{displayUserData?.score ?? '--'}</span>
            </div>
          </div>

          {/* Profile Image + Name */}
          <div className="flex flex-col items-center lg:items-end">
            <Image
              src="/images/avatars/default-profile.png"
              alt="Profile"
              width={120}
              height={120}
              className="rounded-full"
            />
            <p className="font-bold text-md text-gray-900 mt-2">{displayUserData?.username ?? 'کاربر'}</p>
          </div>
        </div>

        {/* Reports Section */}
        <div className="w-full flex flex-row-reverse flex-wrap justify-end gap-6">
          {displayReports.length > 0 ? (
            displayReports.map((report, reportIndex) => (
              <div key={report._id} className="w-full sm:w-[300px] bg-white border border-gray-300 rounded-xl shadow-md overflow-hidden flex flex-col">
                {/* Image Carousel */}
                <div className="relative w-full h-48 bg-gray-100">
                  {loading ? (
                    <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                  ) : report.images && report.images.length > 0 ? (
                    <>
                      <img
                        src={report.images[currentImageIndices[reportIndex]]?.url || "/images/special/No_Image_Available.jpg"}
                        alt={report.title}
                        className="w-full h-full object-cover"
                      />

                      {/* Pagination dots */}
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                        {report.images.map((_: ReportImage, index: number) => (
                          <span
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              index === currentImageIndices[reportIndex] ? 'bg-green-400' : 'bg-gray-300'
                            }`}
                          ></span>
                        ))}
                      </div>

                      {/* Left arrow */}
                      <div
                        className="absolute top-1/2 left-2 transform -translate-y-1/2 cursor-pointer"
                        onClick={() => prevImage(reportIndex)}
                      >
                        <img src="/images/icons/icons8-left-arrow-100.png" alt="Previous" className="w-6 h-6" />
                      </div>

                      {/* Right arrow */}
                      <div
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer"
                        onClick={() => nextImage(reportIndex)}
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

                  {/* Status and Clock */}
                  <div className="flex justify-between items-center mt-2">
                    {/* Right side: اولویت بندی */}
                    <span className="text-xs border border-yellow-400 text-yellow-700 px-3 py-1 rounded-full">
                      {loading ? (
                        <span className="inline-block w-20 h-4 bg-gray-200 rounded animate-pulse"></span>
                      ) : getStatusText(report.status)}
                    </span>

                    {/* Left side: بررسی + ساعت */}
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
                  </div>

                  {/* Actions (always on right) */}
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
            ))
          ) : (
            !loading && (
              <div className="w-full text-center py-10 text-gray-500">
                هیچ گزارشی یافت نشد
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
