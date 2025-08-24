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

export interface SolveRequest {
  _id: string;
  user: {
    _id: string;
    username: string;
  };
  text: string;
  date: string;
}

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

// async function getReportComments(id: string, token: string | null): Promise<Comment[]> {
//   const res = await fetch(
//     `https://shahriar.thetechverse.ir:3000/api/v1/report/reports/${id}/comments`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     }
//   );

//   if (!res.ok) {
//     throw new Error('دریافت نظرات با خطا مواجه شد');
//   }

//   const data = await res.json();
//   return data.comments || [];
// }

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
  const [solveRequests, setSolveRequests] = useState<SolveRequest[]>([]);
  const [solveRequestsLoading, setSolveRequestsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categoryIconMap: any = {
    failure: { src: "/images/icons/category/tools.svg", alt: "tools", fa: "خرابی" },
    lightbulb: { src: "/images/icons/category/lightbulb.svg", alt: "lightbulb", fa: "روشنایی" },
    unsafe: { src: "/images/icons/category/barrier.svg", alt: "barrier", fa: "ناامنی" },
    trash: { src: "/images/icons/category/trash.svg", alt: "trash", fa: "زباله" },
    smog: { src: "/images/icons/category/smog.svg", alt: "smog", fa: "آلودگی" },
    leaf: { src: "/images/icons/category/leaf.svg", alt: "leaf", fa: "طبیعت" },
  };

  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  const handleVote = async (direction: 'Up' | 'Down') => {
    if (!report) return;
    setIsSubmittingVote(true);

    try {
      const token = getAuthToken();
      const response = await fetch(
        `https://shahriar.thetechverse.ir:3000/api/v1/report/reports/${report._id}/vote`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            direction
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (report) {
        setReport({
          ...report,
          voteScore: data.voteScore
        });
      }

      setAlert({
        type: 'success',
        message: `رای ${direction === 'Up' ? 'مثبت' : 'منفی'} شما ثبت شد`,
        duration: 3000,
        onClose: () => setAlert(null)
      });
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'خطا در ثبت رای',
        duration: 3000,
        onClose: () => setAlert(null)
      });
      console.error('Error voting:', err);
    } finally {
      setIsSubmittingVote(false);
    }
  };

  const calculateVotePercentages = () => {
    if (!report || !report.votes || report.votes.length === 0) {
      return { positivePercent: 50, negativePercent: 50, totalVotes: 0 };
    }

    const totalVotes = report.votes.length;
    const positiveVotes = report.votes.filter((vote: any) => vote.direction === 'Up').length;
    const negativeVotes = totalVotes - positiveVotes;

    const positivePercent = totalVotes > 0 ? (positiveVotes / totalVotes) * 100 : 50;
    const negativePercent = totalVotes > 0 ? (negativeVotes / totalVotes) * 100 : 50;

    return { positivePercent, negativePercent, totalVotes };
  };

  const nextSlide = () => {
    if (report && report.images && report.images.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % report.images.length);
    }
  };

  const prevSlide = () => {
    if (report && report.images && report.images.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + report.images.length) % report.images.length);
    }
  };

  const fetchSolveRequests = async () => {
    try {
      setSolveRequestsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://shahriar.thetechverse.ir:3000/api/v1/report/reports/${params.id}/reqsolved`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch solve requests');

      const data = await response.json();
      setSolveRequests(data.usersReqSovled || []);
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'خطا در دریافت درخواست‌های حل',
        duration: 3000,
        onClose: () => setAlert(null)
      });
    } finally {
      setSolveRequestsLoading(false);
    }
  };

  const handleResolveConfirm = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://shahriar.thetechverse.ir:3000/api/v1/report/reports/${params.id}/resolve/${userId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to mark as resolved');

      setAlert({
        type: 'success',
        message: 'گزارش با موفقیت به عنوان حل شده ثبت شد',
        duration: 3000,
        onClose: () => setAlert(null)
      });

      fetchData();
      fetchSolveRequests();
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'خطا در تایید حل گزارش',
        duration: 3000,
        onClose: () => setAlert(null)
      });
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchSolveRequests();
    }
  }, [isAdmin]);

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

    if (!res.ok && res.status !== 500) throw new Error('بروزرسانی گزارش با خطا مواجه شد');
    return;
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

    if (!res.ok && res.status !== 500) throw new Error('بروزرسانی امتیاز با خطا مواجه شد');
    return;
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
      fetchData();

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

  const { positivePercent, negativePercent, totalVotes } = calculateVotePercentages();
  const formattedDate = formatReportDate(report.createdAt)
  const images = report.images || [];
  const showCompletionAndPriority = reportState === 'approved-unresolved' || reportState === 'approved-resolved';

  return (
    <div className="min-h-screen p-6 pt-20 bg-light">
      {alert && <Alert {...alert} />}

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
                      await updateReportScore(editingScore);
                      fetchData();
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

      {isAdmin && (
        <div className="solve-requests bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 text-right text-dark border-b pb-2">
            درخواست‌های حل گزارش
          </h3>

          {solveRequestsLoading ? (
            <p className="text-center text-dark py-4">در حال بارگیری...</p>
          ) : solveRequests.length === 0 ? (
            <p className="text-center text-dark py-4">هیچ درخواست حلی وجود ندارد</p>
          ) : (
            <div className="space-y-4">
              {solveRequests.map((request) => (
                <div key={request._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-dark">{request.user.username}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(request.date).toLocaleString('fa-IR')}
                    </span>
                  </div>
                  <p className="text-right text-dark mb-3">{request.text}</p>
                  <button
                    onClick={() => handleResolveConfirm(request.user._id)}
                    className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-green-600"
                  >
                    تایید
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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

              <div className="p-2">
                <h2 className="text-xl font-semibold mb-4 text-dark">دسته‌بندی‌ها</h2>
                <div className="flex items-center gap-2 justify-end">
                  {report.category?.map(categoryName => {
                    const iconData = categoryIconMap[categoryName];
                    if (!iconData) return null;
                    return (
                      <div key={categoryName} className="relative">
                        <div
                          onMouseEnter={() => setActiveCategory(categoryName)}
                          onMouseLeave={() => setActiveCategory(null)}
                          onClick={() => setActiveCategory(activeCategory === categoryName ? null : categoryName)}
                          className="cursor-pointer"
                        >
                          <Image
                            src={iconData.src}
                            alt={iconData.alt}
                            width={56}
                            height={54}
                          />
                        </div>
                        {activeCategory === categoryName && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap">
                            {iconData.fa}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-2">
                <h2 className="text-xl font-semibold mb-4 text-dark">
                  رأی‌ها
                </h2>
                <div className="flex items-center justify-center w-full text-xl font-bold mt-[30px]">
                  <button
                    onClick={() => handleVote('Up')}
                    className="pl-2 border-0 bg-transparent"
                    disabled={isSubmittingVote}
                  >
                    <Image src="/images/icons/like.png" alt="like" width={110} height={130} />
                  </button>

                  <div className="flex w-full h-9 rounded-full border border-gray-200 shadow-sm overflow-hidden">
                    <div
                      className="bg-green-200 text-green-600 flex items-center justify-center"
                      style={{ width: `${positivePercent}%` }}
                    >
                      {Math.round(positivePercent) != 0 ? Math.round(positivePercent) + "%" : ""}
                    </div>
                    <div
                      className="bg-red-200 text-red-600 flex items-center justify-center"
                      style={{ width: `${negativePercent}%` }}
                    >
                      {Math.round(negativePercent) != 0 ? Math.round(negativePercent) + "%" : ""}
                    </div>
                  </div>

                  <button
                    onClick={() => handleVote('Down')}
                    className="pr-2 border-0 bg-transparent"
                    disabled={isSubmittingVote}
                  >
                    <Image src="/images/icons/dislike.png" alt="dislike" width={110} height={130} />
                  </button>
                </div>
                <p className="text-center text-sm text-gray-700 mt-2">{totalVotes} نفر رای داده‌اند</p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-4 text-right">
              <h2 className="text-xl font-semibold mb-4 text-dark">
                تصاویر
              </h2>

              {images.length > 0 ? (
                <div className="relative w-full h-80 overflow-hidden rounded-xl mx-auto">
                  <Image
                    src={images[currentIndex].url}
                    className="object-cover w-full h-full"
                    alt="report image"
                    layout="fill"
                  />

                  <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white rounded-full shadow p-2"
                  >
                    <Image src="/images/icons/LeftArrow.png" alt="previous" width={30} height={30} />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white rounded-full shadow p-2"
                  >
                    <Image src="/images/icons/RightArrow.png" alt="next" width={30} height={30} />
                  </button>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {images.map((_, idx) => (
                      <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentIndex ? "bg-green-400" : "bg-gray-300"}`} />
                    ))}
                  </div>
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
