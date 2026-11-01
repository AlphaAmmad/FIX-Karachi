import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';
import { useLanguage } from '../../context/LanguageContext';
import { STATUS_LABELS } from '../../config/constants';

const MyComplaintsPage = () => {
  const { t } = useLanguage();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(endpoints.complaints.mine).then(({ data }) => {
      setComplaints(data?.data || data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-600">{t('my_complaints_badge')}</p>
          <h1 className="mt-2 section-title">{t('my_complaints_title')}</h1>
        </div>
        <Link to="/citizen/complaints/new" className="btn-primary">{t('new_short')}</Link>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">{t('loading')}</p>
      ) : complaints.length === 0 ? (
        <div className="soft-card p-8 text-center">
          <p className="text-slate-500">{t('no_complaints')}</p>
          <Link to="/citizen/complaints/new" className="btn-primary mt-4 inline-block">{t('create_first_complaint')}</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => (
            <Link key={c.id} to={`/citizen/complaints/${c.id}`} className="soft-card flex items-center justify-between gap-4 p-5 transition hover:shadow-lg">
              <div>
                <p className="font-semibold text-ink">{c.title}</p>
                <p className="mt-1 text-xs text-slate-500">{c.category} · {c.area} · {c.assignedOrganization || '—'}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase ${
                  c.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                  c.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                  c.status === 'under_review' ? 'bg-purple-100 text-purple-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {STATUS_LABELS[c.status] || c.status}
                </span>
                <p className="mt-1 text-xs text-slate-400">{t(`priority_${c.priority}`)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComplaintsPage;
