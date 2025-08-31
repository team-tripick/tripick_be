const express = require('express');
const router = express.Router();
const {
  getChatUserList,
  getChatHistory,
  getUnreadCount
} = require('../controllers/chatController');
const verifyToken = require('../middleware/authHandler');

// 채팅 가능한 사용자 목록 조회
router.get('/users', verifyToken, getChatUserList);

// 특정 사용자와의 채팅 내역 조회
router.get('/history/:userId', verifyToken, getChatHistory);

// 읽지 않은 메시지 수 조회
router.get('/unread-count', verifyToken, getUnreadCount);

module.exports = router;