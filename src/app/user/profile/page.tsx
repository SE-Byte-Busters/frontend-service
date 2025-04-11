"use client";

import { useState, useRef } from 'react';
import Image from "next/image";


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
    <div className="bg-white shadow rounded-lg p-6">

      <h1>مشخصات پروفایل کاربری من</h1>

      {/* Profile Picture */}
      <div>
        <form onSubmit={handleSubmitPhoto}>
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
            className="cursor-pointer"
          >
            <Image
              src={previewUrl || profile.photo || "/default-profile.png"}
              height={64}
              width={64}
              alt="Profile Picture"
              className="bg-white rounded-full border border-gray-300 h-16 w-16 object-cover"
            />
          </div>
          <button type="submit">
            بارگذاری عکس
          </button>
        </form>
      </div>

      <form onSubmit={handleSubmitProfile}>
        {/* Username */}
        <div>
          <label htmlFor="username">
            نام کاربری
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={profile.username}
            onChange={handleProfileChange}
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone">
            شماره تلفن
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={profile.phone}
            onChange={handleProfileChange}
            disabled
          />
        </div>

        {/* First Name */}
        <div>
          <label htmlFor="first_name">
            نام
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={profile.first_name}
            onChange={handleProfileChange}
            required
          />
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="last_name">
            نام خانوادگی
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={profile.last_name}
            onChange={handleProfileChange}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email">
            ایمیل
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
            required
          />
        </div>

        {/* Submit */}
        <div>
          <button type="submit">
            ایجاد تغییرات
          </button>
        </div>
      </form>
    </div>
  );
}

const PasswordSection = () => {
  return (
    <div>
      <p>Password</p>
    </div>
  );
}

const ReviewSection = () => {
  return (
    <div>
      <p>Review</p>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <div className="min-h-screen bg-light">
          <div className="flex flex-col md:flex-row pt-24">
            <InfoSection />
            <PasswordSection />
            <ReviewSection />
          </div>
      </div>
    </div>
  );
}
