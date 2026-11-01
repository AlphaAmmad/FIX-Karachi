import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api.get(endpoints.admin.analytics).then(({ data }) => {
      setAnalytics(data?.data || data);
    }).catch(() => {});
  }, []);

  if (!analytics) return <p className="text-sm text-slate-500">Loading analytics…</p>;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-600">Analytics</p>
        <h1 className="mt-2 section-title">City-wide complaint analytics</h1>
      </div>

      {/* By category */}
      <div className="soft-card p-6">
        <h2 className="text-lg font-bold text-ink">Complaints by Category</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(analytics.categories || []).map((c) => (
            <div key={c.category} className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-ink">{c.category}</p>
              <p className="text-2xl font-bold text-brand-600">{c.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* By area */}
      <div className="soft-card p-6">
        <h2 className="text-lg font-bold text-ink">Complaints by Area</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(analytics.areas || []).map((a) => (
            <div key={a.area} className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-ink">{a.area}</p>
              <p className="text-2xl font-bold text-brand-600">{a.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Authority performance */}
      <div className="soft-card p-6">
        <h2 className="text-lg font-bold text-ink">Authority Performance</h2>
        {(analytics.performance || []).length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No performance data yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-400">
                  <th className="px-4 py-3">Organization</th>
                  <th className="px-4 py-3">Assigned</th>
                  <th className="px-4 py-3">Resolved</th>
                  <th className="px-4 py-3">Rate</th>
                </tr>
              </thead>
              <tbody>
                {(analytics.performance || []).map((p, i) => {
                  const total = Number(p.totalComplaints ?? p.total ?? p.assigned ?? 0);
                  const resolved = Number(p.resolvedComplaints ?? p.resolved ?? 0);
                  const organization = p.organization || p.assignedOrganization
                    || (p.assignedAuthorityId ? `Authority ${String(p.assignedAuthorityId).slice(0, 8)}` : 'Unassigned');
                  return (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="px-4 py-3 font-medium text-ink">{organization}</td>
                    <td className="px-4 py-3">{total}</td>
                    <td className="px-4 py-3">{resolved}</td>
                    <td className="px-4 py-3 font-semibold text-brand-600">
                      {total ? Math.round((resolved / total) * 100) : 0}%
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;