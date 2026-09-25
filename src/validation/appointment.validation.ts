import z from "zod";

export const bookAppointmentSchema = z.object({
  scheduleId: z
    .string("Schedule ID is required")
    .trim()
    .min(1, "Schedule ID is required"),
});

export const bookAppointmentResponseSchema = z.object({
  paymentUrl: z.string().trim().url("Please provide a valid payment URL"),
});
