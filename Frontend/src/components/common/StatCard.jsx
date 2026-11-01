import React from 'react';

export const StatCard = ({ label, value, hint, icon }) => (
  <div className="soft-card p-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <h3 className="mt-2 text-3xl font-bold text-ink">{value}</h3>
        {hint ? <p className="mt-2 text-sm text-slate-500">{hint}</p> : null}
      </div>
      {icon ? <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">{icon}</div> : null}
    </div>
  </div>
);

export default StatCard;