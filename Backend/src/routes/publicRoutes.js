const router = require('express').Router();
const publicController = require('../controllers/publicController');

router.get('/dashboard', publicController.dashboard);
router.get('/complaints/recent', publicController.recentComplaints);
router.get('/complaints/categories', publicController.categoryStats);

module.exports = router;