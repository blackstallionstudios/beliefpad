import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // This is a minimal schema for the email functionality
  // You can add more tables as needed for your application
  emails: defineTable({
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
    sentAt: v.number(),
    status: v.union(v.literal("sent"), v.literal("failed")),
  }),
});
