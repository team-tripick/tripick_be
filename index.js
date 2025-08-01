require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');
const sequelize = require('./config/database');
const emailRoutes = require('./routes/emailRoutes');
const logsRoutes = require('./routes/logsRoutes');
const plansRoutes = require('./routes/plansRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 보안 헤더 설정
app.use(helmet());

// CORS 설정
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 최대 100회 요청
});
app.use(limiter);

// 로그인 전용 제한
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 로그인 시도 5회 제한
});

app.use('/auth/login', authLimiter);

// 미들웨어 설정
app.use(express.json());

// 라우트 설정
app.use('/auth', authRoutes);
app.use('/email', emailRoutes);
app.use('/logs', logsRoutes);
app.use('/plans', plansRoutes);
app.use('/users', userRoutes);

// 에러 핸들러
app.use(errorHandler);

// DB 연결 및 서버 시작
sequelize
  .authenticate()
  .then(() => {
    console.log('✅ DB 연결 성공');
    return sequelize.sync({ alter: true }); // 자동 테이블 생성
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ DB 연결 실패:', err);
    process.exit(1); // 프로세스 종료
  });
