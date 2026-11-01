const router = require('express').Router();
const complaintController = require('../controllers/complaintController');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const { authenticate } = require('../middleware/auth');
const { createComplaintSchema, escalationSchema } = require('../validators');

router.post('/', authenticate, upload.single('image'), validate(createComplaintSchema), complaintController.createComplaint);
router.get('/mine', authenticate, complaintController.listOwnComplaints);
router.get('/sync', authenticate, complaintController.syncComplaints);
router.get('/:id', authenticate, complaintController.getComplaintDetails);
router.get('/:id/timeline', authenticate, complaintController.complaintTimeline);
router.post('/:id/escalate', authenticate, complaintController.escalateComplaint);

module.exports = router;