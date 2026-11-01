const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    const email = process.env.ADMIN_EMAIL || 'admin@fixkarachi.pk';
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
    const passwordHash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS || 10));

    await queryInterface.bulkInsert('users', [{
      id: require('crypto').randomUUID(),
      fullName: process.env.ADMIN_FULL_NAME || 'System Admin',
      email,
      phone: process.env.ADMIN_PHONE || null,
      passwordHash,
      role: 'admin',
      isBlocked: false,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { role: 'admin' }, {});
  },
};