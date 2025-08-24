'use client';

import { useNotifications } from '@/context/NotificationContext';
import { Icon } from '@/components/Icon';
import { mapNotificationType } from '@/context/NotificationContext';

interface NotificationDropdownProps {
  onClose: () => void;
}

export const NotificationDropdown = ({ onClose }: NotificationDropdownProps) => {
  const { notifications, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications();

  const getIconName = (type: 'info' | 'alert'): string => {
    const alertType = mapNotificationType(type);
    switch (alertType) {
      case 'success': return 'CircleCheck';
      case 'error': return 'TriangleAlert';
      case 'loading': return 'LoaderCircle';
      default: return 'Info';
    }
  };

  const getIconColor = (type: 'info' | 'alert'): string => {
    const alertType = mapNotificationType(type);
    switch (alertType) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'loading': return 'text-amber-900 animate-spin';
      default: return 'text-amber-900';
    }
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-amber-50 rounded-lg shadow-lg border border-amber-200 z-50" dir="rtl">
      <div className="p-3 border-b border-amber-200 flex justify-between items-center">
        <h3 className="font-semibold text-amber-900">اعلان‌ها</h3>
        <div className="flex space-x-2">
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-amber-800 hover:text-amber-900"
            >
              نشانه گذاری همه به عنوان خوانده شده
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-red-600 hover:text-red-800"
            >
              پاک کردن همه
            </button>
          )}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-amber-800">
            هیچ اعلانی وجود ندارد
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification._id}
              className={`p-3 border-b border-amber-100 hover:bg-amber-100 ${
                !notification.read ? 'bg-amber-100' : ''
              }`}
            >
              <div className="flex items-start space-x-2">
                <Icon
                  name={getIconName(notification.type) as any}
                  className={`text-lg ${getIconColor(notification.type)}`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900">{notification.title}</p>
                  <p className="text-sm text-amber-800 mt-1">{notification.message}</p>
                  <p className="text-xs text-amber-700 mt-1">
                    {new Date(notification.createdAt).toLocaleTimeString('fa-IR')}
                  </p>
                </div>
                <div className="flex space-x-1">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="text-xs text-amber-800 hover:text-amber-900"
                      aria-label="علامت‌گذاری jako خوانده شده"
                    >
                      <Icon name="Check" className="text-sm" />
                    </button>
                  )}
                  <button
                    onClick={() => removeNotification(notification._id)}
                    className="text-xs text-red-600 hover:text-red-800"
                    aria-label="حذف اعلان"
                  >
                    <Icon name="X" className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-2 border-t border-amber-200 text-center">
          <button
            onClick={onClose}
            className="text-sm text-amber-800 hover:text-amber-900"
          >
            بستن
          </button>
        </div>
      )}
    </div>
  );
};
