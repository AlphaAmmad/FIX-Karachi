const ROLES = Object.freeze({
  CITIZEN: 'citizen',
  AUTHORITY: 'authority',
  ADMIN: 'admin',
});

const AUTH_ACCOUNT_TYPES = Object.freeze({
  USER: 'user',
  AUTHORITY: 'authority',
});

const COMPLAINT_CATEGORIES = Object.freeze({
  GARBAGE: 'Garbage',
  ROAD_DAMAGE: 'Road Damage',
  ELECTRICITY: 'Electricity',
  FIRE: 'Fire',
  WATER_LEAKAGE: 'Water Leakage',
  TRAFFIC_ISSUE: 'Traffic Issue',
});

const COMPLAINT_PRIORITIES = Object.freeze({
  NORMAL: 'normal',
  URGENT: 'urgent',
  CRITICAL: 'critical',
});

const COMPLAINT_STATUSES = Object.freeze({
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
});

const ESCALATION_STATUSES = Object.freeze({
  OPEN: 'open',
  UNDER_REVIEW: 'under_review',
  CLOSED: 'closed',
});

const FAKE_REPORT_STATUSES = Object.freeze({
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  CONFIRMED_FAKE: 'confirmed_fake',
  DISMISSED: 'dismissed',
});

const NOTIFICATION_TYPES = Object.freeze({
  COMPLAINT_SUBMITTED: 'complaint_submitted',
  COMPLAINT_ASSIGNED: 'complaint_assigned',
  STATUS_CHANGED: 'status_changed',
  COMPLAINT_RESOLVED: 'complaint_resolved',
  ESCALATION_SUBMITTED: 'escalation_submitted',
  ADMIN_BROADCAST: 'admin_broadcast',
});

const NOTIFICATION_RECIPIENT_TYPES = Object.freeze({
  CITIZEN: 'citizen',
  AUTHORITY: 'authority',
  ADMIN: 'admin',
  BROADCAST: 'broadcast',
});

const ACTOR_TYPES = Object.freeze({
  CITIZEN: 'citizen',
  AUTHORITY: 'authority',
  ADMIN: 'admin',
  SYSTEM: 'system',
});

const CATEGORY_TO_AUTHORITY = Object.freeze({
  [COMPLAINT_CATEGORIES.GARBAGE]: 'KMC',
  [COMPLAINT_CATEGORIES.ROAD_DAMAGE]: 'KMC',
  [COMPLAINT_CATEGORIES.ELECTRICITY]: 'KE',
  [COMPLAINT_CATEGORIES.FIRE]: 'Fire Brigade',
  [COMPLAINT_CATEGORIES.WATER_LEAKAGE]: 'Water Board',
  [COMPLAINT_CATEGORIES.TRAFFIC_ISSUE]: 'Traffic Police',
});

const AUTHORITY_ORGANIZATIONS = Object.freeze([
  'KMC',
  'KE',
  'Fire Brigade',
  'Water Board',
  'Traffic Police',
]);

const COMPLAINT_STATUS_FLOW = Object.freeze([
  COMPLAINT_STATUSES.PENDING,
  COMPLAINT_STATUSES.UNDER_REVIEW,
  COMPLAINT_STATUSES.IN_PROGRESS,
  COMPLAINT_STATUSES.RESOLVED,
  COMPLAINT_STATUSES.REJECTED,
]);

module.exports = {
  ROLES,
  AUTH_ACCOUNT_TYPES,
  COMPLAINT_CATEGORIES,
  COMPLAINT_PRIORITIES,
  COMPLAINT_STATUSES,
  COMPLAINT_STATUS_FLOW,
  ESCALATION_STATUSES,
  FAKE_REPORT_STATUSES,
  NOTIFICATION_TYPES,
  NOTIFICATION_RECIPIENT_TYPES,
  ACTOR_TYPES,
  CATEGORY_TO_AUTHORITY,
  AUTHORITY_ORGANIZATIONS,
};