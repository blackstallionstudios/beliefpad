"use node";

import { action } from "../convex/_generated/server";
import { v } from "convex/values";
import nodemailer from "nodemailer";
import Brevo from "@getbrevo/brevo";
const API_URL = import.meta.env.VITE_CONVEX_URL;

export const sendPdfEmail = action({
  args: {
    clientName: v.string(),
    subject: v.optional(v.string()),
    details: v.optional(v.string()),
    sessionType: v.optional(v.string()),
    sections: v.array(v.object({
      id: v.string(),
      subheading: v.string(),
      content: v.string(),
    })),
    recipientEmail: v.string(),
    senderEmail: v.string(),
    senderPassword: v.optional(v.string()),
    senderName: v.optional(v.string()),
    emailSubject: v.optional(v.string()),
    emailMessage: v.optional(v.string()),
    brevoApiKey: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    try {
      // Generate PDF buffer
      const pdfBuffer = await generatePDFBuffer(
        args.clientName,
        args.subject || "",
        args.details || "",
        args.sessionType || "",
        args.sections
      );

      const subjectLine = (args.emailSubject && args.emailSubject.trim().length > 0)
        ? args.emailSubject
        : `Belief Code Session for ${args.clientName}`;

      const messageHtml = `
        <h2>Belief Code Session</h2>
        <p><strong>Client:</strong> ${args.clientName}</p>
        ${args.subject ? `<p><strong>Subject:</strong> ${args.subject}</p>` : ""}
        ${args.sessionType ? `<p><strong>Session Type:</strong> ${args.sessionType}</p>` : ""}
        ${args.details ? `<p><strong>Details:</strong> ${args.details}</p>` : ""}
        ${args.emailMessage ? `<div style="margin-top:12px;"><strong>Message:</strong><div>${args.emailMessage.replace(/\n/g, '<br/>')}</div></div>` : ""}
        <br>
        <p>Please find the complete session details in the attached file.</p>
      `;

      // Prefer Brevo if API key is available (env or provided)
      const envBrevoKey = (process.env.BREVO_API_KEY as string | undefined) || undefined;
      const brevoKey = args.brevoApiKey || envBrevoKey;
      if (brevoKey) {
        const apiInstance = new Brevo.TransactionalEmailsApi(
          new (Brevo as any).Configuration({ apiKey: brevoKey })
        );

        const sendEmail: any = {
          subject: subjectLine,
          htmlContent: messageHtml,
          sender: {
            name: args.senderName || "Belief Code Typer",
            email: args.senderEmail,
          },
          to: [
            {
              email: args.recipientEmail,
            },
          ],
          attachment: [
            {
              name: `Belief Code for ${args.clientName}.txt`,
              content: pdfBuffer.toString("base64"),
            },
          ],
        };

        await apiInstance.sendTransacEmail(sendEmail);

        return {
          success: true,
          message: "Email sent via Brevo",
        };
      }

      // Fallback: Gmail via nodemailer (requires app password)
      if (!args.senderPassword) {
        return {
          success: false,
          message: "Missing senderPassword for SMTP sending. Provide BREVO_API_KEY or senderPassword.",
        };
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: args.senderEmail,
          pass: args.senderPassword,
        },
      });

      // Email options
      const mailOptions = {
        from: args.senderEmail,
        to: args.recipientEmail,
        subject: subjectLine,
        text: `Please find attached the Belief Code session for ${args.clientName}.\n\n${args.emailMessage || ""}`,
        html: messageHtml,
        attachments: [
          {
            filename: `Belief Code for ${args.clientName}.txt`,
            content: pdfBuffer,
            contentType: "text/plain",
          },
        ],
      };

      // Send email
      await transporter.sendMail(mailOptions);

      return {
        success: true,
        message: "Email sent via SMTP",
      };
    } catch (error) {
      console.error("Error sending email:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

async function generatePDFBuffer(
  clientName: string,
  subject: string,
  details: string,
  sessionType: string,
  sections: { id: string; subheading: string; content: string }[]
) {
  // For Convex, we'll create a simple text representation
  // In a production environment, you might want to use a server-side PDF generation service
  let content = `Belief Code Session for ${clientName}\n\n`;
  
  const date = new Date().toLocaleDateString();
  content += `Session Date: ${date}\n\n`;
  
  if (subject && subject.trim()) {
    content += `Subject: ${subject}\n\n`;
  }
  
  if (details && details.trim()) {
    content += `Details: ${details}\n\n`;
  }
  
  if (sessionType && sessionType.trim()) {
    content += `Session Type: ${sessionType}\n\n`;
  }
  
  content += "Sections:\n";
  content += "=".repeat(50) + "\n\n";
  
  sections.forEach((section, index) => {
    content += `${index + 1}. ${section.subheading.toUpperCase()}\n`;
    content += `${section.content}\n\n`;
  });
  
  // Return as buffer
  return Buffer.from(content, 'utf-8');
}
