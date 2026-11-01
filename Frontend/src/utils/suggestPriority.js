const CRITICAL_KEYWORDS = ['fire', 'flood', 'gas leak', 'accident', 'emergency', 'explosion'];
const URGENT_KEYWORDS = ['broken', 'damage', 'leakage', 'overflow', 'unsafe'];

const LABELS = { normal: 'Normal', urgent: 'Urgent', critical: 'Critical' };

export function suggestPriority(text = '') {
  const normalized = String(text).toLowerCase();
  if (CRITICAL_KEYWORDS.some((keyword) => normalized.includes(keyword))) return 'critical';
  if (URGENT_KEYWORDS.some((keyword) => normalized.includes(keyword))) return 'urgent';
  return 'normal';
}

export function suggestPriorityLabel(text = '') {
  return LABELS[suggestPriority(text)] || 'Normal';
}
