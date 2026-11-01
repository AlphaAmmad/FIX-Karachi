import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { useNotifications } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';

const NotificationDrawer = ({ open, onClose }) => {
  const { notifications, markAsRead } = useNotifications();
  const { t } = useLanguage();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex bg-ink-950/40 backdrop-blur-sm transition-opacity duration-300">
      {/* Backdrop */}
      <button 
        className="flex-1 cursor-default" 
        onClick={onClose} 
        aria-label="Close notifications" 
      />

      {/* Drawer Panel */}
      <aside className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl flex flex-col animate-slide-up">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="font-display text-2xl font-bold text-ink-900">
            {t('notifications_badge')}
          </h2>
          <Button variant="soft" className="px-3.5 py-1.5 text-xs font-bold" onClick={onClose}>
            Close
          </Button>
        </div>

        {/* List */}
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {notifications && notifications.length > 0 ? (
            notifications.map((item) => (
              <Card 
                key={item.id} 
                className={`p-4 transition hover:bg-slate-50 cursor-pointer ${
                  !item.isRead ? 'border-brand-200 bg-brand-50/10' : 'border-slate-100 bg-white'
                }`}
                onClick={() => {
                  if (!item.isRead) {
                    markAsRead(item.id);
                  }
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm text-ink-900 truncate ${!item.isRead ? 'font-bold' : 'font-semibold'}`}>
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-600 break-words leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                  <Badge variant={item.isRead ? 'default' : 'success'} className="shrink-0 text-[10px] uppercase font-bold tracking-wider">
                    {item.isRead ? 'Read' : 'New'}
                  </Badge>
                </div>
              </Card>
            ))
          ) : (
            <div className="flex h-48 flex-col items-center justify-center text-center text-slate-400">
              <span className="text-3xl mb-2">🔔</span>
              <p className="text-sm font-medium">{t('no_notifications')}</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default NotificationDrawer;