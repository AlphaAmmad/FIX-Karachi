const { DataTypes, Model, Op } = require('sequelize');
const sequelize = require('../config/database');
const { ROLES, COMPLAINT_PRIORITIES, COMPLAINT_STATUSES, COMPLAINT_CATEGORIES } = require('../utils/constants');

class User extends Model {}
User.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    fullName: { type: DataTypes.STRING(150), allowNull: false },
    email: { type: DataTypes.STRING(191), allowNull: false, unique: true },
    phone: { type: DataTypes.STRING(30), allowNull: true, unique: true },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
    role: { type: DataTypes.ENUM(ROLES.CITIZEN, ROLES.ADMIN), allowNull: false, defaultValue: ROLES.CITIZEN },
    isBlocked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    lastLoginAt: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, tableName: 'users', modelName: 'User', timestamps: true }
);

class Authority extends Model {}
Authority.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    fullName: { type: DataTypes.STRING(150), allowNull: false },
    email: { type: DataTypes.STRING(191), allowNull: false, unique: true },
    phone: { type: DataTypes.STRING(30), allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
    organization: { type: DataTypes.STRING(120), allowNull: false },
    department: { type: DataTypes.STRING(120), allowNull: true },
    parentAuthorityId: { type: DataTypes.UUID, allowNull: true },
    createdByAdminId: { type: DataTypes.UUID, allowNull: true },
    isBlocked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    lastLoginAt: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, tableName: 'authorities', modelName: 'Authority', timestamps: true, paranoid: true }
);

class Complaint extends Model {}
Complaint.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    citizenId: { type: DataTypes.UUID, allowNull: false },
    assignedAuthorityId: { type: DataTypes.UUID, allowNull: true },
    assignedOrganization: { type: DataTypes.STRING(120), allowNull: false },
    title: { type: DataTypes.STRING(200), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    category: { type: DataTypes.ENUM(...Object.values(COMPLAINT_CATEGORIES)), allowNull: false },
    priority: { type: DataTypes.ENUM(...Object.values(COMPLAINT_PRIORITIES)), allowNull: false, defaultValue: COMPLAINT_PRIORITIES.NORMAL },
    status: { type: DataTypes.ENUM(...Object.values(COMPLAINT_STATUSES)), allowNull: false, defaultValue: COMPLAINT_STATUSES.PENDING },
    imagePath: { type: DataTypes.STRING(255), allowNull: false },
    proofImagePath: { type: DataTypes.STRING(255), allowNull: true },
    latitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
    longitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
    area: { type: DataTypes.STRING(160), allowNull: false },
    remarks: { type: DataTypes.TEXT, allowNull: true },
    escalated: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    resolvedAt: { type: DataTypes.DATE, allowNull: true },
    resolvedByAuthorityId: { type: DataTypes.UUID, allowNull: true },
    fakeReportsCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  { sequelize, tableName: 'complaints', modelName: 'Complaint', timestamps: true }
);

class ComplaintUpdate extends Model {}
ComplaintUpdate.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    complaintId: { type: DataTypes.UUID, allowNull: false },
    actorType: { type: DataTypes.STRING(30), allowNull: false },
    actorId: { type: DataTypes.UUID, allowNull: true },
    previousStatus: { type: DataTypes.STRING(40), allowNull: true },
    newStatus: { type: DataTypes.STRING(40), allowNull: true },
    remarks: { type: DataTypes.TEXT, allowNull: true },
    imagePath: { type: DataTypes.STRING(255), allowNull: true },
    metadata: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
  },
  { sequelize, tableName: 'complaint_updates', modelName: 'ComplaintUpdate', timestamps: true }
);

class Notification extends Model {}
Notification.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    recipientType: { type: DataTypes.STRING(30), allowNull: false },
    recipientKey: { type: DataTypes.STRING(120), allowNull: false },
    title: { type: DataTypes.STRING(200), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    eventType: { type: DataTypes.STRING(60), allowNull: false },
    payload: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
    isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { sequelize, tableName: 'notifications', modelName: 'Notification', timestamps: true }
);

class Escalation extends Model {}
Escalation.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    complaintId: { type: DataTypes.UUID, allowNull: false },
    citizenId: { type: DataTypes.UUID, allowNull: false },
    reason: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.ENUM('open', 'under_review', 'closed'), allowNull: false, defaultValue: 'open' },
    reviewedByAdminId: { type: DataTypes.UUID, allowNull: true },
    reviewNotes: { type: DataTypes.TEXT, allowNull: true },
    closedAt: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, tableName: 'escalations', modelName: 'Escalation', timestamps: true }
);

class FakeReport extends Model {}
FakeReport.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    complaintId: { type: DataTypes.UUID, allowNull: false },
    authorityId: { type: DataTypes.UUID, allowNull: true },
    reason: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.ENUM('open', 'reviewed', 'dismissed'), allowNull: false, defaultValue: 'open' },
    reviewedByAdminId: { type: DataTypes.UUID, allowNull: true },
    reviewNotes: { type: DataTypes.TEXT, allowNull: true },
  },
  { sequelize, tableName: 'fake_reports', modelName: 'FakeReport', timestamps: true }
);

User.hasMany(Complaint, { foreignKey: 'citizenId', as: 'complaints' });
Complaint.belongsTo(User, { foreignKey: 'citizenId', as: 'citizen' });

Authority.hasMany(Complaint, { foreignKey: 'assignedAuthorityId', as: 'assignedComplaints' });
Complaint.belongsTo(Authority, { foreignKey: 'assignedAuthorityId', as: 'assignedAuthority' });

Authority.hasMany(Authority, { foreignKey: 'parentAuthorityId', as: 'children' });
Authority.belongsTo(Authority, { foreignKey: 'parentAuthorityId', as: 'parent' });

Complaint.hasMany(ComplaintUpdate, { foreignKey: 'complaintId', as: 'updates' });
ComplaintUpdate.belongsTo(Complaint, { foreignKey: 'complaintId', as: 'complaint' });

Complaint.hasMany(Escalation, { foreignKey: 'complaintId', as: 'escalations' });
Escalation.belongsTo(Complaint, { foreignKey: 'complaintId', as: 'complaint' });

Complaint.hasMany(FakeReport, { foreignKey: 'complaintId', as: 'fakeReports' });
FakeReport.belongsTo(Complaint, { foreignKey: 'complaintId', as: 'complaint' });
FakeReport.belongsTo(Authority, { foreignKey: 'authorityId', as: 'authority' });

module.exports = {
  sequelize,
  Op,
  User,
  Authority,
  Complaint,
  ComplaintUpdate,
  Notification,
  Escalation,
  FakeReport,
  syncDatabase: async () => sequelize.sync({ alter: false }),
};