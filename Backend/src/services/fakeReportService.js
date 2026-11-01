const { FakeReport, Complaint, Authority } = require('../models');
const ApiError = require('../utils/ApiError');

const listFakeReports = async ({ pagination, filters = {} }) => {
  const where = {};
  if (filters.status) where.status = filters.status;

  const { count, rows } = await FakeReport.findAndCountAll({
    where,
    limit: pagination.limit,
    offset: pagination.offset,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: Complaint,
        as: 'complaint',
        attributes: ['id', 'title', 'category', 'assignedOrganization', 'status'],
      },
      {
        model: Authority,
        as: 'authority',
        attributes: ['id', 'fullName', 'organization', 'email'],
      },
    ],
  });

  return { count, rows };
};

const reviewFakeReport = async ({ reportId, adminId, body }) => {
  const report = await FakeReport.findByPk(reportId);
  if (!report) throw new ApiError(404, 'Fake report not found');

  report.status = body.status;
  report.reviewedByAdminId = adminId;
  report.reviewNotes = body.reviewNotes || null;
  await report.save();

  return report;
};

module.exports = {
  listFakeReports,
  reviewFakeReport,
};
