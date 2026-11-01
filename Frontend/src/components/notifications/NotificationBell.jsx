import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';

export const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button className="btn-secondary relative px-3 py-2" onClick={() => setOpen((value) => !value)}>
        Notifications
        {unreadCount > 0 ? <span className="absolute -right-1 -top-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-white">{unreadCount}</span> : null}
      </button>
      {open ? (
        <div className="absolute right-0 z-30 mt-3 w-80 rounded-3xl border border-slate-200 bg-white p-3 shadow-soft">
          <div className="max-h-80 space-y-2 overflow-auto">
            {notifications.length ? notifications.map((item) => (
              <button key={item.id} onClick={() => markAsRead(item.id)} className="w-full rounded-2xl border border-slate-100 p-3 text-left hover:bg-slate-50">
                <p className="text-sm font-semibold text-ink">{item.title}</p>
                <p className="mt-1 text-xs text-slate-500">{item.message}</p>
              </button>
            )) : <p className="p-3 text-sm text-slate-500">No notifications yet.</p>}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NotificationBell;