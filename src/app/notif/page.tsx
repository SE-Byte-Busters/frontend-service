'use client';

import { connectSocket } from '@/lib/socket';
import { useEffect, useState } from 'react';

export default function NotificationsPage() {
  const [socketConnected, setSocketConnected] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  useEffect(() => {
    if (!token) return;

    const socket = connectSocket(token);

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      setSocketConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setSocketConnected(false);
    });

    socket.on('notification', (data: any) => {
      console.log('📩 Notification received:', data);
      setNotifications((prev) => [...prev, JSON.stringify(data)]);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  return (
    <div style={{ padding: 20 }}>
      <h1>📨 Real-time Notifications</h1>
      <p>Status: {socketConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
      <ul>
        {notifications.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>
    </div>
  );
}
