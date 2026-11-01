import React from 'react';

const Button = ({ as: Component = 'button', variant = 'primary', className = '', children, ...props }) => {
  const styles = {
    primary: 'bg-ink-900 text-white hover:bg-ink-800',
    accent: 'bg-emerald-500 text-ink-950 hover:bg-emerald-400',
    ghost: 'border border-white/10 bg-white/10 text-white hover:bg-white/15',
    soft: 'border border-slate-200 bg-white text-ink-900 hover:bg-slate-100',
  };

  return React.createElement(Component, { className: `inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant] || styles.primary} ${className}`.trim(), ...props }, children);
};

export default Button;