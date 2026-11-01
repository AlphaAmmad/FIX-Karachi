import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';
import { STATUS_LABELS, PRIORITY_LABELS } from '../../config/constants';
import MapPicker from '../../components/maps/MapPicker';
import LazyImage from '../../components/common/LazyImage';
import { useLanguage } from '../../context/LanguageContext';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const ComplaintDetailsPage = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [escalateReason, setEscalateReason] = useState('');
  const [escalating, setEscalating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([
      api.get(endpoints.complaints.detail(id)),
      api.get(endpoints.complaints.timeline(id)),
    ]).then(([detailRes, timelineRes]) => {
      setComplaint(detailRes.data?.data || detailRes.data);
      setTimeline(timelineRes.data?.data || timelineRes.data || []);
    }).catch(() => {});
  }, [id]);

  const handleEscalate = async () => {
    if (!escalateReason.trim()) return;
    if (escalateReason.trim().length < 10) {
      setMessage(t('detail_reason_min'));
      return;
    }
    setEscalating(true);
    try {
      await api.post(endpoints.complaints.escalate(id), { reason: escalateReason });
      setMessage('Complaint escalated successfully!');
      setEscalateReason('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to escalate');
    } finally {
      setEscalating(false);
    }
  };

  if (!complaint) return <p className="text-sm text-slate-500">{t('loading')}</p>;

  const statusColor =
    complaint.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
    complaint.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
    complaint.status === 'rejected' ? 'bg-red-100 text-red-700' :
    'bg-amber-100 text-amber-700';

  const hasCoords = complaint.latitude && complaint.longitude;
  const mapLocation = hasCoords
    ? { lat: parseFloat(complaint.latitude), lng: parseFloat(complaint.longitude) }
    : null;

  return (
    <div className="space-y-8">
      <div>
        <Link to="/citizen/complaints" className="text-xs font-semibold text-brand-600 hover:underline">{t('detail_back')}</Link>
        <h1 className="mt-3 section-title">{complaint.title}</h1>
        <p className="mt-1 text-sm text-slate-600">{complaint.description}</p>
      </div>

      {/* Info + Image */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="soft-card p-6">
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${statusColor}`}>
              {STATUS_LABELS[complaint.status] || complaint.status}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {PRIORITY_LABELS[complaint.priority] || complaint.priority}
            </span>
          </div>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              [t('detail_category'), complaint.category],
              [t('detail_area'), complaint.area],
              [t('detail_assigned_to'), complaint.assignedOrganization || '—'],
              [t('detail_created'), new Date(complaint.createdAt).toLocaleDateString()],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</dt>
                <dd className="mt-1 text-sm font-semibold text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Complaint Image (when no before/after pair) */}
        {!(complaint.imagePath && complaint.proofImagePath) && (
          <div className="soft-card overflow-hidden p-0">
            {complaint.imagePath ? (
              <LazyImage
                src={`${API_BASE}${complaint.imagePath}`}
                alt={complaint.title}
                className="h-full min-h-64 w-full object-cover"
                onError={(e) => { e.target.src = 'https://placehold.co/600x400/e2e8f0/64748b?text=Image+Not+Found'; }}
              />
            ) : (
              <div className="flex h-64 items-center justify-center bg-slate-100 text-sm text-slate-400">
                {t('detail_no_image')}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Before / After comparison */}
      {complaint.imagePath && complaint.proofImagePath && (
        <div className="soft-card p-6">
          <h2 className="text-lg font-bold text-ink">{t('detail_before_after')}</h2>
          <p className="mt-1 text-sm text-slate-500">{t('detail_before_after_desc')}</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">{t('detail_before')}</p>
              <LazyImage
                src={`${API_BASE}${complaint.imagePath}`}
                alt="Before"
                className="h-64 w-full rounded-2xl object-cover"
                onError={(e) => { e.target.src = 'https://placehold.co/600x400/e2e8f0/64748b?text=Before'; }}
              />
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-600">{t('detail_after')}</p>
              <LazyImage
                src={`${API_BASE}${complaint.proofImagePath}`}
                alt="After"
                className="h-64 w-full rounded-2xl object-cover"
                onError={(e) => { e.target.src = 'https://placehold.co/600x400/e2e8f0/64748b?text=After'; }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Location Map */}
      {hasCoords && (
        <div className="soft-card p-6">
          <h2 className="text-lg font-bold text-ink">{t('detail_location')}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {complaint.area} — Coordinates: {parseFloat(complaint.latitude).toFixed(6)}, {parseFloat(complaint.longitude).toFixed(6)}
          </p>
          <div className="mt-4">
            <MapPicker value={mapLocation} onChange={() => {}} readOnly />
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="soft-card p-6">
        <h2 className="text-lg font-bold text-ink">{t('detail_timeline')}</h2>
        {timeline.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">{t('detail_no_updates')}</p>
        ) : (
          <ol className="mt-4 space-y-4 border-l-2 border-slate-200 pl-6">
            {timeline.map((t, i) => (
              <li key={t.id || i} className="relative">
                <div className="absolute -left-[1.85rem] top-1 h-3 w-3 rounded-full border-2 border-brand-500 bg-white" />
                <p className="text-sm font-semibold text-ink">
                  {t.newStatus ? STATUS_LABELS[t.newStatus] || t.newStatus : 'Update'}
                </p>
                {t.remarks && <p className="mt-1 text-xs text-slate-500">{t.remarks}</p>}
                <p className="mt-1 text-xs text-slate-400">{new Date(t.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Escalation */}
      {complaint.status !== 'resolved' && (
        <div className="soft-card p-6">
          <h2 className="text-lg font-bold text-ink">{t('detail_escalate_title')}</h2>
          <p className="mt-1 text-sm text-slate-500">{t('detail_escalate_desc')}</p>

          {message && (
            <div className="mt-3 rounded-xl bg-blue-50 px-4 py-2 text-sm text-blue-700">{message}</div>
          )}

          <textarea
            className="input-field mt-4"
            rows={3}
            placeholder={t('detail_escalate_placeholder')}
            value={escalateReason}
            onChange={(e) => setEscalateReason(e.target.value)}
          />
          <button className="btn-primary mt-3" onClick={handleEscalate} disabled={escalating || !escalateReason.trim()}>
            {escalating ? t('detail_escalating') : t('detail_escalate_btn')}
          </button>
        </div>
      )}
    </div>
  );
};

export default ComplaintDetailsPage;