const express = require('express');
const router = express.Router();
const {
  checkEmailAvailability,
  sendAuthCode,
  verifyAuthCode,
} = require('../controllers/emailController');

router.post('/verify', checkEmailAvailability);
router.post('/auth-code', sendAuthCode);
router.post('/auth-code/verify', verifyAuthCode)

module.exports = router;
