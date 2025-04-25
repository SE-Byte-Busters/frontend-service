"use client";

import { useState, useRef } from 'react';
import UserAvatar from '@/components/UserAvatar';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    try {
      // TODO: replace with API call
      console.log("Profile updated:", profile);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile!");
    }
  };

  const handleSubmitPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    try {
      // TODO: replace with API call
      setProfile((prev) => ({
        ...prev,
        photo: previewUrl || null,
      }));
      alert("Profile picture updated successfully!");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to update profile picture");
    }
  };

  return (
    <div className="flex flex-col gap-6">
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
              picture={previewUrl || profile.photo}
              username={profile.username}
              width={120}
              height={120}
              className="border-2 border-gray-200"
            />
          </button>
          <button
            type="submit"
            className="bg-accent text-white py-2 px-4 rounded-lg hover:text-black transition-colors duration-300 mt-auto"
            disabled={!selectedFile}
          >
            بارگذاری عکس
          </button>
        </form>

        {/* Username and Phone */}
        <div className="flex-1 flex-col space-y-4">
          <FormField
            dir="ltr"
            label="نام کاربری"
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
            className="w-full bg-accent text-white font-medium py-3 px-4 rounded-lg hover:text-black transition-colors duration-300"
          >
            ایجاد تغییرات
          </button>
        </div>
      </form>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dir?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}

function FormField({
  label,
  id,
  name,
  value,
  onChange,
  dir = "rtl",
  type = "text",
  required = false,
  disabled = false,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-lg font-medium text-dark">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        dir={dir}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full p-3 border border-gray-300 text-gray-700 rounded-full focus:ring-2 focus:ring-accent focus:border-accent outline-none transition ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        }`}
      />
    </div>
  );
}
