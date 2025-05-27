"use client";

import { useState } from 'react';

import FormField from './FormField';
import { Alert, AlertProps } from '@/components/Alert';

export default function PasswordSection() {
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertProps | null>(null);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassword(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.new !== password.confirm) {
      setAlert({
        message: "رمز عبور جدید با تکرار آن مطابقت ندارد!",
        type: "error",
        duration: 3000,
        onClose: () => setAlert(null)
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('role');

      const endpoint = userRole === 'admin'
        ? 'https://shahriar.thetechverse.ir:3000/api/v1/admin/update-password'
        : 'https://shahriar.thetechverse.ir:3000/api/v1/user-profile/update-password';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: password.current,
          newPassword: password.new
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'خطا در تغییر رمز عبور');
      }

      setAlert({
        message: 'رمز عبور با موفقیت تغییر یافت!',
        type: "success",
        duration: 3000,
        onClose: () => setAlert(null)
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      setAlert({
        message: error.message || 'خطا در تغییر رمز عبور! لطفا مجددا تلاش نمایید.',
        type: "error",
        duration: 3000,
        onClose: () => setAlert(null)
      });
    } finally {
      setPassword({ current: '', new: '', confirm: '' });
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-light rounded-2xl shadow-md p-6">
      {alert && <Alert {...alert} />}

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
            disabled={isLoading}
            className={`w-full bg-accent text-white font-medium py-3 px-4 rounded-lg hover:text-black transition-colors duration-300 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'در حال تغییر...' : 'تغییر رمز عبور'}
          </button>
        </div>
      </form>
    </section>
  );
}
