const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const { AUTH_ACCOUNT_TYPES, ROLES } = require('../utils/constants');
const { User, Authority } = require('../models');

const readToken = (req) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return header.slice(7);
  }
  return req.cookies?.token || null;
};

const authenticate = async (req, _res, next) => {
  try {
    const token = readToken(req);
    if (!token) {
      throw new ApiError(401, 'Authentication token missing');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.accountType === AUTH_ACCOUNT_TYPES.AUTHORITY) {
      const authority = await Authority.findByPk(decoded.id);
      if (!authority || authority.isBlocked) {
        throw new ApiError(401, 'Authority account not available');
      }
      req.auth = { accountType: AUTH_ACCOUNT_TYPES.AUTHORITY, authority };
    } else {
      const user = await User.findByPk(decoded.id);
      if (!user || user.isBlocked) {
        throw new ApiError(401, 'User account not available');
      }
      req.auth = { accountType: AUTH_ACCOUNT_TYPES.USER, user };
    }

    next();
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(401, 'Invalid or expired token'));
  }
};

const requireRole = (...allowedRoles) => (req, _res, next) => {
  const role = req.auth?.user?.role;
  if (!req.auth?.user || !allowedRoles.includes(role)) {
    return next(new ApiError(403, 'Forbidden'));
  }
  next();
};

const requireAuthority = (req, _res, next) => {
  if (!req.auth?.authority) {
    return next(new ApiError(403, 'Authority access required'));
  }
  next();
};

const requireAdmin = (req, _res, next) => {
  if (!req.auth?.user || req.auth.user.role !== ROLES.ADMIN) {
    return next(new ApiError(403, 'Admin access required'));
  }
  next();
};

module.exports = {
  authenticate,
  requireRole,
  requireAuthority,
  requireAdmin,
};