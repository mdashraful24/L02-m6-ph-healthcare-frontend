import z from "zod";

export const MAX_FILE_SIZE = 5;

export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE * 1024 * 1024;

export const MAX_ADDITIONAL_DOCUMENTS = 5;

export const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];

export function isAcceptedFileSize(fileSize: number) {
  return fileSize <= MAX_FILE_SIZE_BYTES;
}

export function isAcceptedFileType(fileType: string) {
  return ACCEPTED_FILE_TYPES.includes(fileType);
}

const ACCEPTED_FILE_TYPES_LABEL = "PDF, DOC, DOCX, or image";

export const getCustomFileSchema = <T>(message: string) =>
  z.custom<T>(
    (value) =>
      value === null ||
      (value instanceof File &&
        isAcceptedFileSize(value.size) &&
        isAcceptedFileType(value.type)),
    {
      message: message,
    },
  );

export const doctorApplicationSchema = z.object({
  name: z
    .string("Name is required")
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name must not exceed 100 characters"),

  email: z
    .string("Email is required")
    .trim()
    .email("Please provide a valid email address"),

  imageUrl: z
    .string()
    .trim()
    .url("Please provide a valid image URL")
    .or(z.literal(""))
    .optional(),

  address: z
    .string()
    .trim()
    .max(255, "Address must not exceed 255 characters")
    .optional(),

  contactNumber: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || value.length >= 7,
      "Contact number is too short",
    )
    .max(20, "Contact number is too long")
    .optional(),

  specialization: z
    .string("Specialization is required")
    .trim()
    .min(2, "Specialization is required")
    .max(100, "Specialization must not exceed 100 characters"),

  licenseNumber: z
    .string("License number is required")
    .trim()
    .min(3, "License number is required")
    .max(100, "License number must not exceed 100 characters"),

  qualifications: z
    .string("Qualifications are required")
    .trim()
    .min(2, "Qualifications are required")
    .max(500, "Qualifications must not exceed 500 characters"),

  experienceYears: z
    .string()
    .refine(
      (value) => /^\d+$/.test(value),
      "Experience years must be a valid number",
    )
    .refine(
      (value) => !Number.isNaN(Number(value)),
      "Experience years must be a valid number",
    )
    .refine(
      (value) => Number.isInteger(Number(value)),
      "Experience years must be a whole number",
    )
    .refine(
      (value) => Number(value) >= 0,
      "Experience years cannot be negative",
    )
    .refine(
      (value) => Number(value) <= 60,
      "Experience years must not exceed 60",
    ),

  consultationFee: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || (/^\d+$/.test(value) && Number(value) >= 0),
      {
        message: "Consultation fee must be a non-zero whole number",
      },
    )
    .optional(),

  resume: getCustomFileSchema<File | null>(
    `Resume must be a ${ACCEPTED_FILE_TYPES_LABEL} file and must not exceed ${MAX_FILE_SIZE} MB`,
  ).refine((value) => value instanceof File, {
    message: "A resume of cv is required",
  }),

  additionalDocuments: z
    .array(z.custom<File>((value) => value instanceof File))
    .max(
      MAX_ADDITIONAL_DOCUMENTS,
      `You can attach at most ${MAX_ADDITIONAL_DOCUMENTS} additional documents`,
    )
    .refine(
      (files) =>
        files.every(
          (file) =>
            isAcceptedFileSize(file.size) && isAcceptedFileType(file.type),
        ),
      {
        message: `Each additional document must be a ${ACCEPTED_FILE_TYPES_LABEL} file and must not exceed ${MAX_FILE_SIZE} MB`,
      },
    ),

  bio: z
    .string()
    .trim()
    .max(2000, "Bio must not exceed 2000 characters")
    .optional(),
});
