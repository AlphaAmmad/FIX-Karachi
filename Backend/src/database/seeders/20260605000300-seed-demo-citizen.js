const bcrypt = require('bcrypt');

const DEMO_CITIZEN_EMAIL = 'citizen@fixkarachi.pk';

module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash(process.env.CITIZEN_SEED_PASSWORD || 'ChangeMe123!', Number(process.env.BCRYPT_SALT_ROUNDS || 10));
    const now = new Date();

    await queryInterface.bulkInsert('users', [{
      id: require('crypto').randomUUID(),
      fullName: process.env.CITIZEN_SEED_FULL_NAME || 'Demo Citizen',
      email: process.env.CITIZEN_SEED_EMAIL || DEMO_CITIZEN_EMAIL,
      phone: process.env.CITIZEN_SEED_PHONE || '03000000099',
      passwordHash,
      role: 'citizen',
      isBlocked: false,
      lastLoginAt: null,
      createdAt: now,
      updatedAt: now,
    }], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: DEMO_CITIZEN_EMAIL }, {});
  },
};
