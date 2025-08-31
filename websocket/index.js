const { Server } = require('socket.io');
const ChatHandler = require('./chatHandler');

function setupWebSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // ChatHandler 초기화
  const chatHandler = new ChatHandler(io);

  // 미들웨어 설정
  io.use((socket, next) => {
    // 연결 시 기본 검증
    console.log('WebSocket 연결 시도:', socket.id);
    next();
  });

  console.log('WebSocket 서버가 설정되었습니다.');
  
  return io;
}

module.exports = setupWebSocket;