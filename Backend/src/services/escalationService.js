const { Escalation } = require('../models');
const ApiError = require('../utils/ApiError');

const listEscalations = async ({ pagination, filters = {} }) => {
  const where = {};
  if (filters.status) where.status = filters.status;
  if (filters.complaintId) where.complaintId = filters.complaintId;

  const { count, rows } = await Escalation.findAndCountAll({
    where,
    limit: pagination.limit,
    offset: pagination.offset,
    order: [['createdAt', 'DESC']],
  });

  return { count, rows };
};

const reviewEscalation = async ({ escalationId, adminId, body }) => {
  const escalation = await Escalation.findByPk(escalationId);
  if (!escalation) throw new ApiError(404, 'Escalation not found');

  escalation.status = body.status;
  escalation.reviewedByAdminId = adminId;
  escalation.reviewNotes = body.adminRemarks || null;
  if (body.status === 'closed') escalation.closedAt = new Date();
  await escalation.save();

  return escalation;
};

module.exports = {
  listEscalations,
  reviewEscalation,
};