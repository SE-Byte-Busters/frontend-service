
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useReport } from '@/context/ReportContext';

// --- TYPE DEFINITIONS (Unchanged) ---
interface User {
  _id: string;
  username: string;
}

interface Comment {
  _id: string;
  user: User;
  userName: string;
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
  votes: Array<{ direction: 'Up' | 'Down' }>; // Specified direction for calculation
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
  // --- STATE AND CONTEXT (Unchanged) ---
  const [report, setReport] = useState<Report | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [solveRequests, setSolveRequests] = useState<SolveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newComment, setNewComment] = useState('');
  const [newRepReqSolve, setNewRepReqSolve] = useState('');

  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSolveRequest, setIsSolveRequest] = useState(false);

  const [showSolveRequest, setShowSolveRequest] = useState(true);


  const { setAlert } = useReport();

  // --- API AND HELPER FUNCTIONS (Unchanged) ---
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // This map object remains the same
  const categoryIconMap: any = {
    failure: { src: "/images/icons/category/tools.svg", alt: "tools" },
    lightbulb: { src: "/images/icons/category/lightbulb.svg", alt: "lightbulb" },
    unsafe: { src: "/images/icons/category/barrier.svg", alt: "barrier" },
    trash: { src: "/images/icons/category/trash.svg", alt: "trash" },
    smog: { src: "/images/icons/category/smog.svg", alt: "smog" },
    leaf: { src: "/images/icons/category/leaf.svg", alt: "leaf" },
  };


  const fetchReportDetails = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      const response = await fetch(
        `https://shahriar.thetechverse.ir:3000/api/v1/report/reports/${id}/`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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

  const fetchComments = async (id: string) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `https://shahriar.thetechverse.ir:3000/api/v1/report/reports/${id}/comments`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setComments(data.comments || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };
  const handleReportReqSolve = async () => {

    if (!newRepReqSolve.trim() || !reportId) return;
    try {
      setIsSolveRequest(true);
      setShowSolveRequest(true);

      const token = getAuthToken();
      const response = await fetch(

        `https://shahriar.thetechverse.ir:3000/api/v1/report/reports/${reportId}/reqsolved`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ text: newRepReqSolve }),
        }

      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setNewRepReqSolve('');

      setAlert({ type: 'success', message: 'گزارش حل مشکل با موفقیت ثبت شد' });
      setTimeout(() => {
        setAlert(null)
      }, 3000)

    } catch (err) {

      setAlert({ type: 'error', message: 'خطا در ثبت گزارش حل مشکل' });
      setTimeout(() => {
        setAlert(null)
      }, 3000)

      console.error('Error submitting comment:', err);

    } finally {
      setIsSolveRequest(false);
    }

  }
  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !reportId) return;
    setIsSubmittingComment(true);
    try {
      const token = getAuthToken();
      const response = await fetch(
        `https://shahriar.thetechverse.ir:3000/api/v1/report/reports/${reportId}/comments`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ text: newComment }),
        }
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setNewComment('');
      await fetchComments(reportId);
      setAlert({ type: 'success', message: 'نظر با موفقیت ثبت شد' });
      setTimeout(() => {
        setAlert(null)
      }, 3000)
    } catch (err) {
      setAlert({ type: 'error', message: 'خطا در ثبت نظر' });
      setTimeout(() => {
        setAlert(null)
      }, 3000)
      console.error('Error submitting comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleVote = async (direction: 'Up' | 'Down') => {
    if (!reportId) return;
    try {
      const token = getAuthToken();
      const response = await fetch(
        `https://shahriar.thetechverse.ir:3000/api/v1/report/reports/${reportId}/vote`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ direction }),
        }
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      // Refetch report details to get the latest vote count and score
      await fetchReportDetails(reportId);
      setAlert({ type: 'success', message: `رای ${direction === 'Up' ? 'مثبت' : 'منفی'} شما ثبت شد` });
      setTimeout(() => {
        setAlert(null)
      }, 3000)
    } catch (err) {
      setAlert({ type: 'error', message: 'خطا در ثبت رای' });
      setTimeout(() => {
        setAlert(null)
      }, 3000)
      console.error('Error voting:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // --- USE EFFECT (Unchanged) ---
  useEffect(() => {
    if (reportId) {
      fetchReportDetails(reportId);
    }
  }, [reportId]);

  // --- UI STATE AND LOGIC ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageUrls = report?.images.map(img => img.url) || [];

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % (imageUrls.length || 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + (imageUrls.length || 1)) % (imageUrls.length || 1));

  // Vote calculation
  const totalVotes = report?.votes?.length || 0;
  const positiveVotes = report?.votes?.filter(v => v.direction === 'Up').length || 0;
  const positivePercent = totalVotes > 0 ? (positiveVotes / totalVotes) * 100 : 0;
  const negativePercent = 100 - positivePercent;

  // Dynamic priority icon
  const getPriorityIcon = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return "/images/icons/priorityHight.png";
      case 'medium': return "/images/icons/priorityMiddle.png";
      case 'low': return "/images/icons/priorityLow.png";
      default: return "/images/icons/priorityMiddle.png";
    }
  }

  // --- LOADING AND ERROR STATES ---
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
        <p className="text-red-600">خطا: {error}</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#fff9f5]">
        <p className="text-[#685752]">گزارش یافت نشد.</p>
      </div>
    );
  }


  // --- DYNAMIC UI RENDER ---
  return (
    <div dir="rtl" className="grid grid-cols-12 gap-6 p-6 bg-[#fff5f3] rounded-xl shadow-sm min-h-screen">
      {/* بخش اطلاعات و کامنت‌ها */}
      <div className="col-span-12 md:col-span-7 flex flex-col items-center">
        <div className="flex justify-between items-start">
          <div>
            <Image src={getPriorityIcon(report.priority)} alt={`Priority: ${report.priority}`} className="m-[10px]" width={200} height={200} />
            <p className="text-center text-xl text-[#000000] font-vazirmatn max-w-[80%] mx-auto">
              منتظر اقدام یکی از شهریارها هستیم
              تو هم می‌تونی اولین گام رو برداری...
            </p>

          </div>

          <Image src="/images/icons/unSolved.png" alt="Unsolved" width={80} height={40} />
        </div>


        <button
          onClick={() => { setIsSolveRequest(true); setShowSolveRequest(false); }}
          className={`w-[251px] h-[56px] bg-[#8EB486] rounded-[10px] mt-12 mb-12 active:brightness-90 ${!showSolveRequest ? 'hidden' : ''}`}>
          <span className="font-bold text-[18px] text-[#fff] font-vazirmatn ">
            گزارش حل مشکل
          </span>
        </button>


        <div className={`flex-grow ${!showSolveRequest ? 'mt-12' : ''}`}>
          <label className="font-bold text-[24px] text-[#685752] font-vazirmatn m-[10px]">{isSolveRequest ? 'گزارش حل مشکل' : 'نظرات و پیشنهادات'}</label>
          <textarea
            className="w-[90%] border border-[#685752] p-3 m-2 rounded-[30px] text-[#685752]"
            placeholder={isSolveRequest ? ' لطفا گزارش حل مشکل خود را بنویسید' : "مثلا: ترک عمیق به‌وجود آمده و ترس ریزش پل وجود دارد."}
            rows={4}
            value={isSolveRequest ? newRepReqSolve : newComment}
            onChange={(e) => isSolveRequest ? setNewRepReqSolve(e.target.value) : setNewComment(e.target.value)}
          />
          <div className="flex justify-center">
            <button
              onClick={isSolveRequest ? handleReportReqSolve : handleCommentSubmit}
              disabled={isSolveRequest ? (!isSolveRequest || !newRepReqSolve.trim()) : (isSubmittingComment || !newComment.trim())}
              className="bg-[#f89b2f] text-white px-6 py-2 rounded-full m-2 hover:bg-[#e38821] transition disabled:opacity-50"
            >
              {isSolveRequest ? 'ثبت حل مشکل' : 'ثبت نظر'}
            </button>
            <button
              onClick={() => {
                setShowSolveRequest(true);
                setIsSolveRequest(false);
              }}
              className={`bg-transparent ${showSolveRequest ? 'hidden' : ''}`}
            >
              <Image
                src="/images/icons/X.png"
                alt="Background Image"
                width={64}
                height={64}
                className="w-10 h-10"
              />
            </button>
          </div>

          <div className='mt-4 w-[90%] mx-auto'>
            {comments.length > 0 ? comments.map(comment => (
              <div key={comment._id} className="flex border-b border-[#685752] pb-6 pt-4 m-2">
                <span className="font-bold text-[20px] text-[#685752] font-vazirmatn ml-8 w-1/3">
                  {comment.userName}
                </span>
                <span className="font-normal text-[20px] text-[#685752] font-vazirmatn w-2/3">
                  {comment.text}
                </span>
              </div>
            )) : (
              <p className='text-center text-[#685752] font-vazirmatn py-4'>هنوز نظری ثبت نشده است.</p>
            )}
          </div>
        </div>
      </div>

      {/* بخش تصویر و رأی‌دهی */}
      <div className="col-span-12 md:col-span-5 space-y-3">
        <div className="relative w-80 h-80 overflow-hidden rounded-xl mx-auto">
          {imageUrls.length > 0 ? (
            <>
              <Image src={imageUrls[currentIndex]}
                className="object-cover w-full h-full"
                alt="report image" layout="fill" />

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
                {imageUrls.map((_, idx) => (
                  <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentIndex ? "bg-green-400" : "bg-gray-300"}`} />
                ))}
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[#685752]">
              بدون تصویر
            </div>
          )}
        </div>
        <div className="w-full space-y-2"> {/* Increased space-y for better spacing */}
          {/* Removed fixed height (h-18) and overflow-hidden to let content define size */}
          {/* Increased font size from text-sm to text-xl */}
          <div className="flex items-center justify-center w-full text-xl font-bold mt-[30px]">

            <button onClick={() => handleVote('Up')} className="pl-2 border-0 bg-transparent">
              {/* Increased button image size for balance */}
              <Image src="/images/icons/like.png" alt="like" width={110} height={130} />
            </button>

            {/* Increased bar height from h-25 (which was likely a typo) to a larger h-12 */}
            <div className="flex w-full h-9 rounded-full border border-gray-200 shadow-sm overflow-hidden">
              <div
                className="bg-green-200 text-green-600 flex items-center justify-center"
                style={{ width: `${positivePercent}%` }}
              >
                {/* The text inside now uses the parent's text-xl class */}
                {Math.round(positivePercent) != 0 ? Math.round(positivePercent) + "%" : ""}
              </div>
              <div
                className="bg-red-200 text-red-600 flex items-center justify-center"
                style={{ width: `${negativePercent}%` }}
              >
                {Math.round(negativePercent) != 0 ? Math.round(negativePercent) + "%" : ""}
              </div>
            </div>

            <button onClick={() => handleVote('Down')} className="pr-2 border-0 bg-transparent">
              {/* Increased button image size for balance */}
              <Image src="/images/icons/dislike.png" alt="dislike" width={110} height={130} />
            </button>
          </div>
          {/* Increased font size for better readability */}
          <p className="text-center text-sm text-gray-700">{totalVotes} نفر رای داده‌اند</p>
        </div>

        <section className="flex justify-between items-center gap-0 mt-10">
          <Image src="/images/icons/profile.png" alt="profile" width={80} height={40} />
          <section className='text-right'>
            <h2 className="font-bold text-xl text-gray-800">{report.title}</h2>
            <h2 className="font-bold text-lg text-gray-800">تاریخ ثبت: {formatDate(report.createdAt)}</h2>
            <h4 className="font-bold text-sm text-gray-800">گزارشگر: {report.user?.username}</h4>
          </section>
        </section>

        <p className="text-[#000000] m-4 text-right">
          {report.description}
        </p>

        <p className="text-[#000000] text-2xl font-bold m-4 text-right">{report.approximatePosition}</p>
        <div className="flex items-center gap-2 absolute bottom-10">
          {
            // Make sure report and its category array exist before mapping
            report?.category?.map(categoryName => {
              if (typeof categoryName !== "string") {
                return <></>;
              }
              const iconData = categoryIconMap[categoryName];
              if (iconData) {
                return (
                  <Image
                    key={categoryName}
                    src={iconData.src}
                    alt={iconData.alt}
                    width={56}
                    height={54}
                  />
                );
              }
              return null;
            })
              .filter(Boolean) // This is a clever way to remove nulls, but not needed if you map directly
          }
        </div>
      </div>
    </div >
  );
};

export default UnSolvedProblemForm;