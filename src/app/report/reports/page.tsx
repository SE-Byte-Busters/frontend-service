"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Alert, AlertProps } from '@/components/Alert';
import { ReportsList } from '@/components/report/ReportList';
import { Report } from '@/components/report/ReportTypes';

type UserData = {
  _id: string;
  score: number;
  rank: number;
  username: string;
};

export default function NewReport() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [showAuthAlert, setShowAuthAlert] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setShowAuthAlert(true);
        return;
      }

      try {
        const userRes = await fetch(
          'https://shahriar.thetechverse.ir:3000/api/v1/user-profile/score-and-rank', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!userRes.ok) throw new Error('Invalid token');
        const userData = await userRes.json();
        setUserData(userData.data);

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
      } catch (err: any) {
        if (err.message === 'Invalid token') {
          localStorage.removeItem('token');
          setShowAuthAlert(true);
        } else {
          setAlert({
            type: 'error',
            message: 'خطا در دریافت اطلاعات. لطفاً دوباره تلاش کنید.',
            duration: 3000,
            onClose: () => setAlert(null)
          });
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const placeholderReports: Report[] = Array(3).fill(null).map((_, index) => ({
    _id: `placeholder-${index}`,
    user: '',
    title: 'در حال بارگذاری...',
    description: 'توضیحات گزارش در حال بارگذاری می‌باشد',
    approximatePosition: 'موقعیت نامشخص',
    location: { type: '', coordinates: [0, 0] },
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

  if (showAuthAlert) {
    return (
      <div className="bg-light min-h-screen flex items-center justify-center">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md shadow-lg max-w-md">
          <div className="flex items-center gap-2 text-yellow-700" dir="rtl">
            <span>⚠️</span>
            <span>برای مشاهده گزارش‌های خود ابتدا وارد حساب کاربری شوید</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-h-screen flex flex-col items-center px-4 pt-20 pb-12 lg:pt-10 lg:pb-10">
      {alert && <Alert {...alert} />}
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
          <div className="flex flex-col items-center">
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
        {displayReports.length > 0 ? (
          <ReportsList reports={displayReports} loading={loading} />
        ) : (
          !loading && (
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
                    تو هم می‌تونی اثر بذاری!
                  </h1>

                  <p className="text-base text-justify sm:text-lg md:text-xl text-dark max-w-md leading-relaxed">
                    منتظرت بودیم! الان بهترین زمانه که صدات رو به گوش برسونی و کمک کنی شهری پاک‌تر و سالم‌تر داشته باشیم.
                  </p>

                  <Link
                    href="/map"
                    className="bg-accent text-white text-lg sm:text-xl md:text-2xl rounded-lg px-4 py-2 sm:px-6 sm:py-3
                    transition duration-300 hover:text-black w-auto"
                    aria-label="ثبت گزارش جدید"
                  >
                    ثبت گزارش جدید
                  </Link>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
