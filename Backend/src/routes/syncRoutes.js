const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const syncController = require('../controllers/syncController');

router.use(authenticate);
router.get('/', syncController.syncAll);

module.exports = router;