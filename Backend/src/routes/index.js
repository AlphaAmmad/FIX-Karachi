const router = require('express').Router();

router.use('/auth', require('./authRoutes'));
router.use('/complaints', require('./complaintRoutes'));
router.use('/authority', require('./authorityRoutes'));
router.use('/admin', require('./adminRoutes'));
router.use('/notifications', require('./notificationRoutes'));
router.use('/public', require('./publicRoutes'));
router.use('/sync', require('./syncRoutes'));

module.exports = router;