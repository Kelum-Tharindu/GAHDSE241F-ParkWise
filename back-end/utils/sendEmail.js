const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    // 1. Validate recipient email
    if (!to || typeof to !== 'string' || !to.trim()) {
      throw new Error("Recipient email address is required");
    }

    // 2. Validate subject and text
    if (!subject || !text) {
      throw new Error("Email subject and content are required");
    }

    // 3. Check environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error("Email configuration is incomplete");
    }

    // 4. Create transporter with improved configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false // For local testing only (remove in production)
      }
    });

    // 5. Verify connection configuration
    await transporter.verify((error, success) => {
      if (error) {
        console.error("Server verification failed:", error);
        throw new Error("Email server connection failed");
      } else {
        console.log("Server is ready to take our messages");
      }
    });

    // 6. Define email options with HTML fallback
    const mailOptions = {
      from: `"ParkWise System" <${process.env.EMAIL_USER}>`,
      to: to.trim(),
      subject: subject.trim(),
      text: text.trim(),
      html: `<p>${text.trim().replace(/\n/g, "<br>")}</p>`,
    };

    // 7. Send email with timeout
    const info = await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Email sending timeout")), 10000)
      )
    ]);

    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = sendEmail;