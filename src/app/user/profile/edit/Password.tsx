"use client";

import { useState } from 'react';

import FormField from './FormField';

export default function PasswordSection() {
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
      // TODO: replace with API call
      setPassword({ current: '', new: '', confirm: '' });
      alert('Password changed successfully!');
    } catch (error) {
      setPassword({ current: '', new: '', confirm: '' });
      alert('Failed to change password!');
    }
  };

  return (
    <section className="bg-light rounded-2xl shadow-md p-6">
      <h1 className="text-xl font-bold text-dark">
        تغییر رمز عبور من
      </h1>

      <form onSubmit={handleSubmitPassword} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            label="رمز عبور فعلی"
            id="current-password"
            name="current"
            type="password"
            value={password.current}
            onChange={handlePasswordChange}
            required
            dir="ltr"
          />

          <FormField
            label="رمز عبور جدید"
            id="new-password"
            name="new"
            type="password"
            value={password.new}
            onChange={handlePasswordChange}
            required
            dir="ltr"
          />

          <FormField
            label="تکرار رمز عبور جدید"
            id="confirm-password"
            name="confirm"
            type="password"
            value={password.confirm}
            onChange={handlePasswordChange}
            required
            dir="ltr"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-accent text-white font-medium py-3 px-4 rounded-lg hover:text-black transition-colors duration-300"
          >
            تغییر رمز عبور
          </button>
        </div>
      </form>
    </section>
  );
}
