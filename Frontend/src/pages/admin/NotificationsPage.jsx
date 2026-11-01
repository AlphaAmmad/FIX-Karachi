import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get(endpoints.notifications.all).then(({ data }) => {
      setNotifications(data?.data || data || []);
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-600">Notifications</p>
        <h1 className="mt-2 section-title">Admin notifications</h1>
      </div>
      {notifications.length === 0 ? (
        <div className="soft-card p-8 text-center"><p className="text-slate-500">No notifications.</p></div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div key={n.id} className={`soft-card p-5 ${!n.isRead ? 'border-l-4 border-brand-500' : ''}`}>
              <p className="font-semibold text-ink">{n.title}</p>
              <p className="mt-1 text-sm text-slate-600">{n.message}</p>
              <p className="mt-2 text-xs text-slate-400">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;