'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Report, Comment, ReportState } from '@/components/report/ReportTypes';
import { useParams } from 'next/navigation';
import { Alert, AlertProps } from '@/components/Alert';
import {
  priorityTranslations,
  approvalStatusTranslations,
  statusTranslations,
  reportOpennessTranslations,
  formatReportDate,
  getReportState
} from '@/components/report/reportUtils';

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

async function getReportComments(id: string, token: string | null): Promise<Comment[]> {
  const res = await fetch(
    `https://shahriar.thetechverse.ir:3000/api/v1/report/reports/${id}/comments`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('دریافت نظرات با خطا مواجه شد');
  }

  const data = await res.json();
  return data.comments || [];
}

async function postComment(id: string, text: string, token: string | null): Promise<void> {
  const res = await fetch(
    `https://shahriar.thetechverse.ir:3000/api/v1/report/reports/${id}/comments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'ارسال نظر با خطا مواجه شد');
  }
}

export default function ReportPage() {
  const params = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [reportState, setReportState] = useState<ReportState>('unknown');

  const [isAdmin, setIsAdmin] = useState(false);
  const [editingPriority, setEditingPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [editingScore, setEditingScore] = useState(report?.score || 0);
  const [priorityLoading, setPriorityLoading] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [scoreLoading, setScoreLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('role');
      setIsAdmin(role === 'admin');
    }
  }, []);

  const updateReportPriorityAndApproval = async (priority: string, approvalStatus: number) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `https://shahriar.thetechverse.ir:3000/api/v1/admin/reports/${params.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priority, approvalStatus }),
      }
    );

    if (!res.ok) throw new Error('بروزرسانی گزارش با خطا مواجه شد');
    return await res.json();
  };

  const updateReportScore = async (score: number) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `https://shahriar.thetechverse.ir:3000/api/v1/admin/reports/${params.id}/score`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score }),
      }
    );

    if (!res.ok) throw new Error('بروزرسانی امتیاز با خطا مواجه شد');
    return await res.json();
  };

  useEffect(() => {
    if (report) {
      setEditingPriority(report.priority);
      setReportState(getReportState(report));
    }
  }, [report]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error('نیاز به احراز هویت');

      const reportData = await getReportData(params.id as string, token);
      setReport(reportData);

      // const commentsData = await getReportComments(params.id as string, token);
      setComments(reportData.comments || []);
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchData();
    }
  }, [params.id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error('نیاز به احراز هویت');

      await postComment(params.id as string, newComment, token);
      setNewComment('');

      const updatedComments = await getReportComments(params.id as string, token);
      setComments(updatedComments);

      setAlert({
        type: 'success',
        message: 'نظر شما با موفقیت ثبت شد',
        duration: 3000,
        onClose: () => setAlert(null)
      });
    } catch (err) {
      setAlert({
        type: 'error',
        message: err instanceof Error ? err.message : 'خطا در ارسال نظر',
        duration: 3000,
        onClose: () => setAlert(null)
      });
    } finally {
      setCommentLoading(false);
    }
  };

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

  const showCompletionAndPriority = reportState === 'approved-unresolved' || reportState === 'approved-resolved';

  return (
    <div className="min-h-screen p-6 pt-20 bg-light">
      {isAdmin && report && (
        <div className="admin-controls bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 text-right text-dark border-b pb-2">
            مدیریت گزارش
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="control-group">
              <label className="block mb-2 font-medium text-right text-dark">
                اولویت
              </label>
              <div className="flex items-center gap-4">
                <div className="flex flex-col md:flex-row gap-2">
                  {['Low', 'Medium', 'High'].map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setEditingPriority(priority as "Low" | "Medium" | "High")}
                      className={`p-1 rounded-full transition-all ${
                        editingPriority === priority
                          ? 'ring-2 ring-blue-500'
                          : 'opacity-50 hover:opacity-75'
                      }`}
                    >
                      <Image
                        src={`/images/icons/priority${priority}.png`}
                        alt={priority}
                        width={128}
                        height={128}
                        className={`${
                          editingPriority === priority
                            ? ''
                            : 'filter grayscale'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <button
                  onClick={async () => {
                    if (!report) return;
                    setPriorityLoading(true);
                    try {
                      await updateReportPriorityAndApproval(
                        editingPriority,
                        report.approvalStatus
                      );
                      setReport({ ...report, priority: editingPriority });
                      setAlert({
                        type: 'success',
                        message: 'اولویت با موفقیت بروزرسانی شد',
                        duration: 3000,
                        onClose: () => setAlert(null)
                      });
                    } catch (err) {
                      setAlert({
                        type: 'error',
                        message: err instanceof Error ? err.message : 'خطا در بروزرسانی اولویت',
                        duration: 3000,
                        onClose: () => setAlert(null)
                      });
                    } finally {
                      setPriorityLoading(false);
                    }
                  }}
                  disabled={priorityLoading || report.priority === editingPriority}
                  className={`px-4 py-2 rounded-lg text-white min-w-[80px] ${
                    priorityLoading || report.priority === editingPriority
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {priorityLoading ? '...' : 'ذخیره'}
                </button>
              </div>
            </div>

            <div className="control-group">
              <label className="block mb-2 font-medium text-right text-dark">
                وضعیت تایید
              </label>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    if (!report) return;
                    setApprovalLoading(true);
                    try {
                      await updateReportPriorityAndApproval(
                        report.priority,
                        1 // Approved
                      );
                      const updatedReport = { ...report, approvalStatus: 1 };
                      setReport(updatedReport);
                      setReportState(getReportState(updatedReport));
                      setAlert({
                        type: 'success',
                        message: 'گزارش با موفقیت تایید شد',
                        duration: 3000,
                        onClose: () => setAlert(null)
                      });
                    } catch (err) {
                      setAlert({
                        type: 'error',
                        message: err instanceof Error ? err.message : 'خطا در تایید گزارش',
                        duration: 3000,
                        onClose: () => setAlert(null)
                      });
                    } finally {
                      setApprovalLoading(false);
                    }
                  }}
                  disabled={approvalLoading || report.approvalStatus === 1}
                  className={`flex-1 py-2 rounded-lg text-white ${
                    report.approvalStatus === 1
                      ? 'bg-gray-400 cursor-not-allowed'
                      : approvalLoading
                        ? 'bg-gray-400'
                        : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  تایید
                </button>

                <button
                  onClick={async () => {
                    if (!report) return;
                    setApprovalLoading(true);
                    try {
                      await updateReportPriorityAndApproval(
                        report.priority,
                        2 // Denied
                      );
                      const updatedReport = { ...report, approvalStatus: 2 };
                      setReport(updatedReport);
                      setReportState(getReportState(updatedReport));
                      setAlert({
                        type: 'success',
                        message: 'گزارش با موفقیت رد شد',
                        duration: 3000,
                        onClose: () => setAlert(null)
                      });
                    } catch (err) {
                      setAlert({
                        type: 'error',
                        message: err instanceof Error ? err.message : 'خطا در رد گزارش',
                        duration: 3000,
                        onClose: () => setAlert(null)
                      });
                    } finally {
                      setApprovalLoading(false);
                    }
                  }}
                  disabled={approvalLoading || report.approvalStatus === 2}
                  className={`flex-1 py-2 rounded-lg text-white ${
                    report.approvalStatus === 2
                      ? 'bg-gray-400 cursor-not-allowed'
                      : approvalLoading
                        ? 'bg-gray-400'
                        : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  رد
                </button>
              </div>
            </div>

            <div className="control-group">
              <label className="block mb-2 font-medium text-right text-dark">
                امتیاز (0-100)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editingScore}
                  onChange={(e) => setEditingScore(parseInt(e.target.value) || 0)}
                  className="flex-grow p-2 border rounded-lg text-right text-dark"
                  disabled={scoreLoading}
                />
                <button
                  onClick={async () => {
                    if (!report) return;
                    if (editingScore < 0 || editingScore > 100) {
                      setAlert({
                        type: 'error',
                        message: 'امتیاز باید بین ۰ تا ۱۰۰ باشد',
                        duration: 3000,
                        onClose: () => setAlert(null)
                      });
                      return;
                    }

                    setScoreLoading(true);
                    try {
                      const response = await updateReportScore(editingScore);
                      setReport(response.report);
                      setAlert({
                        type: 'success',
                        message: 'امتیاز با موفقیت بروزرسانی شد',
                        duration: 3000,
                        onClose: () => setAlert(null)
                      });
                    } catch (err) {
                      setAlert({
                        type: 'error',
                        message: err instanceof Error ? err.message : 'خطا در بروزرسانی امتیاز',
                        duration: 3000,
                        onClose: () => setAlert(null)
                      });
                    } finally {
                      setScoreLoading(false);
                    }
                  }}
                  disabled={scoreLoading}
                  className={`px-4 py-2 rounded-lg text-white ${
                    scoreLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {scoreLoading ? 'در حال ذخیره...' : 'ذخیره'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {alert && <Alert {...alert} />}

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-right text-dark">
            {report.title || 'بدون عنوان'}
          </h1>

          <div className="flex items-center gap-2">
            {reportState === 'not-approved' && (
              <Image
                src="/images/icons/clock.png"
                alt="در انتظار تایید"
                width={32}
                height={32}
              />
            )}
            {reportState === 'approved-unresolved' && (
              <Image
                src="/images/icons/unSolved.png"
                alt="گزارش باز"
                width={32}
                height={32}
              />
            )}
            {reportState === 'approved-resolved' && (
              <Image
                src="/images/icons/solved.png"
                alt="گزارش حل شده"
                width={32}
                height={32}
              />
            )}
            {reportState === 'denied' && (
              <Image
                src="/images/icons/circle-x.png"
                alt="گزارش رد شده"
                width={32}
                height={32}
              />
            )}
            <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
              reportOpennessTranslations[reportState] === 'باز'
                ? 'bg-green-500'
                : 'bg-red-500'
            }`}>
              {reportOpennessTranslations[reportState]}
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-md p-6 text-right text-dark">
            <div className="space-y-6">
              {showCompletionAndPriority && (
                <div className="flex items-center gap-2 justify-end">
                  <Image
                    src={`/images/icons/priority${report.priority}.png`}
                    alt={priorityTranslations[report.priority]}
                    width={128}
                    height={128}
                    className="object-contain transition-all"
                  />
                </div>
              )}

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
                  <h3 className="font-semibold">وضعیت تایید</h3>
                  <p>{approvalStatusTranslations[report.approvalStatus] || 'نامشخص'}</p>
                </div>
                {showCompletionAndPriority && (
                  <div>
                    <h3 className="font-semibold">وضعیت پیشرفت</h3>
                    <p>{statusTranslations[report.completionStatus] || 'نامشخص'}</p>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">امتیاز</h3>
                  <p>{report.score}</p>
                </div>
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

        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-right text-dark border-b pb-2">
            نظرات ({comments.length})
          </h2>

          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="flex flex-col gap-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="نظر خود را اینجا بنویسید..."
                className="w-full p-4 border rounded-lg text-right min-h-[120px] text-dark"
                disabled={commentLoading}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={commentLoading || !newComment.trim()}
                  className={`px-6 py-2 rounded-lg text-white ${
                    commentLoading || !newComment.trim()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary hover:bg-primary-dark'
                  }`}
                >
                  {commentLoading ? 'در حال ارسال...' : 'ارسال نظر'}
                </button>
              </div>
            </div>
          </form>

          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                هیچ نظری ثبت نشده است. اولین نظر را شما ثبت کنید!
              </p>
            ) : (
              comments.map(comment => (
                <div
                  key={comment._id}
                  className="border-b pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                      <span className="font-bold text-dark">
                        {comment.user}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatReportDate(comment.date)}
                    </span>
                  </div>
                  <p className="text-right text-gray-700 mt-2">
                    {comment.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
