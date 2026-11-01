const ApiError = require('./ApiError');
const ApiResponse = require('./ApiResponse');
const asyncHandler = require('./asyncHandler');
const { signToken } = require('./token');
const { getAssignedOrganization } = require('./assignment');
const {
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
} = require('./constants');

const buildPagination = (page = 1, limit = 20) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  return { page: safePage, limit: safeLimit, offset: (safePage - 1) * safeLimit };
};

const selectCitizenComplaint = (complaint) => (complaint?.toJSON ? complaint.toJSON() : complaint);

const selectAuthorityComplaint = (complaint) => {
  const plain = complaint?.toJSON ? complaint.toJSON() : complaint;
  if (!plain) return plain;
  const { citizen, ...rest } = plain;
  return rest;
};

const selectPublicComplaint = (complaint) => {
  const plain = complaint?.toJSON ? complaint.toJSON() : complaint;
  if (!plain) return plain;
  const { citizen, imagePath, proofImagePath, ...rest } = plain;
  return rest;
};

module.exports = {
  ApiError,
  ApiResponse,
  asyncHandler,
  signToken,
  getAssignedOrganization,
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
  buildPagination,
  selectCitizenComplaint,
  selectAuthorityComplaint,
  selectPublicComplaint,
};