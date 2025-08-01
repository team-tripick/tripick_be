const nodemailer = require('nodemailer');

async function sendAuthCodeEmail(toEmail, code) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Tripick 인증 코드 발송',
    text: `인증 코드는 ${code} 입니다.`,
  };
  await transporter.sendMail(mailOptions);
}

module.exports = { sendAuthCodeEmail };
