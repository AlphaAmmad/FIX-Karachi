import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';
import { formatNumber } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';

const DashboardPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
  const [draftData, setDraftData] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    api.get(endpoints.complaints.mine + '?limit=6').then(({ data }) => {
      const list = data?.data || data || [];
      setComplaints(Array.isArray(list) ? list : []);
      const total = data?.meta?.total || list.length || 0;
      const resolved = (Array.isArray(list) ? list : []).filter((c) => c.status === 'resolved').length;
      setStats({ total, pending: total - resolved, resolved });
    }).catch(() => {});
  }, []);

  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('fixkarachi-complaint-draft');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && (parsed.title || parsed.description || parsed.category || parsed.latitude)) {
          setDraftData(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-600">{t('citizen_dashboard_badge')}</p>
        <h1 className="mt-2 section-title">{t('citizen_dashboard_title')}</h1>
        <div className="mt-2 flex gap-3">
          <Link to="/citizen/complaints/new" className="btn-primary">{t('citizen_new_complaint')}</Link>
        </div>
      </div>

      {draftData && (
        <div className="soft-card p-5 border border-brand-200 bg-brand-50/50 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-bold text-brand-700 uppercase tracking-wider">
              Draft
            </span>
            <h3 className="mt-2 font-bold text-ink">{draftData.title || '(Untitled Draft)'}</h3>
            <p className="mt-1 text-sm text-slate-500 line-clamp-1">{draftData.description || 'No description provided'}</p>
          </div>
          <div className="flex gap-2">
            <Link to="/citizen/complaints/new" className="btn-primary py-2 px-4 text-xs font-bold">
              Resume Editing
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('fixkarachi-complaint-draft');
                setDraftData(null);
              }}
              className="btn-secondary py-2 px-4 text-xs font-bold"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="soft-card p-5">
          <p className="text-sm text-slate-500">{t('total_complaints')}</p>
          <p className="mt-1 text-3xl font-bold text-ink">{formatNumber(stats.total)}</p>
        </div>
        <div className="soft-card p-5">
          <p className="text-sm text-slate-500">{t('pending')}</p>
          <p className="mt-1 text-3xl font-bold text-amber-600">{formatNumber(stats.pending)}</p>
        </div>
        <div className="soft-card p-5">
          <p className="text-sm text-slate-500">{t('resolved')}</p>
          <p className="mt-1 text-3xl font-bold text-emerald-600">{formatNumber(stats.resolved)}</p>
        </div>
      </div>

      {/* Recent complaints */}
      <div>
        <h2 className="text-lg font-bold text-ink">{t('recent_complaints')}</h2>
        {complaints.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">{t('no_complaints_yet')}</p>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {complaints.map((c) => (
              <Link key={c.id} to={`/citizen/complaints/${c.id}`} className="soft-card block p-5 transition hover:shadow-lg">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{c.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{c.category} · {c.area}</p>
                  </div>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase ${
                    c.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                    c.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {t('status_' + c.status)}
                  </span>
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