import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';

const FakeComplaintReportsPage = () => {
  const [complaintId, setComplaintId] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    api.get(endpoints.authority.complaints).then(({ data }) => {
      setComplaints(data?.data || data || []);
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complaintId || !reason.trim()) return;
    if (reason.trim().length < 10) {
      setReasonError('Please provide more detail (min 10 characters)');
      return;
    }
    setReasonError('');
    setSubmitting(true);
    setMessage('');
    try {
      await api.post(endpoints.authority.fakeReports, { complaintId, reason });
      setMessage('Fake complaint report submitted!');
      setComplaintId('');
      setReason('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-600">Fake Reports</p>
        <h1 className="mt-2 section-title">Report a fake complaint</h1>
      </div>

      {message && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">{message}</div>
      )}

      <div className="soft-card p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="label-text">Select Complaint</label>
            <select className="input-field" value={complaintId} onChange={(e) => setComplaintId(e.target.value)}>
              <option value="">Choose a complaint</option>
              {complaints.map((c) => (
                <option key={c.id} value={c.id}>{c.title} ({c.category})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-text">Reason</label>
            <textarea className="input-field" rows={4} placeholder="Why do you believe this is fake?" value={reason} onChange={(e) => { setReason(e.target.value); setReasonError(''); }} />
            {reasonError && <p className="mt-1 text-xs text-red-500">{reasonError}</p>}
          </div>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit Fake Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FakeComplaintReportsPage;