const bcrypt = require('bcrypt');
const { User, Authority, Complaint } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { buildPagination, selectPublicComplaint } = require('../utils');
const notificationService = require('../services/notificationService');
const escalationService = require('../services/escalationService');
const analyticsService = require('../services/analyticsService');
const fakeReportService = require('../services/fakeReportService');

const listUsers = asyncHandler(async (req, res) => {
  const pagination = buildPagination(req.query.page, req.query.limit);
  const { count, rows } = await User.findAndCountAll({
    where: req.query.role ? { role: req.query.role } : {},
    attributes: { exclude: ['passwordHash'] },
    limit: pagination.limit,
    offset: pagination.offset,
    order: [['createdAt', 'DESC']],
  });

  res.json(new ApiResponse(200, 'Users fetched successfully', rows, { total: count, page: pagination.page, limit: pagination.limit }));
});

const listAuthorities = asyncHandler(async (req, res) => {
  const pagination = buildPagination(req.query.page, req.query.limit);
  const { count, rows } = await Authority.findAndCountAll({
    attributes: { exclude: ['passwordHash'] },
    limit: pagination.limit,
    offset: pagination.offset,
    order: [['createdAt', 'DESC']],
  });

  res.json(new ApiResponse(200, 'Authorities fetched successfully', rows, { total: count, page: pagination.page, limit: pagination.limit }));
});

const addAuthority = asyncHandler(async (req, res) => {
  const exists = await Authority.findOne({ where: { email: req.body.email } });
  if (exists) throw new ApiError(409, 'Authority email already exists');

  const passwordHash = await bcrypt.hash(req.body.password, Number(process.env.BCRYPT_SALT_ROUNDS || 10));
  const authority = await Authority.create({
    fullName: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    passwordHash,
    organization: req.body.organizationName,
    department: req.body.organizationName,
    parentAuthorityId: req.body.parentAuthorityId || null,
    createdByAdminId: req.auth.user.id,
  });

  res.status(201).json(new ApiResponse(201, 'Authority created successfully', { id: authority.id, fullName: authority.fullName, email: authority.email, organization: authority.organization }));
});

const blockUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  user.isBlocked = true;
  await user.save();
  res.json(new ApiResponse(200, 'User blocked successfully', { id: user.id, isBlocked: user.isBlocked }));
});

const unblockUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  user.isBlocked = false;
  await user.save();
  res.json(new ApiResponse(200, 'User unblocked successfully', { id: user.id, isBlocked: user.isBlocked }));
});

const blockAuthority = asyncHandler(async (req, res) => {
  const authority = await Authority.findByPk(req.params.id);
  if (!authority) throw new ApiError(404, 'Authority not found');
  authority.isBlocked = true;
  await authority.save();
  res.json(new ApiResponse(200, 'Authority blocked successfully', { id: authority.id, isBlocked: authority.isBlocked }));
});

const unblockAuthority = asyncHandler(async (req, res) => {
  const authority = await Authority.findByPk(req.params.id);
  if (!authority) throw new ApiError(404, 'Authority not found');
  authority.isBlocked = false;
  await authority.save();
  res.json(new ApiResponse(200, 'Authority unblocked successfully', { id: authority.id, isBlocked: authority.isBlocked }));
});

const deleteAuthority = asyncHandler(async (req, res) => {
  const authority = await Authority.findByPk(req.params.id);
  if (!authority) throw new ApiError(404, 'Authority not found');
  await authority.destroy();
  res.json(new ApiResponse(200, 'Authority deleted successfully', { id: req.params.id }));
});

const listComplaints = asyncHandler(async (req, res) => {
  const pagination = buildPagination(req.query.page, req.query.limit);
  const where = {};
  if (req.query.status) where.status = req.query.status;
  if (req.query.category) where.category = req.query.category;

  const { count, rows } = await Complaint.findAndCountAll({
    where,
    limit: pagination.limit,
    offset: pagination.offset,
    order: [['createdAt', 'DESC']],
  });

  res.json(new ApiResponse(200, 'Complaints fetched successfully', rows.map(selectPublicComplaint), { total: count, page: pagination.page, limit: pagination.limit }));
});

const listFakeReports = asyncHandler(async (req, res) => {
  const pagination = buildPagination(req.query.page, req.query.limit);
  const payload = await fakeReportService.listFakeReports({ pagination, filters: req.query });
  res.json(new ApiResponse(200, 'Fake reports fetched successfully', payload.rows, { total: payload.count, page: pagination.page, limit: pagination.limit }));
});

const reviewFakeReport = asyncHandler(async (req, res) => {
  const report = await fakeReportService.reviewFakeReport({
    reportId: req.params.id,
    adminId: req.auth.user.id,
    body: req.body,
  });
  res.json(new ApiResponse(200, 'Fake report reviewed successfully', report));
});

const broadcastNotifications = asyncHandler(async (req, res) => {
  const notification = await notificationService.broadcastNotification({
    title: req.body.title,
    message: req.body.message,
    eventType: 'admin_broadcast',
    payload: { adminId: req.auth.user.id },
  });
  res.status(201).json(new ApiResponse(201, 'Broadcast notification created successfully', notification));
});

const listEscalations = asyncHandler(async (req, res) => {
  const pagination = buildPagination(req.query.page, req.query.limit);
  const payload = await escalationService.listEscalations({ pagination, filters: req.query });
  res.json(new ApiResponse(200, 'Escalations fetched successfully', payload.rows, { total: payload.count, page: pagination.page, limit: pagination.limit }));
});

const reviewEscalation = asyncHandler(async (req, res) => {
  const escalation = await escalationService.reviewEscalation({ escalationId: req.params.id, adminId: req.auth.user.id, body: req.body });
  res.json(new ApiResponse(200, 'Escalation reviewed successfully', escalation));
});

const analytics = asyncHandler(async (_req, res) => {
  const [dashboard, categories, areas, performance, activeAreas] = await Promise.all([
    analyticsService.dashboardMetrics(),
    analyticsService.complaintsByCategory(),
    analyticsService.complaintsByArea(),
    analyticsService.authorityPerformance(),
    analyticsService.mostActiveAreas(),
  ]);

  res.json(new ApiResponse(200, 'Analytics fetched successfully', { dashboard, categories, areas, performance, activeAreas }));
});

module.exports = {
  listUsers,
  listAuthorities,
  addAuthority,
  blockUser,
  unblockUser,
  blockAuthority,
  unblockAuthority,
  deleteAuthority,
  listComplaints,
  broadcastNotifications,
  listEscalations,
  reviewEscalation,
  listFakeReports,
  reviewFakeReport,
  analytics,
};