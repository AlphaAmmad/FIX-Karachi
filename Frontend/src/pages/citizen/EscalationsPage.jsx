import React, { useState, useEffect } from 'react';
import api from '../../api/client';

const EscalationsPage = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    api.get('/complaints/mine?limit=100').then(({ data }) => {
      const all = data?.data || data || [];
      setComplaints((Array.isArray(all) ? all : []).filter((c) => c.escalated));
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-600">Escalations</p>
        <h1 className="mt-2 section-title">Your escalated complaints</h1>
      </div>

      {complaints.length === 0 ? (
        <div className="soft-card p-8 text-center">
          <p className="text-slate-500">You have not escalated any complaints yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => (
            <div key={c.id} className="soft-card p-5">
              <p className="font-semibold text-ink">{c.title}</p>
              <p className="mt-1 text-xs text-slate-500">{c.category} · {c.area}</p>
              <span className="mt-2 inline-flex rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold uppercase text-orange-700">
                Escalated
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EscalationsPage;