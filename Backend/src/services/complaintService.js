const path = require('path');
const bcrypt = require('bcrypt');
const { Op, Complaint, ComplaintUpdate, Authority, Escalation } = require('../models');
const {
  ACTOR_TYPES,
  COMPLAINT_STATUSES,
  COMPLAINT_STATUS_FLOW,
  ESCALATION_STATUSES,
} = require('../utils/constants');
const ApiError = require('../utils/ApiError');
const { getAssignedOrganization } = require('../utils/assignment');
const { suggestPriority } = require('../utils/prioritization');
const notificationService = require('./notificationService');

const normalizeFilePath = (file) => (file ? path.posix.join('/uploads', path.basename(path.dirname(file.path)), path.basename(file.path)) : null);

const isValidStatusTransition = (fromStatus, toStatus) => {
  if (fromStatus === toStatus) return true;
  if (toStatus === COMPLAINT_STATUSES.RESOLVED) {
    return fromStatus !== COMPLAINT_STATUSES.RESOLVED && fromStatus !== COMPLAINT_STATUSES.REJECTED;
  }
  if (toStatus === COMPLAINT_STATUSES.REJECTED) {
    return fromStatus !== COMPLAINT_STATUSES.RESOLVED && fromStatus !== COMPLAINT_STATUSES.REJECTED;
  }
  const fromIndex = COMPLAINT_STATUS_FLOW.indexOf(fromStatus);
  const toIndex = COMPLAINT_STATUS_FLOW.indexOf(toStatus);
  if (fromIndex === -1 || toIndex === -1) return false;
  return toIndex > fromIndex;
};

const findAuthorityForOrganization = async (organization) => {
  const authority = await Authority.findOne({ where: { organization, isBlocked: false }, order: [['createdAt', 'ASC']] });
  return authority;
};

const createComplaint = async ({ user, body, file }) => {
  if (!file) {
    throw new ApiError(400, 'Complaint image is required');
  }

  const assignedOrganization = getAssignedOrganization(body.category);
  const assignedAuthority = await findAuthorityForOrganization(assignedOrganization);
  const imagePath = normalizeFilePath(file);
  const priority = body.priority
    ? body.priority
    : suggestPriority(`${body.title} ${body.description}`);

  const complaint = await Complaint.create({
    citizenId: user.id,
    assignedAuthorityId: assignedAuthority ? assignedAuthority.id : null,
    assignedOrganization,
    title: body.title,
    description: body.description,
    category: body.category,
    priority,
    status: COMPLAINT_STATUSES.PENDING,
    imagePath,
    latitude: body.latitude,
    longitude: body.longitude,
    area: body.area,
  });

  await ComplaintUpdate.create({
    complaintId: complaint.id,
    actorType: ACTOR_TYPES.SYSTEM,
    previousStatus: null,
    newStatus: COMPLAINT_STATUSES.PENDING,
    remarks: 'Complaint submitted',
    metadata: { category: body.category, priority, assignedOrganization },
  });

  await notificationService.createNotification({
    recipientType: 'citizen',
    recipientKey: user.id,
    title: 'Complaint submitted',
    message: `Your complaint "${body.title}" has been received and is pending review.`,
    eventType: 'complaint_submitted',
    payload: { complaintId: complaint.id },
  });

  if (assignedAuthority) {
    await notificationService.createNotification({
      recipientType: 'authority',
      recipientKey: assignedAuthority.organization,
      title: 'New complaint assigned',
      message: `A new complaint was assigned to ${assignedAuthority.organization}.`,
      eventType: 'complaint_assigned',
      payload: { complaintId: complaint.id, authorityId: assignedAuthority.id },
    });
  }

  return complaint;
};

const getCitizenComplaints = async ({ citizenId, pagination, filters = {} }) => {
  const where = { citizenId };
  if (filters.status) where.status = filters.status;
  if (filters.category) where.category = filters.category;

  const { count, rows } = await Complaint.findAndCountAll({
    where,
    limit: pagination.limit,
    offset: pagination.offset,
    order: [['createdAt', 'DESC']],
    include: [
      { model: ComplaintUpdate, as: 'updates', order: [['createdAt', 'ASC']] },
      { model: Authority, as: 'assignedAuthority', attributes: ['id', 'fullName', 'organization', 'department'] },
    ],
  });

  return { count, rows };
};

const getComplaintById = async ({ complaintId, actor }) => {
  const complaint = await Complaint.findByPk(complaintId, {
    include: [
      { model: ComplaintUpdate, as: 'updates', order: [['createdAt', 'ASC']] },
      { model: Authority, as: 'assignedAuthority', attributes: ['id', 'fullName', 'organization', 'department'] },
    ],
  });

  if (!complaint) throw new ApiError(404, 'Complaint not found');

  if (actor.role === 'citizen' && complaint.citizenId !== actor.id) throw new ApiError(403, 'Forbidden');
  if (actor.role === 'authority' && complaint.assignedOrganization !== actor.organization) throw new ApiError(403, 'Forbidden');
  return complaint;
};

