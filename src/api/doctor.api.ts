import apiClient from "@/lib/apiClient";
import {
  ApiResponse,
  Doctor,
  DoctorApplicationPayload,
  IApproveDoctorPayload,
  IDoctorParams,
  IPublicDoctorParams,
  IPublicDoctorProfile,
  ISchedule,
  VerifyAccountPayload,
} from "@/types";

export function applyAsDoctor(payload: DoctorApplicationPayload) {
  const formData = new FormData();

  formData.append("data", JSON.stringify(payload.data));
  formData.append("resume", payload.resume);

  for (const document of payload.additionalDocuments) {
    formData.append("additionalDocuments", document);
  }

  return apiClient("/doctor/apply-as-doctor", {
    method: "POST",
    body: formData,
  });
}

export function verifyDoctorAccount(payload: VerifyAccountPayload) {
  return apiClient("/doctor/apply-as-doctor/verify-email", {
    method: "POST",
    body: payload,
  });
}

export function getAllDoctors(params: IDoctorParams) {
  return apiClient<ApiResponse<Doctor[]>>("/doctor/all-doctors", {
    params,
  });
}

export function approveDoctor(payload: IApproveDoctorPayload) {
  return apiClient(`/doctor/approve-doctor`, {
    method: "POST",
    body: payload,
  });
}

export function getAllPublicDoctors(params: IPublicDoctorParams) {
  return apiClient<ApiResponse<IPublicDoctorProfile[]>>(
    "/doctor/all-doctors-public",
    {
      params,
    },
  );
}

export function getPublicDoctorProfile(doctorId: string) {
  return apiClient<ApiResponse<IPublicDoctorProfile>>(
    `/doctor/public/${doctorId}`,
  );
}

export function getTodayScheduleByDoctor(params: {
  doctorId?: string;
  page?: number;
  limit?: number;
}) {
  return apiClient<ApiResponse<ISchedule[]>>("/schedule/todays-schedule", {
    params,
  });
}
