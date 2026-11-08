import z from "zod";

export const sendChatMessageSchema = z.object({
  message: z
    .string("Message is required")
    .trim()
    .min(1, "Message cannot be empty")
    .max(1000, "Message cannot be longer than 1000 characters"),
  sessionId: z.uuid("Session ID must be a valid UUID").optional(),
});

export const chatResponseSchema = z.object({
  sessionId: z.uuid("Session ID must be a valid UUID"),
  answer: z.string().min(1, "Answer cannot be empty"),
  doctors: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      specialization: z.string(),
      consultationFee: z.string().nullable(),
    }),
  ),
});
