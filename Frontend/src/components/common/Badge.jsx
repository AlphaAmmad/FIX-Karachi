import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const styles = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
  };

  return React.createElement('span', { className: `inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${styles[variant] || styles.default} ${className}`.trim() }, children);
};

export default Badge;