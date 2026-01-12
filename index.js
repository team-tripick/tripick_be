require('dotenv').config();
const express = require('express');
const http = require('http');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const mongoose = require('mongoose');
const setupWebSocket = require('./websocket/index');

// 라우터
const authRoutes = require('./routes/authRoutes');
const emailRoutes = require('./routes/emailRoutes');
const logsRoutes = require('./routes/logsRoutes');
const plansRoutes = require('./routes/plansRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');

// 에러 핸들러
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// WebSocket 설정
const io = setupWebSocket(server);

// ✅ 보안
app.use(helmet());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_TWO_URL,
  'http://localhost:3000',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman 등 서버 직접 호출 허용
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

//✅ 요청 제한
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
});
app.use('/auth/login', authLimiter);

// ✅ Body 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// WebSocket 인스턴스를 req에 추가
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ✅ 라우터 등록
app.use('/auth', authRoutes);
app.use('/email', emailRoutes);
app.use('/logs', logsRoutes);
app.use('/plans', plansRoutes);
app.use('/users', userRoutes);
app.use('/chat', chatRoutes);

// ✅ 에러 핸들러
app.use(errorHandler);

// 404 핸들러
app.use('*', (req, res) => {
  res.status(404).json({ message: '요청하신 리소스를 찾을 수 없습니다.' });
});

// ✅ DB 연결 (Mongoose)
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB 연결 성공');
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 서버 실행 중: PORT ${PORT}`);
      console.log('📡 WebSocket 서버도 함께 실행됨');
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB 연결 실패:', err);
    process.exit(1);
  });

module.exports = app;