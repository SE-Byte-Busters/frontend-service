'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Report } from '@/components/report/ReportTypes';
import { useParams } from 'next/navigation';
import { Alert, AlertProps } from '@/components/Alert';
import {
  priorityTranslations,
  priorityColors,
  approvalStatusTranslations,
  completionStatusTranslations,
  reportStatusTranslations,
  formatReportDate
} from '@/components/report/reportTranslations'

const ReportMap = dynamic(
  () => import('@/components/report/ReportMap'),
  {
    ssr: false,
    loading: () => <p>در حال بارگیری نقشه...</p>
  }
);

async function getReportData(id: string, token: string | null): Promise<Report> {
  const res = await fetch(
    `https://shahriar.thetechverse.ir:3000/api/v1/admin/reports/${id}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('دریافت اطلاعات گزارش با شکست مواجه شد');
  }

  const data = await res.json();
  return data.report;
}

export default function ReportPage() {
  const params = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AlertProps | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error('نیاز به احراز هویت');
          }
          const data = await getReportData(params.id as string, token);
          setReport(data);
        } catch (err) {
          setAlert({
            type: 'error',
            message: err instanceof Error ? err.message : 'خطای ناشناخته‌ای رخ داد',
            duration: 3000,
            onClose: () => setAlert(null)
          });
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-light text-dark">
        <div>در حال بارگیری...</div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-light text-dark">
        <div>گزارشی یافت نشد</div>
      </div>
    );
  }

  const formattedDate = formatReportDate(report.createdAt)
  const images = report.images || [];

  return (
    <div className="min-h-screen p-6 pt-20 bg-light">
      {alert && <Alert {...alert} />}

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-right text-dark">
          {report.title || 'بدون عنوان'}
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-md p-6 text-right text-dark">
            <div className="space-y-6">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-sm font-medium">اولویت:</span>
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm font-medium ${priorityColors[report.priority]}`}
                >
                  {priorityTranslations[report.priority] || report.priority}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">توضیحات</h2>
                <p className="text-gray-700">{report.description || 'بدون توضیح'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                <div>
                  <h3 className="font-semibold">گزارش شده توسط</h3>
                  <p>{report.user?.username || 'کاربر ناشناس'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">تاریخ گزارش</h3>
                  <p>{formattedDate}</p>
                </div>
                <div>
                  <h3 className="font-semibold">شهر</h3>
                  <p>{report.city || 'نامشخص'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">موقعیت تقریبی</h3>
                  <p>{report.approximatePosition || 'نامشخص'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">دسته‌بندی‌ها</h3>
                  <div className="flex flex-wrap gap-2 mt-1 justify-end">
                    {(report.category || []).map((cat, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded-md text-sm bg-accent text-white"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">وضعیت گزارش</h3>
                  <p>{reportStatusTranslations[report.status] || 'نامشخص'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">وضعیت تایید</h3>
                  <p>{approvalStatusTranslations[report.approvalStatus] || 'نامشخص'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">وضعیت پیشرفت</h3>
                  <p>{completionStatusTranslations[report.completionStatus] || 'نامشخص'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">امتیاز</h3>
                  <p>{report.score || 0}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-right justify-end">
                <span className="font-semibold">امتیاز جامعه:</span>
                <span className="px-3 py-1 rounded-full font-medium bg-primary text-white">
                  {report.voteScore || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-4 text-right">
              <h2 className="text-xl font-semibold mb-4 text-dark">
                تصاویر
              </h2>

              {images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {images.map((image) => (
                    <div key={image._id} className="relative aspect-square rounded-md overflow-hidden">
                      <Image
                        src={image.url}
                        alt="عکس گزارش"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>تصویری برای این گزارش موجود نیست</p>
                </div>
              )}
            </div>

              <div className="bg-white rounded-lg shadow-md p-4 h-96 text-right flex flex-col overflow-hidden">
              <h2 className="text-xl font-semibold mb-4 text-dark">
                موقعیت
              </h2>
              <div className="flex-grow">
                {report.location ? (
                  <ReportMap
                    coordinates={report.location.coordinates}
                    positionText={report.approximatePosition}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    اطلاعات موقعیت موجود نیست
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
