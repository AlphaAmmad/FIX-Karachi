const bcrypt = require('bcrypt');
const { User, Authority } = require('../models');
const { ROLES, AUTH_ACCOUNT_TYPES } = require('../utils/constants');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { signToken } = require('../utils/token');

const buildAuthPayload = (accountType, account) => ({
  id: account.id,
  role: accountType === AUTH_ACCOUNT_TYPES.AUTHORITY ? ROLES.AUTHORITY : account.role,
  accountType,
  organization: account.organization || null,
  fullName: account.fullName,
});

const registerCitizen = asyncHandler(async (req, res) => {
  const existingUser = await User.findOne({ where: { email: req.body.email } });
  if (existingUser) throw new ApiError(409, 'Email already registered');

  const passwordHash = await bcrypt.hash(req.body.password, Number(process.env.BCRYPT_SALT_ROUNDS || 10));

  const user = await User.create({
    fullName: req.body.fullName,
    email: req.body.email,
    phone: req.body.phone || null,
    passwordHash,
    role: ROLES.CITIZEN,
  });

  const token = signToken(buildAuthPayload(AUTH_ACCOUNT_TYPES.USER, user));
  res.status(201).json(new ApiResponse(201, 'Citizen registered successfully', { user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role }, token }));
});

const loginCitizen = asyncHandler(async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email, role: ROLES.CITIZEN } });
  if (!user) throw new ApiError(401, 'Invalid credentials');
  if (user.isBlocked) throw new ApiError(403, 'Account blocked');

  const validPassword = await bcrypt.compare(req.body.password, user.passwordHash);
  if (!validPassword) throw new ApiError(401, 'Invalid credentials');

  user.lastLoginAt = new Date();
  await user.save();

  const token = signToken(buildAuthPayload(AUTH_ACCOUNT_TYPES.USER, user));
  res.json(new ApiResponse(200, 'Login successful', { user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role }, token }));
});

const loginAuthority = asyncHandler(async (req, res) => {
  const authority = await Authority.findOne({ where: { email: req.body.email } });
  if (!authority) throw new ApiError(401, 'Invalid credentials');
  if (authority.isBlocked) throw new ApiError(403, 'Account blocked');

  const validPassword = await bcrypt.compare(req.body.password, authority.passwordHash);
  if (!validPassword) throw new ApiError(401, 'Invalid credentials');

  authority.lastLoginAt = new Date();
  await authority.save();

  const token = signToken(buildAuthPayload(AUTH_ACCOUNT_TYPES.AUTHORITY, authority));
  res.json(new ApiResponse(200, 'Authority login successful', { authority: { id: authority.id, fullName: authority.fullName, email: authority.email, organization: authority.organization, department: authority.department }, token }));
});

const loginAdmin = asyncHandler(async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email, role: ROLES.ADMIN } });
  if (!user) throw new ApiError(401, 'Invalid credentials');
  if (user.isBlocked) throw new ApiError(403, 'Account blocked');

  const validPassword = await bcrypt.compare(req.body.password, user.passwordHash);
  if (!validPassword) throw new ApiError(401, 'Invalid credentials');

  user.lastLoginAt = new Date();
  await user.save();

  const token = signToken(buildAuthPayload(AUTH_ACCOUNT_TYPES.USER, user));
  res.json(new ApiResponse(200, 'Admin login successful', { admin: { id: user.id, fullName: user.fullName, email: user.email }, token }));
});

module.exports = {
  registerCitizen,
  loginCitizen,
  loginAuthority,
  loginAdmin,
};