const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { loginSchema, registerSchema } = require('../validators');

// Rate limiters to prevent brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window per IP
  message: { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 registrations per window per IP
  message: { success: false, message: 'Too many registration attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/citizen/register', registerLimiter, validate(registerSchema), authController.registerCitizen);
router.post('/citizen/login', loginLimiter, validate(loginSchema), authController.loginCitizen);
router.post('/authority/login', loginLimiter, validate(loginSchema), authController.loginAuthority);
router.post('/admin/login', loginLimiter, validate(loginSchema), authController.loginAdmin);

module.exports = router;