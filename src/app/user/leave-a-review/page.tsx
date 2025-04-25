"use client";

import { useState } from "react";
import Image from "next/image";

import StarRating from "@/components/StarRating";

export default function LeaveReview() {
  const [review, setReview] = useState({
    rating: 10,
    comment: '',
  });

  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReview(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating: number) => {
    setReview(prev => ({ ...prev, rating }));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Trying to send review:', review);
    try {
      // TODO: replace with API call
      console.log('Review submitted');
      setReview(prev => ({ ...prev, comment: '' }));
      alert('Thank you for your review!');
    } catch (error) {
      alert('Failed to send review!');
    }
  };

  return (
    <div className="bg-light rounded-2xl shadow-md p-6">
      <h1 className="text-xl font-bold mb-6 text-gray-800">پیشنهاد و نظر من</h1>
      <div className="flex flex-col items-center text-center mb-6">
        <Image
          src="/images/icons/comment.png"
          height={160}
          width={160}
          alt="Review Picture"
          className="mb-4"
        />
        <h2 className="text-lg font-semibold text-gray-800">به ما بازخورد بدهید!</h2>
        <p className="text-gray-600 mt-2">
          بازخورد شما به ما کمک می‌کند تا بهبود پیدا کنیم، از زمانی که برای ارسال بازخورد صرف کرده‌اید، قدر دانیم.
        </p>
      </div>
      <form onSubmit={handleSubmitReview} className="space-y-4">
        <div className="space-y-4">
          <textarea
            id="review-comment"
            name="comment"
            rows={4}
            placeholder="پیشنهاد و نظرت رو اینجا بنویس ..."
            value={review.comment}
            onChange={handleReviewChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
          />
          <div className="flex justify-center">
            <StarRating
              rating={review.rating}
              setRating={handleRatingChange}
              interactive={true}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-accent text-white py-3 px-4 rounded-lg hover:bg-accent-dark transition-colors font-medium"
        >
          ثبت بازخورد
        </button>
      </form>
    </div>
  );
}
