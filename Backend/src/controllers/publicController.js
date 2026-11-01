const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const analyticsService = require('../services/analyticsService');
const { Complaint } = require('../models');
const { selectPublicComplaint } = require('../utils');

const dashboard = asyncHandler(async (_req, res) => {
  const [total, resolved, pending, inProgress, categoryStats] = await Promise.all([
    analyticsService.totalComplaints(),
    analyticsService.resolvedComplaints(),
    analyticsService.pendingComplaints(),
    analyticsService.inProgressComplaints(),
    analyticsService.complaintsByCategory(),
  ]);

  res.json(new ApiResponse(200, 'Public dashboard metrics fetched successfully', { total, resolved, pending, inProgress, categoryStats }));
});

const recentComplaints = asyncHandler(async (_req, res) => {
  const rows = await Complaint.findAll({ order: [['createdAt', 'DESC']], limit: 10 });
  res.json(new ApiResponse(200, 'Recent complaints fetched successfully', rows.map(selectPublicComplaint)));
});

const categoryStats = asyncHandler(async (_req, res) => {
  const categories = await analyticsService.complaintsByCategory();
  res.json(new ApiResponse(200, 'Category statistics fetched successfully', categories));
});

module.exports = {
  dashboard,
  recentComplaints,
  categoryStats,
};