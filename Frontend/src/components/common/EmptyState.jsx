import React from 'react';
import Button from './Button';

const EmptyState = ({ title, description, actionLabel, onAction }) => React.createElement('div', { className: 'glass-card rounded-3xl p-8 text-center' }, [
  React.createElement('p', { key: 'title', className: 'font-display text-2xl font-bold text-ink-900' }, title),
  description ? React.createElement('p', { key: 'description', className: 'mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600' }, description) : null,
  actionLabel ? React.createElement(Button, { key: 'action', className: 'mt-6', onClick: onAction }, actionLabel) : null,
]);

export default EmptyState;