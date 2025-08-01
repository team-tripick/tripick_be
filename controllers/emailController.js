const User = require('../models/User');
const { sendAuthCodeEmail } = require('../service/sendAuthCodeEmail');
const generateAuthCode = require('../service/generateAuthCode');
const {
  storeAuthCode,
  getStoredAuthCode,
} = require('../service/storeAuthCode');

const verifyAuthCode = (req, res, next) => {
  try {
    const { email, authCode } = req.body;

    if (!authCode) {
      return res.status(400).json({ message: '인증 코드를 입력해 주세요.' });
    }

    const storedCode = getStoredAuthCode(email);

    if (!storedCode) {
      return res
        .status(401)
        .json({ message: '인증 코드가 만료되었거나 존재하지 않습니다.' });
    }

    if (storedCode !== authCode) {
      return res
        .status(401)
        .json({ message: '인증 코드가 일치하지 않습니다.' });
    }

    return res.status(200).json({ isVerified: true });
  } catch (error) {
    next(error);
  }
};

const sendAuthCode = async (req, res, next) => {
  try {
    const { email } = req.body;

    const code = generateAuthCode();
    if (!code) {
      res.status(400).json({ message: '인증코드가 유효하지 않습니다.' });
    }

    await sendAuthCodeEmail(email, code);

    storeAuthCode(email, code);

    return res.status(200).json({ message: '인증번호가 발송되었습니다.' });
  } catch (error) {
    next(error);
  }
};

const checkEmailAvailability = async (req, res, next) => {
  try {
    const { email } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: '이메일 형식이 잘못 되었습니다.' });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      res.status(409).json({ message: '이미 사용중인 이메일입니다.' });
    }

    return res.status(200).json({ success: existingUser ? false : true });
  } catch (error) {
    next(error);
  }
};

module.exports = { checkEmailAvailability, sendAuthCode, verifyAuthCode };
