"use client";

import { useState, useRef } from 'react';
import Image from "next/image";

import { StarRating } from "@/components/StarRating";


const InfoSection = () => {
  // get user info here
  const [profile, setProfile] = useState({
    username: "Alij",
    phone: "09123456789",
    first_name: "Ali",
    last_name: "Jan",
    email: "Alij@example.com",
    photo: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    // call backend here
    try {
      console.log("Profile updated:", profile);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error Updating profile:", error);
      alert("Failed to update profile!");
    }
  };

  const handleSubmitPhoto = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    // call backend here
    try {
      setProfile(prev => ({
        ...prev,
        photo: previewUrl || "/default-profile.png"
      }));

      alert("Profile picture updated successfully!");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to update profile picture");
    }
  };

  return (
    <div className="bg-light rounded-2xl shadow-md p-6 mb-6">
      <h1 className="text-xl font-bold mb-6 text-gray-800">مشخصات پروفایل کاربری من</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <form onSubmit={handleSubmitPhoto} className="flex flex-col items-center">
            <input
              type="file"
              id="photo"
              name="photo"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={handleImageClick}
              className="cursor-pointer mb-4"
            >
              <Image
                src={previewUrl || profile.photo || "/default-profile.png"}
                height={120}
                width={120}
                alt="Profile Picture"
                className="bg-white rounded-full border-2 border-gray-200 h-30 w-30 object-cover"
              />
            </div>
            <button
              type="submit"
              className="bg-accent text-white py-2 px-4 rounded-lg hover:bg-accent-dark transition-colors"
            >
              بارگذاری عکس
            </button>
          </form>
        </div>

        <form onSubmit={handleSubmitProfile} className="flex-1 space-y-4">
          {/* Username */}
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              نام کاربری
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={profile.username}
              onChange={handleProfileChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              شماره تلفن
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={profile.phone}
              onChange={handleProfileChange}
              disabled
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* First Name */}
          <div className="space-y-2">
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
              نام
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={profile.first_name}
              onChange={handleProfileChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
              نام خانوادگی
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={profile.last_name}
              onChange={handleProfileChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              ایمیل
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-accent text-white py-3 px-4 rounded-lg hover:bg-accent-dark transition-colors font-medium"
            >
              ایجاد تغییرات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const PasswordSection = () => {
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassword(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      alert("New password doesn't match!");
      return;
    }

    console.log('Password change requested:', password);
    try {
      // call backend here
      setPassword({ current: '', new: '', confirm: '' });
      alert('Password changed successfully!');
    } catch (error) {
      setPassword({ current: '', new: '', confirm: '' });
      alert('Failed to change password!');
    }
  };

  return (
    <div className="bg-light rounded-2xl shadow-md p-6 mb-6">
      <h1 className="text-xl font-bold mb-6 text-gray-800">تغییر رمز عبور من</h1>

      <form onSubmit={handleSubmitPassword} className="space-y-4">
        {/* Current Password */}
        <div className="space-y-2">
          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
            رمز عبور فعلی
          </label>
          <input
            type="password"
            id="current-password"
            name="current"
            placeholder="رمز عبور فعلی خود را وارد کنید"
            value={password.current}
            onChange={handlePasswordChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
          />
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
            رمز عبور جدید
          </label>
          <input
            type="password"
            id="new-password"
            name="new"
            placeholder="رمز عبور جدید خود را وارد کنید"
            value={password.new}
            onChange={handlePasswordChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
          />
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
            تکرار رمز عبور جدید
          </label>
          <input
            type="password"
            id="confirm-password"
            name="confirm"
            placeholder="رمز عبور جدید خود را مجدداً وارد کنید"
            value={password.confirm}
            onChange={handlePasswordChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-accent text-white py-3 px-4 rounded-lg hover:bg-accent-dark transition-colors font-medium"
          >
            تغییر رمز عبور
          </button>
        </div>
      </form>
    </div>
  );
}

const ReviewSection = () => {
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
      // call backend here
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
          src="/comment.png"
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
};

export default function Profile() {
  return (
    <div dir="rtl" className="min-h-screen bg-light/95 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <InfoSection />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <PasswordSection />
            <ReviewSection />
          </div>
        </div>
      </div>
    </div>
  );
}
