"use client";

import { useForm } from "@tanstack/react-form";
import {
  BadgeCheck,
  FileText,
  FileUp,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Plus,
  Stethoscope,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import type z from "zod";
import { useApplyAsDoctor } from "@/hooks";
import type { DoctorApplicationData } from "@/types";
import { formatFileSize } from "@/utils";
import {
  doctorApplicationSchema,
  isAcceptedFileSize,
  isAcceptedFileType,
  MAX_ADDITIONAL_DOCUMENTS,
  MAX_FILE_SIZE,
} from "@/validation";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";

function getAdditionalDocumentErrorMessage(file: File) {
  if (!isAcceptedFileSize(file.size)) {
    return `File exceeds the ${MAX_FILE_SIZE} MB size limit`;
  }

  if (!isAcceptedFileType(file.type)) {
    return "Only PDF, DOC, DOCX, or image files are allowed";
  }

  return null;
}

export default function DoctorApplyForm() {
  const { mutate: apply, isPending: applyPending } = useApplyAsDoctor();

  type DoctorDefaultValues = z.input<typeof doctorApplicationSchema>;

  const defaultValues: DoctorDefaultValues = {
    name: "",
    email: "",
    address: "",
    contactNumber: "",
    specialization: "",
    licenseNumber: "",
    qualifications: "",
    experienceYears: "",
    bio: "",
    consultationFee: "",
    resume: null,
    additionalDocuments: [],
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: doctorApplicationSchema,
    },
    onSubmit: async ({ value }) => {
      const doctorData: DoctorApplicationData = {
        user: {
          name: value.name.trim(),
          email: value.email.trim(),
        },
        doctor: {
          address: value.address?.trim() ?? "",
          contactNumber: value.contactNumber?.trim() ?? "",
          specialization: value.specialization.trim(),
          licenseNumber: value.licenseNumber.trim(),
          qualifications: value.qualifications.trim(),
          experienceYears: Number(value.experienceYears),
          consultationFee: value.consultationFee?.trim()
            ? Number(value.consultationFee)
            : undefined,
          bio: value.bio?.trim() ?? "",
        },
      };

      apply(
        {
          data: doctorData,
          resume: value.resume as File,
          additionalDocuments: value.additionalDocuments,
        },
        {
          onSuccess: (res) => {
            console.log(res);
          },
        },
      );
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Apply to join PH Healthcare
        </h1>
        <p className="text-balance text-sm text-muted-foreground">
          Fill in your details to submit your doctor application
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        noValidate
      >
        <FieldGroup>
          <div className="grid gap-5 sm:grid-cols-2">
            <form.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Full name</FieldLabel>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        placeholder="Dr. John Doe"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="pl-9"
                        autoComplete="off"
                      />
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        placeholder="dr.john@example.com"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="pl-9"
                        autoComplete="off"
                      />
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="contactNumber">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Contact number{" "}
                      <span className="font-normal text-muted-foreground">
                        (Optional)
                      </span>
                    </FieldLabel>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id={field.name}
                        name={field.name}
                        type="tel"
                        placeholder="+8801912345678"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="pl-9"
                        autoComplete="off"
                      />
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="specialization">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Specialization</FieldLabel>
                    <div className="relative">
                      <Stethoscope className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        placeholder="Cardiology"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="pl-9"
                        autoComplete="off"
                      />
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="address">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Practice Address{" "}
                      <span className="font-normal text-muted-foreground">
                        (Optional)
                      </span>
                    </FieldLabel>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        placeholder="Banani, Dhaka, Bangladesh"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="pl-9"
                        autoComplete="off"
                      />
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="licenseNumber">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>License number</FieldLabel>
                    <div className="relative">
                      <BadgeCheck className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        placeholder="BMDC-10045"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="pl-9"
                        autoComplete="off"
                      />
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="qualifications">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Qualifications</FieldLabel>
                    <div className="relative">
                      <GraduationCap className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        placeholder="MBBS, FCPS in Cardiology"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="pl-9"
                        autoComplete="off"
                      />
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="experienceYears">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Years of experience
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      placeholder="8"
                      min={0}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="consultationFee">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Consultation fee (BDT){" "}
                      <span className="font-normal text-muted-foreground">
                        (Optional)
                      </span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      placeholder="1000"
                      min={0}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </div>

          <form.Field name="resume">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              const file = field.state.value;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="resume-field">Resume</FieldLabel>
                  <div className="flex flex-col items-start gap-2">
                    <Button
                      render={
                        <label htmlFor="resume-field">
                          <FileUp size="4" />
                          Upload resume
                        </label>
                      }
                      nativeButton={false}
                      variant="outline"
                    />
                    <input
                      id="resume-field"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      name={field.name}
                      onChange={(e) => {
                        const selected = e.target.files?.[0] ?? null;

                        field.handleChange(selected);
                        e.target.value = ""; // Reset the input value to allow re-uploading the same file if needed
                      }}
                    />
                    {file ? (
                      <span className="inline-flex max-w-full items-center gap-2 rounded-lg bg-muted px-2.5 py-1 text-sm">
                        <FileText size="16" className="shrink-0 text-primary" />
                        <span className="truncate">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </span>
                        <button
                          type="button"
                          aria-label="Remove resume"
                          onClick={() => {
                            field.handleChange(null);
                            field.handleBlur(); // Mark the field as touched when removing the file
                          }}
                          className="text-muted-foreground transition-colors hover:text-destructive focus:outline-none"
                        >
                          <X size="16" />
                        </button>
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        PDF, DOC, DOCX, or image files up to {MAX_FILE_SIZE} MB
                      </span>
                    )}
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="additionalDocuments">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              const files = field.state.value;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="additional-documents-field">
                    Additional Documents{" "}
                    <span className="font-normal text-muted-foreground">
                      (Optional)
                    </span>
                  </FieldLabel>
                  <div className="flex flex-col items-start gap-2">
                    <Button
                      render={
                        <label htmlFor="additional-documents-field">
                          <Plus size="4" />
                          Add Files
                        </label>
                      }
                      nativeButton={false}
                      variant="outline"
                    />
                    <input
                      id="additional-documents-field"
                      type="file"
                      multiple
                      className="sr-only"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      name={field.name}
                      onChange={(e) => {
                        const incomingFiles = Array.from(e.target.files ?? []);

                        if (incomingFiles.length === 0) {
                          return;
                        }

                        field.handleChange([...files, ...incomingFiles]);
                        e.target.value = "";
                      }}
                    />
                    {files.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {files.length} of {MAX_ADDITIONAL_DOCUMENTS} added
                      </span>
                    )}
                  </div>
                  {files.length > 0 ? (
                    <ul className="mt-2 flex flex-col gap-2">
                      {files.map((file, index) => {
                        const fileError = isInvalid
                          ? getAdditionalDocumentErrorMessage(file)
                          : null;
                        return (
                          <li
                            key={`${file.name}-${index}`}
                            className={`inline-flex max-w-full items-center gap-2 rounded-lg border bg-muted px-3 py-2 text-sm ${
                              fileError
                                ? "border-destructive bg-destructive/10 text-destructive"
                                : "border-border text-muted-foreground"
                            }`}
                          >
                            <span className="flex min-w-0 items-center gap-2">
                              <FileText
                                size="16"
                                className={`shrink-0 ${
                                  fileError
                                    ? "text-destructive"
                                    : "text-primary"
                                }`}
                              />
                              <span className="truncate">{file.name}</span>
                              <span
                                className={`text-xs ${
                                  fileError
                                    ? "text-destructive"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {formatFileSize(file.size)}
                              </span>
                            </span>
                            <button
                              type="button"
                              aria-label={`Remove ${file.name}`}
                              onClick={() => {
                                field.handleChange(
                                  files.filter((_, i) => i !== index),
                                );
                                field.handleBlur();
                              }}
                              className="text-muted-foreground transition-colors hover:text-destructive focus:outline-none"
                            >
                              <X size="16" />
                            </button>
                            {/* {fileError && (
                              <p className="text-xs font-normal text-destructive">
                                {fileError}
                              </p>
                            )} */}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      PDF, DOC, DOCX, or image files
                    </span>
                  )}
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="bio">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Professional bio{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    placeholder="Tell us about your experience and expertise..."
                    rows={4}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <Button type="submit" size="lg" disabled={applyPending}>
            {applyPending ? (
              <>
                <Spinner />
                Submitting...
              </>
            ) : (
              "Submit application"
            )}
          </Button>
        </FieldGroup>
      </form>

      <p className="text-sm leading-relaxed text-muted-foreground">
        Already an approved doctor?{" "}
        <Link
          href="/login"
          className="font-medium underline underline-offset-4 hover:text-primary"
        >
          Sign in to the Doctor Dashboard
        </Link>
        . Patient applications should use the{" "}
        <Link
          href="/register"
          className="font-medium underline underline-offset-4 hover:text-primary"
        >
          Patient registration
        </Link>{" "}
        form instead.
      </p>
    </div>
  );
}
