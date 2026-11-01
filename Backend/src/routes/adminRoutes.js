const router = require('express').Router();
const adminController = require('../controllers/adminController');
const validate = require('../middleware/validate');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { authorityCreateSchema, adminBroadcastSchema, reviewEscalationSchema, reviewFakeReportSchema } = require('../validators');

router.use(authenticate, requireAdmin);
router.get('/users', adminController.listUsers);
router.get('/authorities', adminController.listAuthorities);
router.post('/authorities', validate(authorityCreateSchema), adminController.addAuthority);
router.patch('/users/:id/block', adminController.blockUser);
router.patch('/users/:id/unblock', adminController.unblockUser);
router.patch('/authorities/:id/block', adminController.blockAuthority);
router.patch('/authorities/:id/unblock', adminController.unblockAuthority);
router.delete('/authorities/:id', adminController.deleteAuthority);
router.get('/complaints', adminController.listComplaints);
router.get('/fake-reports', adminController.listFakeReports);
router.patch('/fake-reports/:id/review', validate(reviewFakeReportSchema), adminController.reviewFakeReport);
router.post('/notifications/broadcast', validate(adminBroadcastSchema), adminController.broadcastNotifications);
router.get('/escalations', adminController.listEscalations);
router.patch('/escalations/:id', validate(reviewEscalationSchema), adminController.reviewEscalation);
router.get('/analytics', adminController.analytics);

module.exports = router;