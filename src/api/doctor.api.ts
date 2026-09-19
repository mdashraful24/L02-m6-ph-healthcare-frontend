import apiClient from "@/lib/apiClient";
import {
  ApiResponse,
  Doctor,
  DoctorApplicationPayload,
  IApproveDoctorPayload,
  IDoctorParams,
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
