const jwt = require('jsonwebtoken');
const { saveMessage, generateRoomId } = require('../controllers/chatController');

class ChatHandler {
  constructor(io) {
    this.io = io;
    this.connectedUsers = new Map(); // userId -> socketId 매핑
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log('사용자 연결됨:', socket.id);

      // 사용자 인증 및 등록
      socket.on('authenticate', async (token) => {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          socket.userId = decoded.id;
          socket.userEmail = decoded.email;
          
          // 연결된 사용자 등록
          this.connectedUsers.set(decoded.id, socket.id);
          
          console.log(`사용자 인증 완료: ${decoded.email} (${socket.id})`);
          socket.emit('authenticated', { success: true });
        } catch (error) {
          console.error('인증 실패:', error);
          socket.emit('authentication_error', { message: '인증에 실패했습니다.' });
          socket.disconnect();
        }
      });

      // 채팅방 입장
      socket.on('join_room', (data) => {
        const { receiverId } = data;
        if (!socket.userId) {
          socket.emit('error', { message: '인증되지 않은 사용자입니다.' });
          return;
        }

        const roomId = generateRoomId(socket.userId, receiverId);
        socket.join(roomId);
        socket.currentRoom = roomId;
        
        console.log(`사용자 ${socket.userId}가 방 ${roomId}에 입장했습니다.`);
        socket.emit('room_joined', { roomId });
      });

      // 메시지 전송
      socket.on('send_message', async (data) => {
        try {
          const { receiverId, message } = data;
          
          if (!socket.userId) {
            socket.emit('error', { message: '인증되지 않은 사용자입니다.' });
            return;
          }

          if (!message || !receiverId) {
            socket.emit('error', { message: '메시지와 수신자 ID가 필요합니다.' });
            return;
          }

          // 메시지 저장
          const savedMessage = await saveMessage(socket.userId, receiverId, message);
          
          const roomId = generateRoomId(socket.userId, receiverId);
          
          const messageData = {
            id: savedMessage._id,
            message: savedMessage.message,
            sender: {
              id: savedMessage.sender._id,
              name: savedMessage.sender.name
            },
            receiver: {
              id: savedMessage.receiver._id,
              name: savedMessage.receiver.name
            },
            timestamp: savedMessage.createdAt,
            isRead: savedMessage.isRead
          };

          // 같은 방에 있는 모든 사용자에게 메시지 전송
          this.io.to(roomId).emit('new_message', messageData);
          
          // 수신자가 온라인이면 알림
          const receiverSocketId = this.connectedUsers.get(receiverId);
          if (receiverSocketId) {
            this.io.to(receiverSocketId).emit('message_notification', {
              from: savedMessage.sender.name,
              message: message.length > 50 ? message.substring(0, 50) + '...' : message
            });
          }

          console.log(`메시지 전송 완료: ${socket.userId} -> ${receiverId}`);
        } catch (error) {
          console.error('메시지 전송 오류:', error);
          socket.emit('error', { message: '메시지 전송에 실패했습니다.' });
        }
      });

      // 채팅방 나가기
      socket.on('leave_room', () => {
        if (socket.currentRoom) {
          socket.leave(socket.currentRoom);
          console.log(`사용자 ${socket.userId}가 방 ${socket.currentRoom}에서 나갔습니다.`);
          socket.currentRoom = null;
        }
      });

      // 연결 해제
      socket.on('disconnect', () => {
        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);
          console.log(`사용자 연결 해제: ${socket.userId} (${socket.id})`);
        }
      });

      // 타이핑 상태 전송
      socket.on('typing', (data) => {
        const { receiverId, isTyping } = data;
        if (!socket.userId) return;

        const roomId = generateRoomId(socket.userId, receiverId);
        socket.to(roomId).emit('user_typing', {
          userId: socket.userId,
          isTyping
        });
      });
    });
  }

  // 특정 사용자에게 메시지 전송
  sendToUser(userId, event, data) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
      return true;
    }
    return false;
  }

  // 온라인 사용자 목록 조회
  getOnlineUsers() {
    return Array.from(this.connectedUsers.keys());
  }
}

module.exports = ChatHandler;