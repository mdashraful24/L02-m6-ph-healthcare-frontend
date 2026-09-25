export type ScheduleStatus = "DRAFT" | "PUBLISHED";

export interface ISchedule {
  id: string;
  startDateTime: string;
  endDateTime: string;
  totalSlots: number;
  availableSlots: number;
  meetingLink: string;
  status: ScheduleStatus;
  doctorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateSchedulePayload {
  startDateTime: string;
  endDateTime: string;
  meetingLink: string;
}

export interface IScheduleParams {
  status?: ScheduleStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "desc" | "asc";
}
