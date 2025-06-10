"use client";

import { useState } from "react";
import Image from "next/image";
import StarRating from "@/components/StarRating";
import { Alert, AlertProps } from "@/components/Alert";

export default function LeaveReview() {
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [review, setReview] = useState({
    rating: 4.5,
    comment: "",
  });

  const handleReviewChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating: number) => {
    setReview((prev) => ({ ...prev, rating }));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      return setAlert({
        type: "error",
        message: "لطفاً ابتدا وارد حساب کاربری شوید.",
        duration: 3000,
        onClose: () => setAlert(null),
      });
    }

    try {
      // 1) Post the comment
      const commentRes = await fetch(
        "https://shahriar.thetechverse.ir:3000/api/v1/comment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: review.comment.trim() }),
        }
      );

      const commentData = await commentRes.json();
      if (!commentRes.ok) {
        throw new Error(commentData.message || "خطا در ارسال نظر");
      }
      const commentId = commentData._id;

      // 2) Post the rating
      const ratingRes = await fetch(
        `https://shahriar.thetechverse.ir:3000/api/v1/comment/${commentId}/rate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ score: review.rating }),
        }
      );

      const ratingData = await ratingRes.json();
      if (!ratingRes.ok) {
        throw new Error(ratingData.message || "خطا در ارسال امتیاز");
      }

      // Success
      setReview({ comment: "", rating: 4.5 });
      setAlert({
        type: "success",
        message: "نظر و امتیاز شما با موفقیت ارسال شد!",
        duration: 3000,
        onClose: () => setAlert(null),
      });
    } catch (err: any) {
      console.error("Submit failed:", err);
      setAlert({
        type: "error",
        message: err.message || "مشکلی پیش آمد، مجدداً تلاش کنید.",
        duration: 3000,
        onClose: () => setAlert(null),
      });
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 pt-20 py-4">
      {alert && <Alert {...alert} />}
      <div className="w-full max-w-2xl mx-4">
        <div className="bg-light rounded-2xl shadow-md p-6">
          <h1 className="text-xl font-bold mb-6 text-dark">
            پیشنهاد و نظر من
          </h1>
          <div className="flex flex-col items-center text-center mb-6">
            <Image
              src="/images/icons/comment.png"
              height={160}
              width={160}
              alt="Review Picture"
              className="mb-4"
            />
            <h2 className="text-lg font-semibold text-gray-800">
              به ما بازخورد بدهید!
            </h2>
            <p className="text-gray-600 mt-2 text-justify">
              بازخورد شما به ما کمک می‌کند تا بهبود پیدا کنیم، از زمانی که برای
              ارسال بازخورد صرف کرده‌اید، قدردانیم.
            </p>
          </div>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <textarea
              id="review-comment"
              name="comment"
              rows={4}
              placeholder="پیشنهاد و نظرت رو اینجا بنویس ..."
              value={review.comment}
              onChange={handleReviewChange}
              required
              className="w-full p-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
            />
            <div className="flex justify-center">
              <StarRating
                rating={review.rating}
                setRating={handleRatingChange}
                interactive={true}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-accent text-white py-3 px-4 rounded-lg hover:bg-accent-dark transition-colors font-medium"
            >
              ثبت بازخورد
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
