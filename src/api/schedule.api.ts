import apiClient from "@/lib/apiClient";
import {
    ApiResponse,
    CreateSchedulePayload,
    Schedule,
    ScheduleParams,
} from "@/types";

export function createSchedule(payload: CreateSchedulePayload) {
    return apiClient<ApiResponse<Schedule>>("/schedule/create-schedule", {
        method: "POST",
        body: payload,
    });
}

export function getMySchedules(params: ScheduleParams) {
    return apiClient<ApiResponse<Schedule[]>>("/schedule/my-schedules", {
        params,
    });
}