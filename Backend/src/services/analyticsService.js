const { Sequelize } = require('sequelize');
const { Complaint, Escalation } = require('../models');

const totalComplaints = () => Complaint.count();
const pendingComplaints = () => Complaint.count({ where: { status: 'pending' } });
const resolvedComplaints = () => Complaint.count({ where: { status: 'resolved' } });
const inProgressComplaints = () => Complaint.count({ where: { status: 'in_progress' } });

const complaintsByCategory = () =>
  Complaint.findAll({
    attributes: ['category', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
    group: ['category'],
    order: [[Sequelize.literal('count'), 'DESC']],
    raw: true,
  });

const complaintsByArea = () =>
  Complaint.findAll({
    attributes: ['area', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
    group: ['area'],
    order: [[Sequelize.literal('count'), 'DESC']],
    raw: true,
  });

const authorityPerformance = () =>
  Complaint.findAll({
    attributes: [
      'assignedOrganization',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalComplaints'],
      [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN status = 'resolved' THEN 1 ELSE 0 END")), 'resolvedComplaints'],
    ],
    group: ['assignedOrganization'],
    raw: true,
  });

const mostActiveAreas = () =>
  Complaint.findAll({
    attributes: ['area', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
    group: ['area'],
    order: [[Sequelize.literal('count'), 'DESC']],
    limit: 10,
    raw: true,
  });

const totalEscalations = () => Escalation.count();

const dashboardMetrics = async () => {
  const [total, pending, resolved, totalEscalationsCount, byCategory] = await Promise.all([
    totalComplaints(),
    pendingComplaints(),
    resolvedComplaints(),
    totalEscalations(),
    complaintsByCategory(),
  ]);
  return {
    total,
    totalComplaints: total,
    pending,
    resolved,
    totalEscalations: totalEscalationsCount,
    byCategory,
  };
};

module.exports = {
  totalComplaints,
  pendingComplaints,
  resolvedComplaints,
  inProgressComplaints,
  complaintsByCategory,
  complaintsByArea,
  authorityPerformance,
  mostActiveAreas,
  totalEscalations,
  dashboardMetrics,
};