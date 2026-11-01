const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('users', {
      id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
      fullName: { type: DataTypes.STRING(150), allowNull: false },
      email: { type: DataTypes.STRING(191), allowNull: false, unique: true },
      phone: { type: DataTypes.STRING(30), allowNull: true, unique: true },
      passwordHash: { type: DataTypes.STRING(255), allowNull: false },
      role: { type: DataTypes.ENUM('citizen', 'admin'), allowNull: false, defaultValue: 'citizen' },
      isBlocked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      lastLoginAt: { type: DataTypes.DATE, allowNull: true },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    });

    await queryInterface.createTable('authorities', {
      id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
      fullName: { type: DataTypes.STRING(150), allowNull: false },
      email: { type: DataTypes.STRING(191), allowNull: false, unique: true },
      phone: { type: DataTypes.STRING(30), allowNull: false, unique: true },
      passwordHash: { type: DataTypes.STRING(255), allowNull: false },
      organization: { type: DataTypes.STRING(120), allowNull: false },
      department: { type: DataTypes.STRING(120), allowNull: true },
      parentAuthorityId: { type: DataTypes.UUID, allowNull: true, references: { model: 'authorities', key: 'id' }, onDelete: 'SET NULL', onUpdate: 'CASCADE' },
      createdByAdminId: { type: DataTypes.UUID, allowNull: true, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL', onUpdate: 'CASCADE' },
      isBlocked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      lastLoginAt: { type: DataTypes.DATE, allowNull: true },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    });

    await queryInterface.createTable('complaints', {
      id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
      citizenId: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      assignedAuthorityId: { type: DataTypes.UUID, allowNull: true, references: { model: 'authorities', key: 'id' }, onDelete: 'SET NULL', onUpdate: 'CASCADE' },
      assignedOrganization: { type: DataTypes.STRING(120), allowNull: false },
      title: { type: DataTypes.STRING(200), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      category: { type: DataTypes.ENUM('Garbage', 'Road Damage', 'Electricity', 'Fire', 'Water Leakage', 'Traffic Issue'), allowNull: false },
      priority: { type: DataTypes.ENUM('normal', 'urgent', 'critical'), allowNull: false, defaultValue: 'normal' },
      status: { type: DataTypes.ENUM('pending', 'under_review', 'in_progress', 'resolved', 'rejected'), allowNull: false, defaultValue: 'pending' },
      imagePath: { type: DataTypes.STRING(255), allowNull: false },
      proofImagePath: { type: DataTypes.STRING(255), allowNull: true },
      latitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
      longitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
      area: { type: DataTypes.STRING(160), allowNull: false },
      remarks: { type: DataTypes.TEXT, allowNull: true },
      escalated: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      resolvedAt: { type: DataTypes.DATE, allowNull: true },
      resolvedByAuthorityId: { type: DataTypes.UUID, allowNull: true, references: { model: 'authorities', key: 'id' }, onDelete: 'SET NULL', onUpdate: 'CASCADE' },
      fakeReportsCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    });

    await queryInterface.createTable('complaint_updates', {
      id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
      complaintId: { type: DataTypes.UUID, allowNull: false, references: { model: 'complaints', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      actorType: { type: DataTypes.STRING(30), allowNull: false },
      actorId: { type: DataTypes.UUID, allowNull: true },
      previousStatus: { type: DataTypes.STRING(40), allowNull: true },
      newStatus: { type: DataTypes.STRING(40), allowNull: true },
      remarks: { type: DataTypes.TEXT, allowNull: true },
      imagePath: { type: DataTypes.STRING(255), allowNull: true },
      metadata: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    });

    await queryInterface.createTable('notifications', {
      id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
      recipientType: { type: DataTypes.STRING(30), allowNull: false },
      recipientKey: { type: DataTypes.STRING(120), allowNull: false },
      title: { type: DataTypes.STRING(200), allowNull: false },
      message: { type: DataTypes.TEXT, allowNull: false },
      eventType: { type: DataTypes.STRING(60), allowNull: false },
      payload: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
      isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    });

    await queryInterface.createTable('escalations', {
      id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
      complaintId: { type: DataTypes.UUID, allowNull: false, references: { model: 'complaints', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      citizenId: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      reason: { type: DataTypes.TEXT, allowNull: false },
      status: { type: DataTypes.ENUM('open', 'under_review', 'closed'), allowNull: false, defaultValue: 'open' },
      reviewedByAdminId: { type: DataTypes.UUID, allowNull: true, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL', onUpdate: 'CASCADE' },
      reviewNotes: { type: DataTypes.TEXT, allowNull: true },
      closedAt: { type: DataTypes.DATE, allowNull: true },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    });

    await queryInterface.createTable('fake_reports', {
      id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
      complaintId: { type: DataTypes.UUID, allowNull: false, references: { model: 'complaints', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      authorityId: { type: DataTypes.UUID, allowNull: true, references: { model: 'authorities', key: 'id' }, onDelete: 'SET NULL', onUpdate: 'CASCADE' },
      reason: { type: DataTypes.TEXT, allowNull: false },
      status: { type: DataTypes.ENUM('open', 'reviewed', 'dismissed'), allowNull: false, defaultValue: 'open' },
      reviewedByAdminId: { type: DataTypes.UUID, allowNull: true, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL', onUpdate: 'CASCADE' },
      reviewNotes: { type: DataTypes.TEXT, allowNull: true },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    });

    await queryInterface.addIndex('complaints', ['citizenId']);
    await queryInterface.addIndex('complaints', ['assignedOrganization']);
    await queryInterface.addIndex('complaints', ['status']);
    await queryInterface.addIndex('complaints', ['category']);
    await queryInterface.addIndex('complaints', ['area']);
    await queryInterface.addIndex('notifications', ['recipientType', 'recipientKey']);
    await queryInterface.addIndex('escalations', ['status']);
    await queryInterface.addIndex('fake_reports', ['status']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('fake_reports');
    await queryInterface.dropTable('escalations');
    await queryInterface.dropTable('notifications');
    await queryInterface.dropTable('complaint_updates');
    await queryInterface.dropTable('complaints');
    await queryInterface.dropTable('authorities');
    await queryInterface.dropTable('users');

    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_complaints_category";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_complaints_priority";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_complaints_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_escalations_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_fake_reports_status";');
  },
};