import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatNumber } from '../../utils/formatters';
import LazyImage from '../../components/common/LazyImage';
import { STATUS_LABELS } from '../../config/constants';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const DashboardPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, inProgress: 0 });

  useEffect(() => {
    api.get(endpoints.authority.complaints + '?limit=100').then(({ data }) => {
      const list = data?.data || data || [];
      const arr = Array.isArray(list) ? list : [];
      setComplaints(arr);

      const total = data?.meta?.total || arr.length;
      const resolved = arr.filter((c) => c.status === 'resolved').length;
      const inProgress = arr.filter((c) => c.status === 'in_progress').length;
      setStats({ total, pending: total - resolved - inProgress, resolved, inProgress });
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-600">{t('authority_dashboard_badge')}</p>
        <h1 className="mt-2 section-title">{t('authority_dashboard_title')} {user?.organization || ''}</h1>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="soft-card p-5">
          <p className="text-sm text-slate-500">{t('total_assigned')}</p>
          <p className="mt-1 text-3xl font-bold text-ink">{formatNumber(stats.total)}</p>
        </div>
        <div className="soft-card p-5">
          <p className="text-sm text-slate-500">{t('stat_pending')}</p>
          <p className="mt-1 text-3xl font-bold text-amber-600">{formatNumber(stats.pending)}</p>
        </div>
        <div className="soft-card p-5">
          <p className="text-sm text-slate-500">{t('stat_in_progress')}</p>
          <p className="mt-1 text-3xl font-bold text-blue-600">{formatNumber(stats.inProgress)}</p>
        </div>
        <div className="soft-card p-5">
          <p className="text-sm text-slate-500">{t('stat_resolved')}</p>
          <p className="mt-1 text-3xl font-bold text-emerald-600">{formatNumber(stats.resolved)}</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">{t('all_assigned')}</h2>
          <Link to="/authority/complaints" className="text-xs font-semibold text-brand-600 hover:underline">{t('view_all')}</Link>
        </div>

        {complaints.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">{t('no_assigned')}</p>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {complaints.slice(0, 6).map((c) => (
              <Link key={c.id} to={`/authority/complaints/${c.id}`} className="soft-card flex gap-4 p-4 transition hover:shadow-lg">
                {/* Thumbnail */}
                {c.imagePath && (
                  <LazyImage
                    src={`${API_BASE}${c.imagePath}`}
                    alt=""
                    className="h-20 w-20 flex-shrink-0 rounded-xl object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-ink">{c.title}</p>
                    <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-bold uppercase ${
                      c.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                      c.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {STATUS_LABELS[c.status] || c.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{c.category} · {c.area} · {c.priority}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;