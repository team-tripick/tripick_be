const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authHandler');
const { getMyProfile, delUser, userProfileGet } = require('../controllers/userController');

router.get('/', verifyToken, getMyProfile);
router.delete('/', verifyToken, delUser);
router.get('/:userId', verifyToken, userProfileGet)

module.exports = router;
