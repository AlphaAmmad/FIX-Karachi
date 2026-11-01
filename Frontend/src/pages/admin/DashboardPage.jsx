import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';
import { formatNumber } from '../../utils/formatters';

const DashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api.get(endpoints.admin.analytics).then(({ data }) => {
      setAnalytics(data?.data || data);
    }).catch(() => {});
  }, []);

  const d = analytics?.dashboard || {};

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-600">Admin Dashboard</p>
        <h1 className="mt-2 section-title">City-wide overview</h1>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Total Complaints', d.totalComplaints, 'text-ink'],
          ['Pending', d.pending, 'text-amber-600'],
          ['Resolved', d.resolved, 'text-emerald-600'],
          ['Escalations', d.totalEscalations, 'text-orange-600'],
        ].map(([label, value, color]) => (
          <div key={label} className="soft-card p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className={`mt-1 text-3xl font-bold ${color}`}>{formatNumber(value || 0)}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ['Manage Users', '/admin/users', 'Block/unblock citizens'],
          ['Manage Authorities', '/admin/authorities', 'Add or remove authorities'],
          ['View Complaints', '/admin/complaints', 'Browse all complaints'],
          ['Escalations', '/admin/escalations', 'Review citizen escalations'],
          ['Analytics', '/admin/analytics', 'Charts and performance'],
          ['Broadcast Alert', '/admin/settings', 'Send alerts to all users'],
        ].map(([title, to, desc]) => (
          <Link key={to} to={to} className="soft-card block p-5 transition hover:shadow-lg">
            <p className="font-semibold text-ink">{title}</p>
            <p className="mt-1 text-xs text-slate-500">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;