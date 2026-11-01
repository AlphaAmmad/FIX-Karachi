import { PRIORITY_LABELS, STATUS_LABELS } from '../config/constants';

const normalizeApiList = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.rows)) return value.rows;
  return [];
};

const formatNumber = (value) => new Intl.NumberFormat('en-PK').format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-PK', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
};

const priorityLabel = (value) => PRIORITY_LABELS[value] || value || '—';
const statusLabel = (value) => STATUS_LABELS[value] || value || '—';

export {
  normalizeApiList,
  formatNumber,
  formatDate,
  priorityLabel,
  statusLabel,
};