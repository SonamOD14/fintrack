const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const sendMailPromise = transporter.sendMail({
      from: `"som dai" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    // 🔥 HARD timeout so it never hangs
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Email sending timed out"));
      }, 10000); // 10 seconds
    });

    // Either sendMail resolves OR timeout rejects
    await Promise.race([sendMailPromise, timeoutPromise]);

    return { success: true, message: "Email sent successfully" };

  } catch (error) {
    console.error("Send email error:", error);

    return {
      success: false,
      message: error.message || "Failed to send email"
    };
  }
};
module.exports = sendEmail;