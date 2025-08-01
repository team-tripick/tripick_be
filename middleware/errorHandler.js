const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: '인증 오류' });
  }

  if (err.name === 'ValidationError') {
    return res
      .status(400)
      .json({ message: '유효성 검사 오류: ' + err.message });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: '잘못된 ID 형식입니다.' });
  }

  res.status(500).json({ message: err.message || '서버 내부 오류' });
};

module.exports = errorHandler;
