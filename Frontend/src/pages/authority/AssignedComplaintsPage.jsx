import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';
import LazyImage from '../../components/common/LazyImage';
import { useLanguage } from '../../context/LanguageContext';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const AssignedComplaintsPage = () => {
  const { t } = useLanguage();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(endpoints.authority.complaints + '?limit=100').then(({ data }) => {
      const list = data?.data || data || [];
      setComplaints(Array.isArray(list) ? list : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-600">{t('assigned_badge')}</p>
        <h1 className="mt-2 section-title">{t('assigned_title')}</h1>
        <p className="mt-1 text-sm text-slate-500">{t('assigned_total').replace('{count}', complaints.length)}</p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">{t('loading')}</p>
      ) : complaints.length === 0 ? (
        <div className="soft-card p-8 text-center">
          <p className="text-slate-500">{t('no_assigned_yet')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => (
            <Link key={c.id} to={`/authority/complaints/${c.id}`} className="soft-card flex items-center gap-4 p-4 transition hover:shadow-lg">
              {/* Thumbnail */}
              {c.imagePath && (
                <LazyImage
                  src={`${API_BASE}${c.imagePath}`}
                  alt=""
                  className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}

              <div className="flex-1">
                <p className="font-semibold text-ink">{c.title}</p>
                <p className="mt-1 text-xs text-slate-500">{c.category} · {c.area} · {c.priority}</p>
              </div>

              <div className="text-right">
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase ${
                  c.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                  c.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                  c.status === 'under_review' ? 'bg-purple-100 text-purple-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {c.status?.replace(/_/g, ' ')}
                </span>
                <p className="mt-1 text-xs text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedComplaintsPage;