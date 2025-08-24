'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { connectSocket } from '@/lib/socket';
import { AlertType } from '@/components/Alert';

export interface Notification {
  _id: string;
  user: string;
  title: string;
  message: string;
  type: 'info' | 'alert';
  read: boolean;
  createdAt: Date;
}

export const mapNotificationType = (type: 'info' | 'alert'): AlertType => {
  switch (type) {
    case 'info': return 'success';
    case 'alert': return 'error';
    default: return 'success';
  }
};

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('token');
      setToken(newToken);
    };

    window.addEventListener('storage', handleStorageChange);

    window.addEventListener('login', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('login', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!token) return;

    const socket = connectSocket(token);

    socket.on('notification', (data: any) => {
      if (data && typeof data === 'object') {
        addNotification({
          _id: data._id || Math.random().toString(36),
          user: data.user,
          title: data.title,
          message: data.message,
          type: data.type || 'info',
          read: false,
          createdAt: new Date(),
        });
      } else {
        addNotification({
          _id: Math.random().toString(36),
          user: '',
          title: 'Notification',
          message: typeof data === 'string' ? data : JSON.stringify(data),
          type: 'info',
          read: false,
          createdAt: new Date(),
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif._id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif._id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
