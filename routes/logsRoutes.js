const express = require('express');
const {
  getAllLogs,
  getDetailLogs,
  delDetailLogs,
  postWriteLogs,
  patchEditLogs,
} = require('../controllers/logsController');
const verifyToken = require('../middleware/authHandler');
const router = express.Router();

router.get('/', verifyToken, getAllLogs);
router.get('/:logId', verifyToken, getDetailLogs);
router.delete('/:logId', verifyToken, delDetailLogs);
router.post('/', verifyToken, postWriteLogs);
router.post('/:logId', verifyToken, patchEditLogs);

module.exports = router;
