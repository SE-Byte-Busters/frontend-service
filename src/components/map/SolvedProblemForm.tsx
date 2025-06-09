'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useReport } from '@/context/ReportContext';

interface User {
  _id: string;
  username: string;
}

interface Comment {
  _id: string;
  user: User;
  text: string;
  date: string;
}

interface SolveRequest {
  _id: string;
  user: User;
  text: string;
  date: string;
}

interface Report {
  _id: string;
  user: User;
  title: string;
  description: string;
  approximatePosition: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  city: string;
  category: string[];
  priority: string;
  images: Array<{
    key: string;
    url: string;
    _id: string;
  }>;
  completionStatus: number;
  approvalStatus: number;
  status: number;
  voteScore: number;
  votes: any[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  usersReqSolve: SolveRequest[];
  resolvedAt?: string;
  resolvedBy?: string;
}

interface SolvedProblemFormProps {
  reportId?: string;
  onSubmit?: (data: any) => void;
  className?: string;
}

const SolvedProblemForm: React.FC<SolvedProblemFormProps> = ({
  reportId,
  onSubmit,
  className
}) => {
  // State for report data
  const [report, setReport] = useState<Report | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [solveRequests, setSolveRequests] = useState<SolveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Image carousel state
  const [currentIndex, setCurrentIndex] = useState(0);

  // Context
  const {
    isVisible,
    setIsVisible,
    position,
    setPosition,
    setAlert,
    isReporting,
    setIsReporting
  } = useReport();

  // Get token from localStorage
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // API call to fetch report details
  const fetchReportDetails = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      const response = await fetch(
        `https://shahriar.thetechverse.ir:3000/api/v1/reports/${id}/`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setReport(data.report);
      setComments(data.report.comments || []);
      setSolveRequests(data.report.usersReqSolve || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت اطلاعات گزارش');
      console.error('Error fetching report:', err);
    } finally {
      setLoading(false);
    }
  };

  // API call to fetch comments
  const fetchComments = async (id: string) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `https://shahriar.thetechverse.ir:3000/api/v1/reports/${id}/comments`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setComments(data.comments || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  // Submit new comment
  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !reportId) return;

    setIsSubmittingComment(true);
    try {
      const token = getAuthToken();
      const response = await fetch(
        `https://shahriar.thetechverse.ir:3000/api/v1/reports/${reportId}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: newComment
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setNewComment('');
      await fetchComments(reportId);
      setAlert({
        type: 'success',
        message: 'نظر با موفقیت ثبت شد'
      });
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'خطا در ثبت نظر'
      });
      console.error('Error submitting comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Vote on report
  const handleVote = async (direction: 'Up' | 'Down') => {
    if (!reportId) return;

    try {
      const token = getAuthToken();
      const response = await fetch(
        `https://shahriar.thetechverse.ir:3000/api/v1/reports/${reportId}/vote`,
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

      // Update report with new vote scores
      if (report) {
        setReport({
          ...report,
          voteScore: data.voteScore
        });
      }

      setAlert({
        type: 'success',
        message: `رای ${direction === 'Up' ? 'مثبت' : 'منفی'} شما ثبت شد`
      });
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'خطا در ثبت رای'
      });
      console.error('Error voting:', err);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status text
  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return 'جدید';
      case 1: return 'در حال بررسی';
      case 2: return 'حل شده';
      case 3: return 'رد شده';
      default: return 'نامشخص';
    }
  };

  // Get priority text
  const getPriorityText = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'بالا';
      case 'medium': return 'متوسط';
      case 'low': return 'پایین';
      default: return priority;
    }
  };

  // Calculate vote percentages
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

  // Image carousel functions
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

  // Effect to fetch data when component mounts
  useEffect(() => {
    if (reportId) {
      fetchReportDetails(reportId);
    }
  }, [reportId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#fff9f5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#f89b2f]"></div>
          <p className="mt-4 text-[#685752]">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#fff9f5]">
        <div className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>خطا: {error}</p>
          <button
            onClick={() => reportId && fetchReportDetails(reportId)}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#fff9f5]">
        <p className="text-[#685752]">گزارش یافت نشد</p>
      </div>
    );
  }

  const { positivePercent, negativePercent, totalVotes } = calculateVotePercentages();

  return (
    <div dir="rtl" className={`${className} grid grid-cols-12 gap-6 p-6 bg-[#fff5f3] rounded-xl shadow-sm min-h-screen`}>
      {/* بخش اطلاعات و کامنت‌ها */}
      <div className="col-span-12 md:col-span-7 flex flex-row">
        <div className="flex justify-between items-start flex-row w-full">
          <div className="flex-1">
            <section className="flex items-center gap-2">
              <Image src="/images/icons/profile.png" alt="profile" width={80} height={80} />
              <section className="flex flex-col">
                <h2 className="font-bold text-lg text-gray-800 mr-0">
                  تاریخ حل مشکل: {report.resolvedAt ? formatDate(report.resolvedAt) : 'نامشخص'}
                </h2>
                <h4 className="font-bold text-sm text-gray-800">
                  {report.resolvedBy || 'نامشخص'}
                </h4>
              </section>
            </section>

            {/* Priority Display */}
            <div className="m-[10px]">
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                report.priority === 'high' ? 'bg-red-100 text-red-800' :
                report.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                اولویت: {getPriorityText(report.priority)}
              </span>
            </div>

            <label className="font-bold text-[24px] text-[#685752] font-vazirmatn m-[10px]">
              نظرات و پیشنهادات
            </label>

            {/* Add Comment Form */}
            <textarea
              className="w-[90%] border border-[#685752] p-3 m-2 rounded-[30px] text-[#685752]"
              placeholder="نظر خود را در مورد حل این مشکل بنویسید..."
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />

            <button
              onClick={handleCommentSubmit}
              disabled={isSubmittingComment || !newComment.trim()}
              className="mx-2 bg-[#f89b2f] text-white px-4 py-2 rounded-lg hover:bg-[#e38821] transition disabled:opacity-50"
            >
              {isSubmittingComment ? 'در حال ثبت...' : 'ثبت نظر'}
            </button>

            {/* Comments List */}
            <div className="mt-4">
              {comments.length === 0 ? (
                <p className="text-[#87878B] text-center m-4">هنوز نظری ثبت نشده است</p>
              ) : (
                comments.map((comment) => (
                  <h2 key={comment._id} className="flex border-b border-[#685752] pb-6 pt-4 m-2">
                    <span className="font-bold text-[20px] text-[#685752] font-vazirmatn ml-8">
                      {comment.user.username}
                    </span>
                    <span className="font-bold text-[20px] text-[#685752] font-vazirmatn">
                      {comment.text}
                    </span>
                  </h2>
                ))
              )}
            </div>
          </div>

          <Image src="/images/icons/solved.png" alt="solved" width={80} height={40} />
        </div>
      </div>

      {/* بخش تصویر و رأی‌دهی */}
      <div className="col-span-12 md:col-span-5 space-y-3">
        {/* Image Carousel */}
        <div className="relative w-80 h-80 overflow-hidden rounded-xl mx-auto">
          {report.images && report.images.length > 0 ? (
            <>
              <Image
                src={report.images[currentIndex]?.url || "/images/special/kharabi.png"}
                className="object-cover"
                alt="report"
                width={350}
                height={310}
              />

              {report.images.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white rounded-full shadow"
                  >
                    <Image src="/images/icons/LeftArrow.png"
                      className="object-cover"
                      alt="previous" width={50} height={50} />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white rounded-full shadow"
                  >
                    <Image src="/images/icons/RightArrow.png"
                      className="object-cover"
                      alt="next" width={50} height={50} />
                  </button>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {report.images.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full ${
                          idx === currentIndex ? "bg-green-400" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <Image
              src="/images/special/kharabi.png"
              className="object-cover"
              alt="report"
              width={350}
              height={310}
            />
          )}
        </div>

        {/* Vote Bar */}
        <div className="w-full space-y-1">
          <div className="flex w-full h-8 overflow-hidden rounded-full border border-gray-200 shadow-sm text-sm font-bold mt-[10px]">
            <button onClick={() => handleVote('Down')} className="text-green-600 font-semibold rounded-full">
              <Image src="/images/icons/dislike.png" alt="dislike" width={56} height={64} />
            </button>

            <div
              className="bg-red-200 text-red-600 flex items-center justify-center"
              style={{
                width: `${negativePercent}%`,
                borderTopLeftRadius: '9999px',
                borderBottomLeftRadius: '9999px',
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }}
            >
              {Math.round(negativePercent)}٪
            </div>

            <div
              className="bg-green-200 text-green-600 flex items-center justify-center"
              style={{
                width: `${positivePercent}%`,
                borderTopRightRadius: '9999px',
                borderBottomRightRadius: '9999px',
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
            >
              {Math.round(positivePercent)}٪
            </div>

            <button onClick={() => handleVote('Up')} className="text-red-500 font-semibold rounded-full">
              <Image src="/images/icons/like.png" alt="like" width={56} height={64} />
            </button>
          </div>

          <p className="text-center text-xs text-gray-700">{totalVotes} نفر رای داده‌اند</p>

          {/* Report Info */}
          <section className="flex justify-between items-center gap-0 mt-10">
            <Image src="/images/icons/profile.png" alt="profile" width={80} height={40} />
            <section>
              <h2 className="font-bold text-xl text-gray-800 mr-0 mt-4">{report.title}</h2>
              <h2 className="font-bold text-lg text-gray-800 mr-0">
                تاریخ ثبت گزارش: {formatDate(report.createdAt)}
              </h2>
              <h4 className="font-bold text-sm text-gray-800">{report.user.username}</h4>
            </section>
          </section>

          <p className="text-[#000000] m-4">
            {report.description}
          </p>

          <p className="text-[#000000] text-2xl font-bold m-4">
            {report.city}, {report.approximatePosition}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="col-span-12 text-center flex justify-center gap-4 mt-6">
          <button
            onClick={() => {
              setIsReporting(false);
              setPosition(null);
              setIsVisible(true);
            }}
            className="bg-[#f89b2f] text-white px-6 py-2 rounded-full shadow-md hover:bg-[#e38821] transition"
          >
            بازگشت به نقشه
          </button>

          <button
            onClick={() => {
              setIsReporting(false);
              setPosition(null);
              setIsVisible(true);
            }}
            className="bg-transparent border-0 p-0"
          >
            <Image
              src="/images/icons/X.png"
              alt="بستن"
              width={40}
              height={40}
              className="w-10 h-10"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SolvedProblemForm;
