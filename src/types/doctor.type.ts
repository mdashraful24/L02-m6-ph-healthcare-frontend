import { User } from "./user.type";

export interface DoctorApplicationData {
  user: {
    name: string;
    email: string;
  };
  doctor: {
    specialization: string;
    licenseNumber: string;
    qualifications: string;
    experienceYears: number;
    contactNumber: string;
    address: string;
    consultationFee: number | undefined;
    bio: string;
  };
}

export interface DoctorApplicationPayload {
  resume: File;
  additionalDocuments: File[];
  data: DoctorApplicationData;
}

export type DoctorVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface Doctor {
  id: string;
  name: string;
  email: string;
  address?: string | null;
  specialization: string;
  licenseNumber: string;
  qualifications: string;
  experienceYears: number;
  bio?: string | null;
  consultationFee?: string | null;
  contactNumber?: string | null;
  verificationStatus: DoctorVerificationStatus;
  rejectionReason?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  resume?: string | null;
  resumePublicId?: string | null;
  additionalDocuments?: { url: string; publicId: string }[] | null;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: User;
}

export interface IDoctorParams {
  verificationStatus?: DoctorVerificationStatus;
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortOrder?: "desc" | "asc";
}

export interface IApproveDoctorPayload {
  doctorId: string;
  verificationStatus: "VERIFIED" | "REJECTED";
  rejectionReason?: string;
}