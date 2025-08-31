const Chat = require('../models/Chats');
const User = require('../models/User');
const Plans = require('../models/Plans');

// 채팅 가능한 사용자 목록 조회
const getChatUserList = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    
    // 나를 제외한 모든 사용자 조회
    const users = await User.find({ _id: { $ne: currentUserId } }).select('name email');
    
    const userListWithLatestPlan = await Promise.all(
      users.map(async (user) => {
        // 각 사용자의 가장 최근 계획 조회
        const latestPlan = await Plans.findOne({ user: user._id })
          .sort({ createdAt: -1 })
          .select('place');
        
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          latestPlace: latestPlan ? latestPlan.place : '계획 없음',
          roomId: generateRoomId(currentUserId, user._id)
        };
      })
    );

    return res.status(200).json(userListWithLatestPlan);
  } catch (error) {
    next(error);
  }
};

// 특정 사용자와의 채팅 내역 조회
const getChatHistory = async (req, res, next) => {
  try {
    const { userId } = req.params; // 대화 상대 ID
    const currentUserId = req.user.id;
    
    const roomId = generateRoomId(currentUserId, userId);
    
    const chatHistory = await Chat.find({ roomId })
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .sort({ createdAt: 1 });

    // 메시지를 읽음으로 표시 (받은 메시지만)
    await Chat.updateMany(
      { 
        roomId, 
        receiver: currentUserId, 
        isRead: false 
      },
      { isRead: true }
    );

    const formattedHistory = chatHistory.map(chat => ({
      id: chat._id,
      message: chat.message,
      sender: {
        id: chat.sender._id,
        name: chat.sender.name,
        isMe: chat.sender._id.toString() === currentUserId
      },
      receiver: {
        id: chat.receiver._id,
        name: chat.receiver.name
      },
      timestamp: chat.createdAt,
      isRead: chat.isRead
    }));

    return res.status(200).json(formattedHistory);
  } catch (error) {
    next(error);
  }
};

// 채팅 메시지 저장
const saveMessage = async (senderID, receiverID, message) => {
  try {
    const roomId = generateRoomId(senderID, receiverID);
    
    const newMessage = await Chat.create({
      sender: senderID,
      receiver: receiverID,
      message,
      roomId
    });

    return await Chat.findById(newMessage._id)
      .populate('sender', 'name')
      .populate('receiver', 'name');
  } catch (error) {
    console.error('메시지 저장 오류:', error);
    throw error;
  }
};

// 읽지 않은 메시지 수 조회
const getUnreadCount = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    
    const unreadCount = await Chat.countDocuments({
      receiver: currentUserId,
      isRead: false
    });

    return res.status(200).json({ unreadCount });
  } catch (error) {
    next(error);
  }
};

// 채팅방 ID 생성 함수 (두 사용자 ID를 정렬하여 일관된 roomId 생성)
const generateRoomId = (userId1, userId2) => {
  return [userId1, userId2].sort().join('_');
};

module.exports = { 
  getChatUserList, 
  getChatHistory, 
  saveMessage, 
  getUnreadCount,
  generateRoomId 
};