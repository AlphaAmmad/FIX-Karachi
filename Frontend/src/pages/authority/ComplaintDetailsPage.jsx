import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';
import { STATUS_LABELS, PRIORITY_LABELS } from '../../config/constants';
import MapPicker from '../../components/maps/MapPicker';
import { compressImage } from '../../utils/compressImage';
import LazyImage from '../../components/common/LazyImage';
import { useLanguage } from '../../context/LanguageContext';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const ComplaintDetailsPage = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get(endpoints.authority.detail(id)).then(({ data }) => {
      const c = data?.data || data;
      setComplaint(c);
      setStatus(c?.status || '');
    }).catch(() => {});
  }, [id]);

  const handleUpdate = async () => {
    setUpdating(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('status', status);
      if (remarks) formData.append('remarks', remarks);
      if (proofFile) {
        const compressed = await compressImage(proofFile);
        formData.append('proofImage', compressed, compressed.name || proofFile.name);
      }
      const { data } = await api.patch(endpoints.authority.updateStatus(id), formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage(t('authority_detail_success'));
      const updated = data?.data || data;
      setComplaint(updated);
      setStatus(updated?.status || status);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update');
    } finally {
      setUpdating(false);
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
        <Link to="/authority/complaints" className="text-xs font-semibold text-brand-600 hover:underline">{t('authority_detail_back')}</Link>
        <h1 className="mt-3 section-title">{complaint.title}</h1>
        <p className="mt-1 text-sm text-slate-600">{complaint.description}</p>
      </div>

      {/* Info + Image */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Details card */}
        <div className="soft-card p-6">
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${statusColor}`}>
              {STATUS_LABELS[complaint.status] || complaint.status}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {PRIORITY_LABELS[complaint.priority] || complaint.priority}
            </span>
            {complaint.escalated && (
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">Escalated</span>
            )}
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              [t('detail_category'), complaint.category],
              [t('detail_area'), complaint.area],
              [t('authority_detail_org'), complaint.assignedOrganization],
              [t('detail_created'), new Date(complaint.createdAt).toLocaleDateString()],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</dt>
                <dd className="mt-1 text-sm font-semibold text-ink">{value || '—'}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Complaint Image */}
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
      </div>

      {/* Location Map */}
      {hasCoords && (
        <div className="soft-card p-6">
          <h2 className="text-lg font-bold text-ink">{t('authority_detail_location')}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {complaint.area} — Coordinates: {parseFloat(complaint.latitude).toFixed(6)}, {parseFloat(complaint.longitude).toFixed(6)}
          </p>
          <div className="mt-4">
            <MapPicker value={mapLocation} onChange={() => {}} readOnly />
          </div>
        </div>
      )}

      {/* Proof Image (if exists) */}
      {complaint.proofImagePath && (
        <div className="soft-card p-6">
          <h2 className="text-lg font-bold text-ink">{t('authority_detail_proof')}</h2>
          <LazyImage
            src={`${API_BASE}${complaint.proofImagePath}`}
            alt="Resolution proof"
            className="mt-4 max-h-96 rounded-2xl object-contain"
            onError={(e) => { e.target.src = 'https://placehold.co/600x400/e2e8f0/64748b?text=Proof+Not+Found'; }}
          />
        </div>
      )}

      {/* Update Status Form */}
      {complaint.status !== 'resolved' && complaint.status !== 'rejected' && (
        <div className="soft-card p-6">
          <h2 className="text-lg font-bold text-ink">{t('authority_detail_update')}</h2>
          <p className="mt-1 text-sm text-slate-500">{t('authority_detail_update_desc')}</p>

          {message && (
            <div className={`mt-3 rounded-xl px-4 py-2 text-sm ${message.includes('Failed') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
              {message}
            </div>
          )}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-text">{t('authority_detail_new_status')}</label>
              <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="pending">{t('status_pending')}</option>
                <option value="under_review">{t('status_under_review')}</option>
                <option value="in_progress">{t('status_in_progress')}</option>
                <option value="resolved">{t('status_resolved')}</option>
                <option value="rejected">{t('status_rejected')}</option>
              </select>
            </div>
            <div>
              <label className="label-text">{t('authority_detail_proof_upload')}</label>
              <input
                type="file"
                accept="image/*"
                className="input-field"
                onChange={(e) => setProofFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="label-text">{t('authority_detail_remarks')}</label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Add notes about the update…"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          <button className="btn-primary mt-4" onClick={handleUpdate} disabled={updating}>
            {updating ? t('authority_detail_updating') : t('authority_detail_update_btn')}
          </button>
        </div>
      )}
    </div>
  );
};

export default ComplaintDetailsPage;