import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';
import { STATUS_LABELS } from '../../config/constants';

const EscalationsPage = () => {
  const [escalations, setEscalations] = useState([]);
  const [reviewNotes, setReviewNotes] = useState({});
  const [reviewStatus, setReviewStatus] = useState({});

  useEffect(() => {
    api.get(endpoints.admin.escalations).then(({ data }) => {
      setEscalations(data?.data || data || []);
    }).catch(() => {});
  }, []);

  const handleReview = async (id) => {
    try {
      await api.patch(endpoints.admin.reviewEscalation(id), {
        status: reviewStatus[id] || 'closed',
        adminRemarks: reviewNotes[id] || '',
      });
      // Refresh
      const { data } = await api.get(endpoints.admin.escalations);
      setEscalations(data?.data || data || []);
    } catch (_) {}
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-600">Escalations</p>
        <h1 className="mt-2 section-title">Review citizen escalations</h1>
      </div>

      {escalations.length === 0 ? (
        <div className="soft-card p-8 text-center"><p className="text-slate-500">No escalations.</p></div>
      ) : (
        <div className="space-y-4">
          {escalations.map((e) => (
            <div key={e.id} className="soft-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-ink">Escalation #{e.id?.slice(0, 8)}</p>
                  <p className="mt-1 text-sm text-slate-600">Reason: {e.reason}</p>
                  <p className="mt-1 text-xs text-slate-400">Complaint: {e.complaintId?.slice(0, 8)}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${
                  e.status === 'closed' ? 'bg-slate-200 text-slate-600' :
                  e.status === 'under_review' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {e.status}
                </span>
              </div>

              {e.status !== 'closed' && (
                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                  <input
                    className="input-field"
                    placeholder="Review notes…"
                    value={reviewNotes[e.id] || ''}
                    onChange={(ev) => setReviewNotes((p) => ({ ...p, [e.id]: ev.target.value }))}
                  />
                  <select
                    className="input-field"
                    value={reviewStatus[e.id] || 'closed'}
                    onChange={(ev) => setReviewStatus((p) => ({ ...p, [e.id]: ev.target.value }))}
                  >
                    <option value="under_review">Under Review</option>
                    <option value="closed">Close</option>
                  </select>
                  <button className="btn-primary" onClick={() => handleReview(e.id)}>Submit</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EscalationsPage;