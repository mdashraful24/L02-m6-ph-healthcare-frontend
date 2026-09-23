import apiClient from "@/lib/apiClient";
import type {
    ApiResponse,
    IBookAppointmentPayload,
    IBookAppointmentResponse,
} from "@/types";

export function bookAppointment(payload: IBookAppointmentPayload) {
    return apiClient<ApiResponse<IBookAppointmentResponse>>(
        "/appointment/book-appointment",
        {
            method: "POST",
            body: payload,
        },
    );
}

export function getMyAppointments(params: { page?: number; limit?: number }) {
    return apiClient("/appointment/my-appointments", {
        params,
    });
}