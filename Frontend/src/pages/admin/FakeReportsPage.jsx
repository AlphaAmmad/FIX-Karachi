import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';

const FakeReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [reviewNotes, setReviewNotes] = useState({});
  const [reviewStatus, setReviewStatus] = useState({});

  const loadReports = () => {
    api.get(endpoints.admin.fakeReports).then(({ data }) => {
      setReports(data?.data || data || []);
    }).catch(() => {});
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleReview = async (id) => {
    try {
      await api.patch(endpoints.admin.reviewFakeReport(id), {
        status: reviewStatus[id] || 'dismissed',
        reviewNotes: reviewNotes[id] || '',
      });
      loadReports();
    } catch (_) {}
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-600">Fake Reports</p>
        <h1 className="mt-2 section-title">Review flagged complaints</h1>
      </div>

      {reports.length === 0 ? (
        <div className="soft-card p-8 text-center"><p className="text-slate-500">No fake reports.</p></div>
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <div key={r.id} className="soft-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-ink">{r.complaint?.title || 'Complaint'}</p>
                  <p className="mt-1 text-sm text-slate-600">Reason: {r.reason}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Flagged by: {r.authority?.organization || r.authority?.fullName || 'Authority'}
                    {r.complaint?.assignedOrganization ? ` · Org: ${r.complaint.assignedOrganization}` : ''}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${
                  r.status === 'dismissed' ? 'bg-slate-200 text-slate-600' :
                  r.status === 'reviewed' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {r.status}
                </span>
              </div>

              {r.status === 'open' && (
                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                  <input
                    className="input-field"
                    placeholder="Review notes…"
                    value={reviewNotes[r.id] || ''}
                    onChange={(ev) => setReviewNotes((p) => ({ ...p, [r.id]: ev.target.value }))}
                  />
                  <select
                    className="input-field"
                    value={reviewStatus[r.id] || 'dismissed'}
                    onChange={(ev) => setReviewStatus((p) => ({ ...p, [r.id]: ev.target.value }))}
                  >
                    <option value="reviewed">Confirm Fake</option>
                    <option value="dismissed">Dismiss</option>
                  </select>
                  <button className="btn-primary" onClick={() => handleReview(r.id)}>Submit</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FakeReportsPage;
