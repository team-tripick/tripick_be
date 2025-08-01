const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: '인증 오류' });
  }

  res.status(500).json({ message: err.message || '서버 내부 오류' });
};

module.exports = errorHandler;
