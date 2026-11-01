const { Op, Notification } = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { buildPagination } = require('../utils');

const recipientFilterFor = (auth) => {
  if (auth.user) {
    return auth.user.role === 'admin'
      ? { [Op.or]: [{ recipientType: 'admin', recipientKey: 'global' }, { recipientType: 'broadcast', recipientKey: 'global' }] }
      : { [Op.or]: [{ recipientType: 'citizen', recipientKey: auth.user.id }, { recipientType: 'broadcast', recipientKey: 'global' }] };
  }

  return {
    [Op.or]: [
      { recipientType: 'authority', recipientKey: auth.authority.organization },
      { recipientType: 'broadcast', recipientKey: 'global' },
    ],
  };
};

const listNotifications = asyncHandler(async (req, res) => {
  const pagination = buildPagination(req.query.page, req.query.limit);
  const where = recipientFilterFor(req.auth);
  const { count, rows } = await Notification.findAndCountAll({
    where,
    limit: pagination.limit,
    offset: pagination.offset,
    order: [['createdAt', 'DESC']],
  });
  res.json(new ApiResponse(200, 'Notifications fetched successfully', rows, { total: count, page: pagination.page, limit: pagination.limit }));
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findByPk(req.params.id);
  if (!notification) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }

  const isCitizenOwner = req.auth.user && req.auth.user.role !== 'admin' && notification.recipientType === 'citizen' && notification.recipientKey === req.auth.user.id;
  const isAdminOwner = req.auth.user && req.auth.user.role === 'admin' && (notification.recipientType === 'admin' || notification.recipientType === 'broadcast');
  const isAuthorityOwner = req.auth.authority && notification.recipientType === 'authority' && notification.recipientKey === req.auth.authority.organization;

  if (!isCitizenOwner && !isAdminOwner && !isAuthorityOwner) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  notification.isRead = true;
  await notification.save();
  res.json(new ApiResponse(200, 'Notification marked as read', notification));
});

const unreadCount = asyncHandler(async (req, res) => {
  const where = recipientFilterFor(req.auth);
  const count = await Notification.count({ where: { ...where, isRead: false } });
  res.json(new ApiResponse(200, 'Unread notifications fetched successfully', { count }));
});

module.exports = {
  listNotifications,
  markAsRead,
  unreadCount,
};