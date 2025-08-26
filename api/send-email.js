import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      clientName,
      subject,
      details,
      sessionType,
      sections,
      recipientEmail,
      senderEmail,
      senderName,
      emailSubject,
      emailMessage,
      pin, // incoming PIN from client
      brevoUser, // NEW: Incoming Brevo user
      brevoPass, // NEW: Incoming Brevo password
    } = req.body;

    console.log("📨 Incoming payload:", req.body);
    console.log("🔑 Provided PIN:", pin);
    console.log("🔐 Expected PIN:", process.env.EMAIL_PIN);
    console.log("🔐 Expected PIN from env:", process.env.EMAIL_PIN);

    // ✅ PIN check (remains on the server for security)
    if (!pin || pin !== process.env.EMAIL_PIN) {
      console.warn("⚠️ Unauthorized attempt: invalid PIN");
      return res.status(403).json({ error: "Invalid PIN" });
    }

    // Create transporter with Brevo SMTP, using the credentials from the request body
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: brevoUser, // NEW: Use user from request body
        pass: brevoPass, // NEW: Use password from request body
      },
    });

    // Build HTML sections dynamically
    const sectionHTML = sections
      .map(
        (s) => `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">
            <strong>${s.subheading}:</strong><br/>
            ${s.content}
          </td>
        </tr>`
      )
      .join("");

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <!-- Header -->
        <div style="background-color: #f8f8f8; padding: 20px; text-align: center; border-bottom: 1px solid #ddd;">
          <h1 style="color: #4A90E2; font-size: 24px; margin: 0;">Session Report</h1>
        </div>

        <!-- Body -->
        <div style="padding: 20px;">
          <h2 style="color: #4A90E2; margin-top: 0;">Session Report: ${sessionType}</h2>
          <p><strong>Client:</strong> ${clientName}</p>
          <p><strong>Details:</strong> ${details}</p>
          <p><strong>Message:</strong> ${emailMessage}</p>
          
          <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
            <tbody>
              ${sectionHTML}
            </tbody>
          </table>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8f8f8; padding: 15px; text-align: center; font-size: 12px; color: #888;">
          Sent by ${senderName} (${senderEmail})<br/>
          © ${new Date().getFullYear()} Cameron's Transformational Healing
        </div>
      </div>
    `;

    const mailOptions = {
        from: `"${senderName}" <${brevoUser}>`, // Use the provided user for the 'from' field
        replyTo: senderEmail,
        to: recipientEmail,
        subject: emailSubject || subject || "Session Report",
        text: emailMessage,
        html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.messageId);
    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("❌ Email send error:", error);
    // Return a more specific error message if available
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ success: false, message: errorMessage });
  }
}
