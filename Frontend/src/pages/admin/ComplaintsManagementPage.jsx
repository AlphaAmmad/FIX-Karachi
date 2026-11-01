import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';

const ComplaintsManagementPage = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    api.get(`${endpoints.admin.complaints}?limit=100`).then(({ data }) => {
      setComplaints(data?.data || data || []);
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-600">All Complaints</p>
        <h1 className="mt-2 section-title">Browse submitted complaints</h1>
      </div>

      {complaints.length === 0 ? (
        <div className="soft-card p-8 text-center"><p className="text-slate-500">No complaints found.</p></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-400">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Area</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Priority</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-ink">{c.title}</td>
                  <td className="px-4 py-3 text-slate-600">{c.category}</td>
                  <td className="px-4 py-3 text-slate-600">{c.area}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold uppercase ${
                      c.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                      c.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {c.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize text-slate-600">{c.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ComplaintsManagementPage;