export const ROLES = {
  CITIZEN: 'citizen',
  AUTHORITY: 'authority',
  ADMIN: 'admin',
};

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  TRANSPARENCY: '/dashboard',
  LOGIN: '/login',
  REGISTER: '/register',
};

// Must match backend COMPLAINT_CATEGORIES exactly
export const CATEGORIES = [
  'Garbage',
  'Road Damage',
  'Electricity',
  'Fire',
  'Water Leakage',
  'Traffic Issue',
];

// Must match backend COMPLAINT_PRIORITIES exactly
export const PRIORITIES = ['normal', 'urgent', 'critical'];

export const PRIORITY_LABELS = {
  normal: 'Normal',
  urgent: 'Urgent',
  critical: 'Critical',
};

export const STATUS_STEPS = ['pending', 'under_review', 'in_progress', 'resolved', 'rejected'];

export const STATUS_LABELS = {
  pending: 'Pending',
  under_review: 'Under Review',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  rejected: 'Rejected',
};

// Category → Organization mapping (mirrors backend)
export const CATEGORY_TO_ORG = {
  Garbage: 'KMC',
  'Road Damage': 'KMC',
  Electricity: 'KE',
  Fire: 'Fire Brigade',
  'Water Leakage': 'Water Board',
  'Traffic Issue': 'Traffic Police',
};