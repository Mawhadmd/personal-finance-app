import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user:  process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export async function sendEmail(to: string, code: string) {
  if (!to || !code) {
    return { error: "Invalid email or code." };
  }

  const htmlTemplate = `


 
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">PFinance</h1>
                  <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Email Verification</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px; text-align: center;">
                  <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Welcome to PFinance! 🎉</h2>
                  
                  <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                    Thank you for signing up for PFinance. To complete your registration and secure your account, 
                    please use the verification code below:
                  </p>
                  
                  <!-- Verification Code Box -->
                  <div style="background-color: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; padding: 25px; margin: 30px 0; display: inline-block;">
                    <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                      ${code}
                    </div>
                  </div>
                  
                  <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                    Enter this code on the verification page to activate your account and start managing your finances with confidence.
                  </p>
                  
                  <!-- Warning Box -->
                  <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 25px 0;">
                    <p style="color: #856404; font-size: 14px; margin: 0;">
                      <strong>⚠️ Security Notice:</strong><br>
                      This code will expire in 1 hour. If you didn't request this verification, please ignore this email.
                      Never share this code with anyone.
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 30px 20px; text-align: center; border-top: 1px solid #e9ecef; border-radius: 0 0 8px 8px;">
                  <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">
                    <strong>PFinance Team</strong><br>
                    Your trusted partner in financial management
                  </p>
                  <p style="color: #999; font-size: 12px; margin: 0;">
                    © 2025 PFinance. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
  `;

  try {
    const info = await transporter.sendMail({
      from: '"PFinance Team" <mohammedbus13@gmail.com>',
      to: to,
      subject: "🔐 PFinance - Verify Your Email Address",
      html: htmlTemplate,
      text: `Welcome to PFinance! Your verification code is: ${code}. This code will expire in 15 minutes.`,
    });

    console.log("Email sent: " + info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.log("Email error:", error);
    return { error: "Failed to send verification email." };
  }
}
