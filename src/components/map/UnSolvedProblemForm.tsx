import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useReport } from '@/context/ReportContext';

// Types for API responses
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


interface UnSolvedProblemFormProps {
  reportId?: string;
  onSubmit?: (data: any) => void;
  className?: string;
}

const UnSolvedProblemForm: React.FC<UnSolvedProblemFormProps> = ({
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
  const [solveRequestText, setSolveRequestText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSubmittingSolveRequest, setIsSubmittingSolveRequest] = useState(false);

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

  // API call to fetch solve requests
  const fetchSolveRequests = async (id: string) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `https://shahriar.thetechverse.ir:3000/api/v1/reports/${id}/reqsolved`,
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
      setSolveRequests(data.usersReqSovled || []);
    } catch (err) {
      console.error('Error fetching solve requests:', err);
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

  // Submit solve request
  const handleSolveRequestSubmit = async () => {
    if (!solveRequestText.trim() || !reportId) return;

    setIsSubmittingSolveRequest(true);
    try {
      const token = getAuthToken();
      const response = await fetch(
        `https://shahriar.thetechverse.ir:3000/api/v1/reports/${reportId}/reqsolved`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: solveRequestText
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSolveRequestText('');
      await fetchSolveRequests(reportId);
      setAlert({
        type: 'success',
        message: 'درخواست حل مشکل با موفقیت ثبت شد'
      });
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'خطا در ثبت درخواست حل مشکل'
      });
      console.error('Error submitting solve request:', err);
    } finally {
      setIsSubmittingSolveRequest(false);
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

  return (
    <div className={`${className} bg-[#fff9f5] min-h-screen`}>
      <div className="grid grid-cols-12 gap-6 w-full p-6">

        {/* Report Header */}
        <div className="col-span-12">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-[#685752]">{report.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm ${
                report.status === 0 ? 'bg-blue-100 text-blue-800' :
                report.status === 1 ? 'bg-yellow-100 text-yellow-800' :
                report.status === 2 ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {getStatusText(report.status)}
              </span>
            </div>

            <p className="text-[#685752] mb-4">{report.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <strong className="text-[#685752]">آدرس:</strong>
                <p className="text-[#87878B]">{report.approximatePosition}</p>
              </div>
              <div>
                <strong className="text-[#685752]">شهر:</strong>
                <p className="text-[#87878B]">{report.city}</p>
              </div>
              <div>
                <strong className="text-[#685752]">دسته‌بندی:</strong>
                <p className="text-[#87878B]">{report.category.join(', ')}</p>
              </div>
              <div>
                <strong className="text-[#685752]">اولویت:</strong>
                <p className="text-[#87878B]">{report.priority}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleVote('Up')}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  👍
                </button>
                <span className="text-[#685752]">{report.voteScore}</span>
                <button
                  onClick={() => handleVote('Down')}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  👎
                </button>
              </div>
              <div className="text-sm text-[#87878B]">
                گزارش‌دهنده: {report.user.username} |
                تاریخ: {formatDate(report.createdAt)}
              </div>
            </div>

            {/* Images */}
            {report.images && report.images.length > 0 && (
              <div className="mb-4">
                <strong className="text-[#685752] block mb-2">تصاویر:</strong>
                <div className="grid grid-cols-3 gap-4">
                  {report.images.map((image, index) => (
                    <img
                      key={image._id}
                      src={image.url}
                      alt={`تصویر ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="col-span-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold text-[#685752] mb-4">نظرات</h2>

            {/* Add Comment Form */}
            <div className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="نظر خود را بنویسید..."
                className="w-full border border-[#685752] p-3 rounded-lg text-[#685752] resize-none"
                rows={3}
              />
              <button
                onClick={handleCommentSubmit}
                disabled={isSubmittingComment || !newComment.trim()}
                className="mt-2 bg-[#f89b2f] text-white px-4 py-2 rounded-lg hover:bg-[#e38821] transition disabled:opacity-50"
              >
                {isSubmittingComment ? 'در حال ثبت...' : 'ثبت نظر'}
              </button>
            </div>

            {/* Comments List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-[#87878B] text-center">هنوز نظری ثبت نشده است</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="border border-[#e5e5e5] rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <strong className="text-[#685752]">{comment.user.username}</strong>
                      <span className="text-sm text-[#87878B]">
                        {formatDate(comment.date)}
                      </span>
                    </div>
                    <p className="text-[#685752]">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Solve Requests Section */}
        <div className="col-span-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold text-[#685752] mb-4">درخواست‌های حل مشکل</h2>

            {/* Add Solve Request Form */}
            <div className="mb-6">
              <textarea
                value={solveRequestText}
                onChange={(e) => setSolveRequestText(e.target.value)}
                placeholder="توضیح دهید که چگونه این مشکل را حل کرده‌اید..."
                className="w-full border border-[#685752] p-3 rounded-lg text-[#685752] resize-none"
                rows={3}
              />
              <button
                onClick={handleSolveRequestSubmit}
                disabled={isSubmittingSolveRequest || !solveRequestText.trim()}
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {isSubmittingSolveRequest ? 'در حال ثبت...' : 'ثبت درخواست حل'}
              </button>
            </div>

            {/* Solve Requests List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {solveRequests.length === 0 ? (
                <p className="text-[#87878B] text-center">هنوز درخواستی برای حل مشکل ثبت نشده است</p>
              ) : (
                solveRequests.map((request) => (
                  <div key={request._id} className="border border-green-200 bg-green-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <strong className="text-green-700">{request.user.username}</strong>
                      <span className="text-sm text-green-600">
                        {formatDate(request.date)}
                      </span>
                    </div>
                    <p className="text-green-800">{request.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="col-span-12 text-center flex justify-center gap-4">
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

export default UnSolvedProblemForm;
