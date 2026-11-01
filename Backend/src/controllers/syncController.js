const { Op, Complaint, Notification, Escalation } = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { buildPagination } = require('../utils');

const getNotificationWhere = (auth) => {
  if (auth.user) {
    if (auth.user.role === 'admin') {
      return { [Op.or]: [{ recipientType: 'admin', recipientKey: 'global' }, { recipientType: 'broadcast', recipientKey: 'global' }] };
    }
    return { [Op.or]: [{ recipientType: 'citizen', recipientKey: auth.user.id }, { recipientType: 'broadcast', recipientKey: 'global' }] };
  }

  return { [Op.or]: [{ recipientType: 'authority', recipientKey: auth.authority.organization }, { recipientType: 'broadcast', recipientKey: 'global' }] };
};

const syncAll = asyncHandler(async (req, res) => {
  const pagination = buildPagination(req.query.page, req.query.limit);
  const updatedSince = req.query.updatedSince ? new Date(req.query.updatedSince) : null;

  const complaintWhere = {};
  if (updatedSince) complaintWhere.updatedAt = { [Op.gt]: updatedSince };
  if (req.auth.user && req.auth.user.role === 'citizen') complaintWhere.citizenId = req.auth.user.id;
  if (req.auth.user && req.auth.user.role === 'admin') {
    // admin sees all complaints
  }
  if (req.auth.authority) complaintWhere.assignedOrganization = req.auth.authority.organization;

  const notificationWhere = getNotificationWhere(req.auth);

  const complaintIds = req.auth.user && req.auth.user.role === 'admin'
    ? null
    : req.auth.authority
      ? (await Complaint.findAll({ where: { assignedOrganization: req.auth.authority.organization }, attributes: ['id'], raw: true })).map((item) => item.id)
      : (await Complaint.findAll({ where: { citizenId: req.auth.user.id }, attributes: ['id'], raw: true })).map((item) => item.id);

  const escalationWhere = {};
  if (updatedSince) escalationWhere.updatedAt = { [Op.gt]: updatedSince };
  if (req.auth.user && req.auth.user.role === 'citizen') escalationWhere.citizenId = req.auth.user.id;
  if (req.auth.authority && complaintIds) escalationWhere.complaintId = { [Op.in]: complaintIds };

  const [complaints, notifications, escalations] = await Promise.all([
    Complaint.findAndCountAll({ where: complaintWhere, limit: pagination.limit, offset: pagination.offset, order: [['updatedAt', 'DESC']] }),
    Notification.findAndCountAll({ where: notificationWhere, limit: pagination.limit, offset: pagination.offset, order: [['createdAt', 'DESC']] }),
    Escalation.findAndCountAll({ where: escalationWhere, limit: pagination.limit, offset: pagination.offset, order: [['updatedAt', 'DESC']] }),
  ]);

  res.json(new ApiResponse(200, 'Offline sync payload fetched successfully', {
    complaints: complaints.rows,
    notifications: notifications.rows,
    escalations: escalations.rows,
  }, {
    complaintsTotal: complaints.count,
    notificationsTotal: notifications.count,
    escalationsTotal: escalations.count,
    page: pagination.page,
    limit: pagination.limit,
  }));
});

module.exports = {
  syncAll,
};