const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authHandler');
const { getMyProfile, delUser } = require('../controllers/userController');

router.get('/', verifyToken, getMyProfile);
router.delete('/', verifyToken, delUser);

module.exports = router;
