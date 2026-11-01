const { COMPLAINT_PRIORITIES } = require('./constants');

const CRITICAL_KEYWORDS = ['fire', 'flood', 'gas leak', 'accident', 'emergency', 'explosion'];
const URGENT_KEYWORDS = ['broken', 'damage', 'leakage', 'overflow', 'unsafe'];

const suggestPriority = (text = '') => {
  const normalized = String(text).toLowerCase();

  if (CRITICAL_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return COMPLAINT_PRIORITIES.CRITICAL;
  }
  if (URGENT_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return COMPLAINT_PRIORITIES.URGENT;
  }
  return COMPLAINT_PRIORITIES.NORMAL;
};

module.exports = {
  suggestPriority,
};
