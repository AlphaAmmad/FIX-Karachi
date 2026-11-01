import React from 'react';

const Logo = () => React.createElement('div', { className: 'flex items-center gap-3' }, [
  React.createElement('div', { key: 'mark', className: 'flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-amber-400 text-ink-950 font-black shadow-glow' }, 'FK'),
  React.createElement('div', { key: 'text' }, [
    React.createElement('p', { key: 'title', className: 'font-display text-lg font-bold text-white' }, 'FIX KARACHI'),
    React.createElement('p', { key: 'subtitle', className: 'text-xs font-medium uppercase tracking-[0.3em] text-slate-400' }, 'Citizen Resolution Platform'),
  ]),
]);

export default Logo;