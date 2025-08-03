const express = require('express');
const {
  getAllPlans,
  getDetailPlans,
  delDetailPlans,
  postWritePlans,
  patchEditPlans,
} = require('../controllers/plansController');
const verifyToken = require('../middleware/authHandler');
const router = express.Router();

router.get('/', verifyToken, getAllPlans);
router.get('/:planId', verifyToken, getDetailPlans);
router.delete('/:planId', verifyToken, delDetailPlans);
router.post('/', verifyToken, postWritePlans);
router.patch('/:planId', verifyToken, patchEditPlans);

module.exports = router;
