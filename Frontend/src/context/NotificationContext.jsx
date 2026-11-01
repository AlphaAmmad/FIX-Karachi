import React, { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../api/client';
import { endpoints } from '../api/endpoints';
import { useAuth } from './AuthContext';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const socketRef = useRef(null);

  // Fetch notifications from API
  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    setLoading(true);
    try {
      const [itemsResponse, countResponse] = await Promise.all([
        api.get(endpoints.notifications.all),
        api.get(endpoints.notifications.unreadCount),
      ]);
      setNotifications(itemsResponse.data?.data || itemsResponse.data || []);
      setUnreadCount(countResponse.data?.data?.count ?? countResponse.data?.count ?? 0);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Connect to Socket.IO when authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      // Disconnect if logged out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const token = localStorage.getItem('fixkarachi_token');
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('[Socket.IO] Connected:', socket.id);

      // Join user-specific and role-specific rooms
      if (user.role === 'citizen' && user.id) {
        socket.emit('join-room', { role: 'citizen', key: user.id });
      }
      if (user.role === 'authority' && user.organization) {
        socket.emit('join-room', { role: 'authority', key: user.organization });
      }
      if (user.role === 'admin') {
        socket.emit('join-room', { role: 'admin', key: 'global' });
      }
    });

    // Listen for new notifications
    socket.on('notification:new', (notification) => {
      console.log('[Socket.IO] New notification:', notification);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Show toast
      setToast({ title: notification.title, message: notification.message });
      setTimeout(() => setToast(null), 5000);
    });

    // Listen for broadcasts
    socket.on('notification:broadcast', (notification) => {
      console.log('[Socket.IO] Broadcast:', notification);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      setToast({ title: notification.title, message: notification.message });
      setTimeout(() => setToast(null), 5000);
    });

    // Listen for complaint status updates
    socket.on('complaint:updated', (data) => {
      console.log('[Socket.IO] Complaint updated:', data);
      setToast({ title: 'Complaint Updated', message: data.message || 'A complaint status has changed.' });
      setTimeout(() => setToast(null), 5000);
      refresh();
    });

    socket.on('disconnect', () => {
      console.log('[Socket.IO] Disconnected');
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, user?.id, user?.role]);

  // Initial fetch
  useEffect(() => {
    refresh();
  }, [refresh]);

  const markAsRead = async (id) => {
    await api.patch(endpoints.notifications.read(id));
    await refresh();
  };

  const dismissToast = () => setToast(null);

  const value = useMemo(
    () => ({ notifications, unreadCount, loading, refresh, markAsRead, toast, dismissToast }),
    [notifications, unreadCount, loading, toast]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Real-time toast notification */}
      {toast && <NotificationToast toast={toast} onDismiss={dismissToast} />}
    </NotificationContext.Provider>
  );
};

/* Floating toast component for real-time notifications */
const NotificationToast = ({ toast, onDismiss }) => (
  <div
    className="fixed bottom-6 right-6 z-50 animate-slide-up"
    style={{ animation: 'slideUp 0.3s ease-out' }}
  >
    <div className="flex max-w-sm items-start gap-3 rounded-2xl border border-brand-200 bg-white p-4 shadow-lg">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-lg">
        🔔
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-ink">{toast.title}</p>
        <p className="mt-0.5 text-xs text-slate-600">{toast.message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-slate-400 transition hover:text-slate-600"
      >
        ✕
      </button>
    </div>
  </div>
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};