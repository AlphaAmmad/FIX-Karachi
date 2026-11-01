const Joi = require('joi');
const { COMPLAINT_CATEGORIES, COMPLAINT_PRIORITIES, COMPLAINT_STATUSES, ESCALATION_STATUSES } = require('../utils/constants');

const registerSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().trim().min(7).max(25).optional().allow(null, ''),
  password: Joi.string().min(8).max(128).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const createComplaintSchema = Joi.object({
  title: Joi.string().trim().min(3).max(160).required(),
  description: Joi.string().trim().min(10).max(2000).required(),
  category: Joi.string().valid(...Object.values(COMPLAINT_CATEGORIES)).required(),
  priority: Joi.string().valid(...Object.values(COMPLAINT_PRIORITIES)).required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  area: Joi.string().trim().max(160).required(),
});

const updateComplaintStatusSchema = Joi.object({
  status: Joi.string().valid(...Object.values(COMPLAINT_STATUSES)).required(),
  remarks: Joi.string().trim().max(2000).allow('', null),
});

const escalationSchema = Joi.object({
  complaintId: Joi.string().uuid().required(),
  reason: Joi.string().trim().min(10).max(2000).required(),
});

const adminBroadcastSchema = Joi.object({
  title: Joi.string().trim().min(3).max(160).required(),
  message: Joi.string().trim().min(5).max(4000).required(),
});

const authorityCreateSchema = Joi.object({
  organizationName: Joi.string().trim().min(2).max(120).required(),
  name: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().trim().min(7).max(25).required(),
  password: Joi.string().min(8).max(128).required(),
  parentAuthorityId: Joi.string().uuid().allow(null, ''),
});

const fakeReportSchema = Joi.object({
  complaintId: Joi.string().uuid().required(),
  reason: Joi.string().trim().min(10).max(2000).required(),
});

const reviewEscalationSchema = Joi.object({
  status: Joi.string().valid(...Object.values(ESCALATION_STATUSES)).required(),
  adminRemarks: Joi.string().trim().max(2000).allow('', null),
});

const reviewFakeReportSchema = Joi.object({
  status: Joi.string().valid('reviewed', 'dismissed').required(),
  reviewNotes: Joi.string().trim().max(2000).allow('', null),
});

module.exports = {
  registerSchema,
  loginSchema,
  createComplaintSchema,
  updateComplaintStatusSchema,
  escalationSchema,
  adminBroadcastSchema,
  authorityCreateSchema,
  fakeReportSchema,
  reviewEscalationSchema,
  reviewFakeReportSchema,
};