const { Complaint } = require('../models');
const { buildPagination, selectCitizenComplaint, selectAuthorityComplaint, selectPublicComplaint, ROLES } = require('../utils');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const complaintService = require('../services/complaintService');

const createComplaint = asyncHandler(async (req, res) => {
  const complaint = await complaintService.createComplaint({ user: req.auth.user, body: req.body, file: req.file });
  res.status(201).json(new ApiResponse(201, 'Complaint created successfully', complaint));
});

const listOwnComplaints = asyncHandler(async (req, res) => {
  const pagination = buildPagination(req.query.page, req.query.limit);
  const { count, rows } = await complaintService.getCitizenComplaints({ citizenId: req.auth.user.id, pagination, filters: req.query });
  res.json(new ApiResponse(200, 'Citizen complaints fetched successfully', rows.map(selectCitizenComplaint), { total: count, page: pagination.page, limit: pagination.limit }));
});

const getComplaintDetails = asyncHandler(async (req, res) => {
  const actor = req.auth.user || req.auth.authority;
  const complaint = await complaintService.getComplaintById({ complaintId: req.params.id, actor });
  res.json(new ApiResponse(200, 'Complaint details fetched successfully', selectCitizenComplaint(complaint)));
});

const escalateComplaint = asyncHandler(async (req, res) => {
  const escalation = await complaintService.escalateComplaint({ citizenId: req.auth.user.id, complaintId: req.params.id, reason: req.body.reason });
  res.status(201).json(new ApiResponse(201, 'Complaint escalated successfully', escalation));
});

const complaintTimeline = asyncHandler(async (req, res) => {
  const actor = req.auth.user || req.auth.authority;
  const timeline = await complaintService.getComplaintTimeline(req.params.id, actor);
  res.json(new ApiResponse(200, 'Complaint timeline fetched successfully', timeline));
});

const syncComplaints = asyncHandler(async (req, res) => {
  const actor = req.auth.user || req.auth.authority;
  const pagination = buildPagination(req.query.page, req.query.limit);
  const payload = await complaintService.syncComplaints({ actor, updatedSince: req.query.updatedSince, pagination });
  res.json(new ApiResponse(200, 'Complaint sync payload fetched successfully', payload.rows.map((item) => (actor.role === ROLES.AUTHORITY ? selectAuthorityComplaint(item) : selectCitizenComplaint(item))), { total: payload.count, page: pagination.page, limit: pagination.limit }));
});

module.exports = {
  createComplaint,
  listOwnComplaints,
  getComplaintDetails,
  escalateComplaint,
  complaintTimeline,
  syncComplaints,
};