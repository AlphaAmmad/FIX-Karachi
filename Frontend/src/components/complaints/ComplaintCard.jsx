import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { PRIORITY_LABELS, STATUS_LABELS } from '../../config/constants';

const ComplaintCard = ({ complaint, to }) => React.createElement(Card, { className: 'p-5 transition hover:-translate-y-0.5 hover:shadow-2xl' }, [
  React.createElement('div', { key: 'row', className: 'flex items-start justify-between gap-4' }, [
    React.createElement('div', { key: 'left' }, [
      React.createElement('h3', { key: 'title', className: 'text-lg font-bold text-ink-900' }, complaint.title),
      React.createElement('p', { key: 'meta', className: 'mt-2 text-sm leading-6 text-slate-600' }, complaint.area || complaint.assignedOrganization || complaint.category || 'Karachi'),
    ]),
    React.createElement('div', { key: 'badges', className: 'flex flex-col items-end gap-2' }, [
      React.createElement(Badge, { key: 'status', variant: complaint.status === 'resolved' ? 'success' : complaint.status === 'rejected' ? 'danger' : 'warning' }, STATUS_LABELS[complaint.status] || complaint.status),
      React.createElement(Badge, { key: 'priority', variant: complaint.priority === 'critical' ? 'danger' : complaint.priority === 'urgent' ? 'warning' : 'default' }, PRIORITY_LABELS[complaint.priority] || complaint.priority),
    ]),
  ]),
  React.createElement('p', { key: 'desc', className: 'mt-4 line-clamp-2 text-sm leading-6 text-slate-600' }, complaint.description),
  to ? React.createElement(Link, { key: 'link', to, className: 'mt-5 inline-flex text-sm font-bold text-emerald-600 hover:text-emerald-500' }, 'Open details →') : null,
]);

export default ComplaintCard;