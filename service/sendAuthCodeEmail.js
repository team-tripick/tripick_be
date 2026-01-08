const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

async function sendAuthCodeEmail(toEmail, code) {
  try {
    const sentFrom = new Sender(process.env.MAILERSEND_FROM_EMAIL);
    const recipients = [new Recipient(toEmail, 'User')];
    
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject('Tripick 인증 코드 발송')
      .setHtml(`
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Tripick 인증 코드</h2>
          <p>인증 코드는 <strong style="font-size: 24px; color: #4F46E5;">${code}</strong> 입니다.</p>
          <p style="color: #666; font-size: 14px;">이 코드는 10분간 유효합니다.</p>
        </div>
      `)
      .setText(`인증 코드는 ${code} 입니다.`);

    const response = await mailerSend.email.send(emailParams);
    console.log('이메일 발송 성공:', response);
    return response;
  } catch (error) {
    console.error('이메일 발송 중 오류:', error);
    throw error;
  }
}

module.exports = { sendAuthCodeEmail };