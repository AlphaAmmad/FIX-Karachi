import React from 'react';

export const LoadingScreen = ({ fullScreen = false }) => (
  <div className={fullScreen ? 'flex min-h-screen items-center justify-center' : 'py-12'}>
    <div className="soft-card flex items-center gap-3 px-5 py-4 text-sm font-medium text-slate-700">
      <span className="h-3 w-3 animate-pulse rounded-full bg-brand-600" />
      Loading FIX KARACHI...
    </div>
  </div>
);