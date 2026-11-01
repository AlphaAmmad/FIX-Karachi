const router = require('express').Router();
const authorityController = require('../controllers/authorityController');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const { authenticate, requireAuthority } = require('../middleware/auth');
const { authorityCreateSchema, fakeReportSchema, updateComplaintStatusSchema } = require('../validators');

router.use(authenticate, requireAuthority);
router.get('/complaints', authorityController.listAssignedComplaints);
router.get('/complaints/:id', authorityController.getAssignedComplaintDetails);
router.patch('/complaints/:id/status', upload.single('proofImage'), validate(updateComplaintStatusSchema), authorityController.updateComplaintStatus);
router.post('/child-accounts', validate(authorityCreateSchema), authorityController.createChildAuthority);
router.post('/fake-reports', validate(fakeReportSchema), authorityController.reportFakeComplaint);

module.exports = router;