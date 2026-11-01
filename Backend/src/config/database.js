const { Sequelize } = require('sequelize');
const config = require('./index');

const sslOptions = config.dbSsl ? { ssl: { require: true, rejectUnauthorized: false } } : {};

const sequelize = config.databaseUrl
  ? new Sequelize(config.databaseUrl, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: sslOptions,
    })
  : new Sequelize(config.dbName, config.dbUser, config.dbPassword, {
      host: config.dbHost,
      port: config.dbPort,
      dialect: 'postgres',
      logging: false,
      dialectOptions: sslOptions,
    });

module.exports = sequelize;