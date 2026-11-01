import React, { useState } from 'react';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';

const SettingsPage = () => {
  const [title, setTitle] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState('');

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!title.trim() || !messageText.trim()) return;
    setSending(true);
    setResult('');
    try {
      await api.post(endpoints.admin.broadcast, { title, message: messageText });
      setResult('Broadcast sent successfully!');
      setTitle('');
      setMessageText('');
    } catch (err) {
      setResult(err.response?.data?.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-600">Settings</p>
        <h1 className="mt-2 section-title">Admin broadcast & settings</h1>
      </div>

      <div className="soft-card p-6">
        <h2 className="text-lg font-bold text-ink">Broadcast Alert</h2>
        <p className="mt-1 text-sm text-slate-500">Send a notification to all users.</p>

        {result && (
          <div className="mt-3 rounded-xl bg-blue-50 px-4 py-2 text-sm text-blue-700">{result}</div>
        )}

        <form className="mt-4 space-y-4" onSubmit={handleBroadcast}>
          <div>
            <label className="label-text">Title</label>
            <input className="input-field" placeholder="Alert title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="label-text">Message</label>
            <textarea className="input-field" rows={4} placeholder="Alert message…" value={messageText} onChange={(e) => setMessageText(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary" disabled={sending}>
            {sending ? 'Sending…' : 'Send Broadcast'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;