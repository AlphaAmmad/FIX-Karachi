import React from 'react';
import { STATUS_STEPS, STATUS_LABELS } from '../../config/constants';

const ComplaintTimeline = ({ status = 'pending', updates = [] }) => {
  const activeIndex = STATUS_STEPS.indexOf(status);

  return React.createElement('div', { className: 'space-y-4' }, STATUS_STEPS.map((step, index) => {
    const active = index <= activeIndex;
    return React.createElement('div', { key: step, className: 'flex items-start gap-4' }, [
      React.createElement('div', { key: 'dot', className: `mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${active ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200 bg-white text-slate-400'}` }, active ? '✓' : index + 1),
      React.createElement('div', { key: 'body', className: 'flex-1 rounded-2xl border border-slate-200 bg-white p-4' }, [
        React.createElement('div', { key: 'row', className: 'flex items-center justify-between gap-3' }, [
          React.createElement('p', { key: 'label', className: 'font-semibold text-ink-900' }, STATUS_LABELS[step] || step),
          React.createElement('span', { key: 'state', className: `text-xs font-bold uppercase tracking-wide ${active ? 'text-emerald-600' : 'text-slate-400'}` }, active ? 'Completed' : 'Pending'),
        ]),
        updates.find((item) => item.newStatus === step || item.status === step)
          ? React.createElement('p', { key: 'note', className: 'mt-2 text-sm text-slate-600' }, updates.find((item) => item.newStatus === step || item.status === step).remarks || 'Status updated')
          : null,
      ]),
    ]);
  }));
};

export default ComplaintTimeline;