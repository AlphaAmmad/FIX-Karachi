import React from 'react';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-600">Profile</p>
        <h1 className="mt-2 section-title">Your account</h1>
      </div>

      <div className="soft-card p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">Name</dt>
            <dd className="mt-1 text-sm font-semibold text-ink">{user?.fullName || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">Email</dt>
            <dd className="mt-1 text-sm font-semibold text-ink">{user?.email || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">Role</dt>
            <dd className="mt-1 text-sm font-semibold text-ink capitalize">{user?.role || '—'}</dd>
          </div>
        </dl>
        <button onClick={logout} className="btn-secondary mt-6">Logout</button>
      </div>
    </div>
  );
};

export default ProfilePage;