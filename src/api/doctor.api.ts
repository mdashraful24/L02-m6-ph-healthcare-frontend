import apiClient from "@/lib/apiClient";
import { DoctorApplicationPayload, VerifyAccountPayload } from "@/types";

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

export function verifyDoctorAccount(payload: VerifyAccountPayload){
    return apiClient("/doctor/apply-as-doctor/verify-email", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}