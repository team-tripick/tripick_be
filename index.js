require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const mongoose = require('mongoose');

// 라우터
const authRoutes = require('./routes/authRoutes');
const emailRoutes = require('./routes/emailRoutes');
const logsRoutes = require('./routes/logsRoutes');
const plansRoutes = require('./routes/plansRoutes');
const userRoutes = require('./routes/userRoutes');

// 에러 핸들러
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ 보안
app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// ✅ 요청 제한
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

// ✅ 라우터 등록
app.use('/auth', authRoutes);
app.use('/email', emailRoutes);
app.use('/logs', logsRoutes);
app.use('/plans', plansRoutes);
app.use('/users', userRoutes);

// ✅ 에러 핸들러
app.use(errorHandler);

// ✅ DB 연결 (Mongoose)
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB 연결 성공');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 서버 실행 중: PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB 연결 실패:', err);
    process.exit(1);
  });
