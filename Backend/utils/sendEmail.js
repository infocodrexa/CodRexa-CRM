import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // TLS use karega (587)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Verify SMTP connection on startup
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ SMTP Connection Error:", err.message);
  } else {
    console.log("✅ SMTP Server is ready to take messages");
  }
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("📩 sendEmail called with:", { to, subject });

    const info = await transporter.sendMail({
      from: `"CodRexa CRM" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
  }
};


