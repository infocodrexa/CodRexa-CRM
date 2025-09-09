export const otpTemplate = (username, otp) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>OTP Verification</title>
  </head>
  <body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
    <div style="max-width:600px;margin:auto;background:#fff;padding:20px;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.1)">
      <h2 style="color:#333;">Hello ${username},</h2>
      <p style="font-size:16px; color:#555;">
        Your One-Time Password (OTP) is:
      </p>
      <h1 style="text-align:center; background:#007bff; color:#fff; padding:10px; border-radius:5px;">
        ${otp}
      </h1>
      <p style="font-size:14px; color:#777;">
        This OTP will expire in <b>5 minutes</b>.  
        If you did not request this, please ignore this email.
      </p>
      <p style="font-size:14px; color:#777; margin-top:20px;">
        Regards,<br><b>CodRexa CRM Team</b>
      </p>
    </div>
  </body>
</html>
`;

export const resetPasswordTemplate = (username, resetLink) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Password Reset</title>
  </head>
  <body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
    <div style="max-width:600px;margin:auto;background:#fff;padding:20px;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.1)">
      <h2 style="color:#333;">Hello ${username},</h2>
      <p style="font-size:16px; color:#555;">
        We received a request to reset your password. Click the button below:
      </p>
      <p style="text-align:center;">
        <a href="${resetLink}" style="background:#28a745;color:#fff;padding:12px 24px;text-decoration:none;border-radius:5px;font-weight:bold;">
          Reset Password
        </a>
      </p>
      <p style="font-size:14px; color:#777;">
        This link will expire in <b>15 minutes</b>.  
        If you didn’t request a password reset, you can safely ignore this email.
      </p>
      <p style="font-size:14px; color:#777; margin-top:20px;">
        Regards,<br><b>CodRexa CRM Team</b>
      </p>
    </div>
  </body>
</html>
`;
