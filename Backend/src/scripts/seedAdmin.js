const bcrypt = require('bcrypt');
const sequelize = require('../config/database');
const { User } = require('../models');
const { ROLES } = require('../utils/constants');

const run = async () => {
  try {
    await sequelize.authenticate();

    const email = process.env.ADMIN_EMAIL || 'admin@fixkarachi.pk';
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
    const passwordHash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS || 10));
    const [admin, created] = await User.findOrCreate({
      where: { email, role: ROLES.ADMIN },
      defaults: {
        fullName: process.env.ADMIN_FULL_NAME || 'System Admin',
        email,
        phone: process.env.ADMIN_PHONE || null,
        passwordHash,
        role: ROLES.ADMIN,
      },
    });

    if (!created) {
      console.log('Admin already exists');
      process.exit(0);
    }

    console.log('Admin seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();