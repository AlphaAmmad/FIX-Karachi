const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

const organizations = [
  { organization: 'KMC', email: 'kmc@fixkarachi.pk', phone: '03000000001' },
  { organization: 'KE', email: 'ke@fixkarachi.pk', phone: '03000000002' },
  { organization: 'Fire Brigade', email: 'firebrigade@fixkarachi.pk', phone: '03000000003' },
  { organization: 'Water Board', email: 'waterboard@fixkarachi.pk', phone: '03000000004' },
  { organization: 'Traffic Police', email: 'trafficpolice@fixkarachi.pk', phone: '03000000005' },
];

module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash(process.env.AUTHORITY_SEED_PASSWORD || 'ChangeMe123!', Number(process.env.BCRYPT_SALT_ROUNDS || 10));
    const now = new Date();

    await queryInterface.bulkInsert(
      'authorities',
      organizations.map((entry) => ({
        id: require('crypto').randomUUID(),
        fullName: `${entry.organization} Root Authority`,
        email: entry.email,
        phone: entry.phone,
        passwordHash,
        organization: entry.organization,
        department: entry.organization,
        parentAuthorityId: null,
        createdByAdminId: null,
        isBlocked: false,
        lastLoginAt: null,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      })),
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('authorities', {
      email: { [Op.in]: ['kmc@fixkarachi.pk', 'ke@fixkarachi.pk', 'firebrigade@fixkarachi.pk', 'waterboard@fixkarachi.pk', 'trafficpolice@fixkarachi.pk'] },
    }, {});
  },
};