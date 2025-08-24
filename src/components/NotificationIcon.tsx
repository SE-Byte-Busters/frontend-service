'use client';

import { useNotifications } from '@/context/NotificationContext';
import { Icon } from '@/components/Icon';
import { NotificationDropdown } from './NotificationDropdown';
import { useState, useEffect } from 'react';

export const NotificationIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.notification-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="notification-container relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-amber-50 relative transition-colors"
        aria-label="اعلان‌ها"
      >
        <Icon name="Bell" className="text-2xl text-amber-900 transition-colors duration-300 hover:text-amber-800 active:text-amber-800" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '۹+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && <NotificationDropdown onClose={() => setIsOpen(false)} />}
    </div>
  );
};
