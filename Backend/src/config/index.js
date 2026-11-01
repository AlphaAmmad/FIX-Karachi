require('dotenv').config();

const parseDatabaseUrl = (databaseUrl) => {
  if (!databaseUrl) return { databaseUrl: '', dbSsl: String(process.env.DB_SSL || 'false').toLowerCase() === 'true' };

  try {
    const url = new URL(databaseUrl);
    const sslMode = String(url.searchParams.get('sslmode') || '').toLowerCase();
    const sslEnabled = sslMode === 'require' || sslMode === 'verify-full' || url.searchParams.get('ssl') === 'true' || /neon\.tech$/i.test(url.hostname);
    return { databaseUrl, dbSsl: String(process.env.DB_SSL || sslEnabled).toLowerCase() === 'true' };
  } catch (_error) {
    return { databaseUrl, dbSsl: String(process.env.DB_SSL || 'false').toLowerCase() === 'true' };
  }
};

const { databaseUrl, dbSsl } = parseDatabaseUrl(process.env.DATABASE_URL || '');

const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  jwtSecret: process.env.JWT_SECRET || 'fix-karachi-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS || 10),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  databaseUrl,
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: Number(process.env.DB_PORT || 5432),
  dbName: process.env.DB_NAME || 'fix_karachi',
  dbUser: process.env.DB_USER || 'postgres',
  dbPassword: process.env.DB_PASSWORD || '',
  dbSsl,
  uploadBaseUrl: process.env.UPLOAD_BASE_URL || '',
};

module.exports = config;