const getAuthorityComplaints = async ({ authority, pagination, filters = {} }) => {
  const where = { assignedOrganization: authority.organization };
  if (filters.status) where.status = filters.status;
  if (filters.category) where.category = filters.category;
  if (filters.priority) where.priority = filters.priority;

  const { count, rows } = await Complaint.findAndCountAll({
    where,
    limit: pagination.limit,
    offset: pagination.offset,
    order: [['updatedAt', 'DESC']],
    include: [
      { model: ComplaintUpdate, as: 'updates', order: [['createdAt', 'ASC']] },
      { model: Authority, as: 'assignedAuthority', attributes: ['id', 'fullName', 'organization', 'department'] },
    ],
  });

  return { count, rows };
};

const updateComplaintStatus = async ({ authority, complaintId, body, file = null }) => {
  const complaint = await Complaint.findByPk(complaintId);
  if (!complaint) throw new ApiError(404, 'Complaint not found');
  if (complaint.assignedOrganization !== authority.organization) throw new ApiError(403, 'Forbidden');

  const previousStatus = complaint.status;

  if (!isValidStatusTransition(previousStatus, body.status)) {
    throw new ApiError(
      400,
      `Invalid status transition from "${previousStatus}" to "${body.status}". Follow the lifecycle: pending → under review → in progress → resolved.`
    );
  }

  if (body.status === COMPLAINT_STATUSES.RESOLVED && !file && !complaint.proofImagePath) {
    throw new ApiError(400, 'Resolution proof image is required to mark as resolved');
  }

  complaint.status = body.status;
  complaint.remarks = body.remarks || complaint.remarks;

  if (file) {
    complaint.proofImagePath = normalizeFilePath(file);
  }

  if (body.status === COMPLAINT_STATUSES.RESOLVED) {
    complaint.resolvedAt = new Date();
    complaint.resolvedByAuthorityId = authority.id;
  }

  await complaint.save();

  await ComplaintUpdate.create({
    complaintId: complaint.id,
    actorType: ACTOR_TYPES.AUTHORITY,
    actorId: authority.id,
    previousStatus,
    newStatus: body.status,
    remarks: body.remarks || null,
    imagePath: file ? normalizeFilePath(file) : null,
    metadata: { organization: authority.organization },
  });

  await notificationService.createNotification({
    recipientType: 'citizen',
    recipientKey: complaint.citizenId,
    title: 'Complaint status updated',
    message: `Your complaint "${complaint.title}" is now ${body.status}.`,
    eventType: 'status_changed',
    payload: { complaintId: complaint.id, status: body.status },
  });

  if (body.status === COMPLAINT_STATUSES.RESOLVED) {
    await notificationService.createNotification({
      recipientType: 'citizen',
      recipientKey: complaint.citizenId,
      title: 'Complaint resolved',
      message: `Your complaint "${complaint.title}" has been resolved.`,
      eventType: 'complaint_resolved',
      payload: { complaintId: complaint.id },
    });
  }

  return complaint;
};

const escalateComplaint = async ({ citizenId, complaintId, reason }) => {
  const complaint = await Complaint.findByPk(complaintId);
  if (!complaint) throw new ApiError(404, 'Complaint not found');
  if (complaint.citizenId !== citizenId) throw new ApiError(403, 'Forbidden');

  const existingEscalation = await Escalation.findOne({
    where: {
      complaintId,
      citizenId,
      status: [ESCALATION_STATUSES.OPEN, ESCALATION_STATUSES.UNDER_REVIEW],
    },
  });
  if (existingEscalation) {
    throw new ApiError(409, 'You have already escalated this complaint');
  }

  const escalation = await Escalation.create({ complaintId, citizenId, reason });
  complaint.escalated = true;
  await complaint.save();

  await ComplaintUpdate.create({
    complaintId,
    actorType: ACTOR_TYPES.CITIZEN,
    actorId: citizenId,
    remarks: reason,
    metadata: { escalationId: escalation.id },
  });

  await notificationService.createNotification({
    recipientType: 'admin',
    recipientKey: 'global',
    title: 'Escalation submitted',
    message: `Escalation submitted for complaint ${complaintId}.`,
    eventType: 'escalation_submitted',
    payload: { escalationId: escalation.id, complaintId },
  });

  return escalation;
};

const getComplaintTimeline = async (complaintId, actor) => {
  const complaint = await Complaint.findByPk(complaintId);
  if (!complaint) throw new ApiError(404, 'Complaint not found');
  if (actor.role === 'citizen' && complaint.citizenId !== actor.id) throw new ApiError(403, 'Forbidden');
  if (actor.role === 'authority' && complaint.assignedOrganization !== actor.organization) throw new ApiError(403, 'Forbidden');

  return ComplaintUpdate.findAll({ where: { complaintId }, order: [['createdAt', 'ASC']] });
};

const syncComplaints = async ({ actor, updatedSince, pagination }) => {
  const where = {};
  if (updatedSince) where.updatedAt = { [Op.gt]: new Date(updatedSince) };
  if (actor.role === 'citizen') where.citizenId = actor.id;
  if (actor.role === 'authority') where.assignedOrganization = actor.organization;

  const { count, rows } = await Complaint.findAndCountAll({
    where,
    limit: pagination.limit,
    offset: pagination.offset,
    order: [['updatedAt', 'DESC']],
  });

  return { count, rows };
};

module.exports = {
  createComplaint,
  getCitizenComplaints,
  getComplaintById,
  getAuthorityComplaints,
  updateComplaintStatus,
  escalateComplaint,
  getComplaintTimeline,
  syncComplaints,
};