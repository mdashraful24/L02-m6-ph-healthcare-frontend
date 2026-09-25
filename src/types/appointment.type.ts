import { ISchedule } from "./schedule.type";

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "ONGOING"
  | "COMPLETED";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export interface IPayment {
  id: string;
  status: PaymentStatus;
  amount: number | string;
  currency: string;
  bkashPaymentId?: string | null;
  bkashTrxId?: string | null;
  payerReference?: string | null;
  paidAt?: string | null;
  refundTrxId?: string | null;
  refundAmount?: number | string | null;
  refundReason?: string | null;
  refundedAt?: string | null;
  appointmentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAppointmentDoctor {
  id: string;
  name: string;
  specialization: string;
  email?: string;
  userId?: string;
}

export interface IAppointmentPatient {
  id: string;
  name: string;
  email: string;
  contactNumber?: string | null;
  userId?: string;
}

export interface IAppointment {
  id: string;
  status: AppointmentStatus;
  joiningTime?: string | null;
  serialNumber?: number | null;
  recordUrl?: string | null;
  prescriptionUrl?: string | null;
  patientId: string;
  doctorId: string;
  scheduleId: string;
  createdAt: string;
  updatedAt: string;
  patient?: IAppointmentPatient;
  doctor?: IAppointmentDoctor;
  schedule?: ISchedule;
  payment?: IPayment | null;
}

export interface IAppointmentParams {
  status?: AppointmentStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "desc" | "asc";
}

export interface IBookAppointmentPayload {
  scheduleId: string;
}

export interface IPayAppointmentPayload {
  appointmentId: string;
}

export interface ICancelAppointmentPayload {
  appointmentId: string;
}

export interface IBookAppointmentResponse {
  paymentUrl: string;
}
