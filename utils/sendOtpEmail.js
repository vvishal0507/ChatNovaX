const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendOtpEmail = async (to, otp, name = "User") => {
  const html = `
    <div style="font-family:Segoe UI,sans-serif;padding:20px;background:#f7f7f7;">
      <div style="max-width:520px;margin:auto;background:white;border-radius:16px;padding:24px;box-shadow:0 10px 25px rgba(0,0,0,0.08)">
        <h2 style="margin-top:0;color:#4f46e5;">ChatNovaX OTP Verification</h2>
        <p>Hi ${name},</p>
        <p>Your OTP code is:</p>
        <div style="font-size:32px;font-weight:700;letter-spacing:8px;background:#eef2ff;padding:16px;border-radius:12px;text-align:center;color:#111827;">
          ${otp}
        </div>
        <p style="margin-top:16px;">This OTP will expire in 10 minutes.</p>
        <p style="color:#6b7280;">If you didn't request this, please ignore this email.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "ChatNovaX OTP Code",
    html
  });
};

module.exports = sendOtpEmail;