const bcrypt = require('bcrypt');
const { Authority, Complaint, FakeReport } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { buildPagination, selectAuthorityComplaint } = require('../utils');
const complaintService = require('../services/complaintService');
const notificationService = require('../services/notificationService');

const listAssignedComplaints = asyncHandler(async (req, res) => {
  const pagination = buildPagination(req.query.page, req.query.limit);
  const { count, rows } = await complaintService.getAuthorityComplaints({ authority: req.auth.authority, pagination, filters: req.query });
  res.json(new ApiResponse(200, 'Assigned complaints fetched successfully', rows.map(selectAuthorityComplaint), { total: count, page: pagination.page, limit: pagination.limit }));
});

const getAssignedComplaintDetails = asyncHandler(async (req, res) => {
  const complaint = await complaintService.getComplaintById({ complaintId: req.params.id, actor: { role: 'authority', organization: req.auth.authority.organization, id: req.auth.authority.id } });
  res.json(new ApiResponse(200, 'Complaint details fetched successfully', selectAuthorityComplaint(complaint)));
});

const updateComplaintStatus = asyncHandler(async (req, res) => {
  const complaint = await complaintService.updateComplaintStatus({ authority: req.auth.authority, complaintId: req.params.id, body: req.body, file: req.file || null });
  res.json(new ApiResponse(200, 'Complaint status updated successfully', complaint));
});

const createChildAuthority = asyncHandler(async (req, res) => {
  const existing = await Authority.findOne({ where: { email: req.body.email } });
  if (existing) throw new ApiError(409, 'Authority email already exists');

  const passwordHash = await bcrypt.hash(req.body.password, Number(process.env.BCRYPT_SALT_ROUNDS || 10));
  const authority = await Authority.create({
    fullName: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    passwordHash,
    organization: req.auth.authority.organization,
    department: req.body.organizationName,
    parentAuthorityId: req.auth.authority.id,
    createdByAdminId: null,
  });

  res.status(201).json(new ApiResponse(201, 'Child authority account created successfully', {
    id: authority.id,
    fullName: authority.fullName,
    email: authority.email,
    phone: authority.phone,
    organization: authority.organization,
    department: authority.department,
  }));
});

const reportFakeComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findByPk(req.body.complaintId);
  if (!complaint) throw new ApiError(404, 'Complaint not found');
  if (complaint.assignedOrganization !== req.auth.authority.organization) {
    throw new ApiError(403, 'You can only flag complaints assigned to your organization');
  }

  const report = await FakeReport.create({
    complaintId: req.body.complaintId,
    authorityId: req.auth.authority.id,
    reason: req.body.reason,
  });

  complaint.fakeReportsCount += 1;
  await complaint.save();

  await notificationService.createNotification({
    recipientType: 'admin',
    recipientKey: 'global',
    title: 'Fake complaint report submitted',
    message: `Authority reported complaint ${complaint.id} as fake.`,
    eventType: 'fake_report',
    payload: { reportId: report.id, complaintId: complaint.id },
  });

  res.status(201).json(new ApiResponse(201, 'Fake complaint report submitted successfully', report));
});

module.exports = {
  listAssignedComplaints,
  getAssignedComplaintDetails,
  updateComplaintStatus,
  createChildAuthority,
  reportFakeComplaint,
};