require('dotenv').config();

const runtimeConfig = require('./src/config');

const sslOptions = runtimeConfig.dbSsl ? { ssl: { require: true, rejectUnauthorized: false } } : {};

const base = runtimeConfig.databaseUrl
  ? {
      use_env_variable: 'DATABASE_URL',
      dialect: 'postgres',
      logging: false,
      dialectOptions: sslOptions,
    }
  : {
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'fix_karachi',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      dialect: 'postgres',
      logging: false,
      dialectOptions: sslOptions,
    };

module.exports = {
  development: base,
  test: { ...base, database: `${base.database}_test` },
  production: base,
};