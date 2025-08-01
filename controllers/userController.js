const User = require('../models/User');
const jwt = require('jsonwebtoken');

const getMyProfile = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: '토큰이 없습니다.' });

    const token = authHeader.split(' ')[1];
    if (!token)
      return res.status(401).json({ message: '잘못된 토큰 형식입니다.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('name email');
    if (!user)
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const delUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: '토큰이 없습니다.' });

    const token = authHeader.split(' ')[1];
    if (!token)
      return res.status(401).json({ message: '잘못된 토큰 형식입니다.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await User.findByIdAndDelete(decoded.id);
    return res.status(200).json({ message: '회원 탈퇴가 완료 되었습니다.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { delUser, getMyProfile };
