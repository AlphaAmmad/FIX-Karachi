import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';
import { useLanguage } from '../../context/LanguageContext';
import { STATUS_LABELS } from '../../config/constants';

const TransparencyDashboardPage = () => {
  const { t } = useLanguage();
  const [dashboard, setDashboard] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get(endpoints.public.dashboard),
      api.get(endpoints.public.recent),
    ]).then(([dashRes, recentRes]) => {
      setDashboard(dashRes.data?.data || dashRes.data);
      setRecent(recentRes.data?.data || recentRes.data || []);
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-600">{t('transparency_badge')}</p>
        <h1 className="mt-2 section-title">{t('transparency_title')}</h1>
        <p className="mt-1 text-sm text-slate-600">{t('transparency_subtitle')}</p>
      </div>

      {dashboard && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [t('stat_total'), dashboard.total, 'text-ink'],
            [t('stat_pending'), dashboard.pending, 'text-amber-600'],
            [t('stat_in_progress'), dashboard.inProgress, 'text-blue-600'],
            [t('stat_resolved'), dashboard.resolved, 'text-emerald-600'],
          ].map(([label, value, color]) => (
            <div key={label} className="soft-card p-5 text-center">
              <p className={`text-3xl font-bold ${color}`}>{value || 0}</p>
              <p className="mt-1 text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold text-ink">{t('recent_complaints')}</h2>
        {recent.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">{t('no_recent_complaints')}</p>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {recent.map((c) => (
              <div key={c.id} className="soft-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{c.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{c.category} · {c.area}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${
                    c.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {STATUS_LABELS[c.status] || c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransparencyDashboardPage;
