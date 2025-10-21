import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, text }) => {
  try {
    // Create transporter using SMTP details from .env
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,               // SMTP host
      port: Number(process.env.EMAIL_PORT),       // SMTP port
      secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for others
      auth: {
        user: process.env.EMAIL_USER,             // SMTP username
        pass: process.env.EMAIL_PASS              // SMTP password (App Password)
      }
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"RK School" <${process.env.SMTP_FROM_EMAIL || process.env.EMAIL_USER}>`, // sender address
      to,                                                                             // receiver address
      subject,                                                                        // email subject
      text                                                                             // plain text body
    });

    console.log(`✅ Email sent: ${info.messageId} to ${to}`);
    return info;
  } catch (error) {
    console.error('❌ Email could not be sent:', error.message);
    throw new Error('Email could not be sent');
  }
};

export default sendEmail;
