"use client";

import { useState, useRef, useEffect } from 'react';

import UserAvatar from '@/components/UserAvatar';
import FormField from './FormField';
import { Alert, AlertProps } from '@/components/Alert';

interface Profile {
  username: string;
  phone: string;
  first_name: string;
  last_name: string;
  email: string;
  photo: string | null;
}

interface ProfileFormProps {
  initialProfile: Profile;
}

export default function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem('role'));
  }, []);

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
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
    setIsProfileLoading(true);

    try {
      const token = localStorage.getItem('token');

      const endpoint = role === 'admin'
        ? 'https://shahriar.thetechverse.ir:3000/api/v1/admin/update-profile'
        : 'https://shahriar.thetechverse.ir:3000/api/v1/user-profile/update-profile';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: profile.first_name,
          lastName: profile.last_name,
          username: profile.username,
          email: profile.email
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'خطا در بروزرسانی پروفایل');
      }

      setAlert({
        message: "پروفایل با موفقیت بروزرسانی شد!",
        type: "success",
        duration: 3000,
        onClose: () => setAlert(null)
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setAlert({
        message: error.message || "خطا در بروزرسانی پروفایل!",
        type: "error",
        duration: 3000,
        onClose: () => setAlert(null)
      });
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleSubmitPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setAlert({
        message: "لطفا یک عکس انتخاب کنید!",
        type: "error",
        duration: 3000,
        onClose: () => setAlert(null)
      });
      return;
    }

    setIsPhotoLoading(true);

    try {
      const formData = new FormData();
      formData.append('profileImage', selectedFile);

      const token = localStorage.getItem('token');

      const endpoint = role === 'admin'
        ? 'https://shahriar.thetechverse.ir:3000/api/v1/admin/update-profile-image'
        : 'https://shahriar.thetechverse.ir:3000/api/v1/user-profile/update-profile-image';

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'خطا در بروزرسانی عکس پروفایل');
      }

      const newPhotoUrl = data.photoUrl || previewUrl;
      setProfile((prev) => ({
        ...prev,
        photo: newPhotoUrl,
      }));
      setAlert({
        message: "عکس پروفایل با موفقیت بروزرسانی شد!",
        type: "success",
        duration: 3000,
        onClose: () => setAlert(null)
      });
      setSelectedFile(null);
    } catch (error: any) {
      console.error("Error uploading image:", error);
      setAlert({
        message: error.message || "خطا در بروزرسانی عکس پروفایل",
        type: "error",
        duration: 3000,
        onClose: () => setAlert(null)
      });
    } finally {
      setIsPhotoLoading(false);
    }
  };

  const getPhotoSource = () => {
    if (previewUrl) return previewUrl;
    if (!profile.photo) return '/images/avatars/default-profile.png';
    if (profile.photo.startsWith('data:image') || profile.photo.startsWith('http')) {
      return profile.photo;
    }

    const basePath = role === 'admin'
      ? 'https://shahriar.thetechverse.ir:3000/uploads/admins/'
      : 'https://shahriar.thetechverse.ir:3000/uploads/users/';
    return basePath + profile.photo;
  };

  return (
    <div className="flex flex-col gap-6">
      {alert && <Alert {...alert} />}
      <div className="flex flex-col md:flex-row md:flex-row-reverse gap-6">
        {/* Profile Picture */}
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
          <button
            type="button"
            onClick={handleImageClick}
            className="cursor-pointer mb-4"
            aria-label="Change profile picture"
          >
            <UserAvatar
              picture={getPhotoSource()}
              username={profile.username}
              width={120}
              height={120}
              className="border-2 border-gray-200 rounded-full"
            />
          </button>
          <button
            type="submit"
            className="bg-accent text-white py-2 px-4 rounded-lg hover:text-black transition-colors duration-300 mt-auto"
            disabled={!selectedFile || isPhotoLoading}
          >
            {isPhotoLoading ? 'در حال بارگذاری...' : 'بارگذاری عکس'}
          </button>
        </form>

        {/* Username and Phone */}
        <div className="flex-1 flex-col space-y-4">
          <FormField
            dir="ltr"
            label={role === "admin" ? "نام ادمین" : "نام کاربری" }
            id="username"
            name="username"
            value={profile.username}
            onChange={handleProfileChange}
            required
          />
          <FormField
            dir="ltr"
            label="شماره تلفن"
            id="phone"
            name="phone"
            value={profile.phone}
            onChange={handleProfileChange}
            disabled
          />
        </div>
      </div>

      {/* Name and Email */}
      <form onSubmit={handleSubmitProfile} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="نام"
            id="first_name"
            name="first_name"
            value={profile.first_name}
            onChange={handleProfileChange}
            required
          />
          <FormField
            label="نام خانوادگی"
            id="last_name"
            name="last_name"
            value={profile.last_name}
            onChange={handleProfileChange}
            required
          />
        </div>

        <div className="col-span-2">
          <FormField
            dir="ltr"
            label="ایمیل"
            id="email"
            name="email"
            type="email"
            value={profile.email}
            onChange={handleProfileChange}
            required
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className={`w-full bg-accent text-white font-medium py-3 px-4 rounded-lg hover:text-black transition-colors duration-300 ${
              isProfileLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isProfileLoading}
          >
            {isProfileLoading ? 'در حال بروزرسانی...' : 'ایجاد تغییرات'}
          </button>
        </div>
      </form>
    </div>
  );
}
