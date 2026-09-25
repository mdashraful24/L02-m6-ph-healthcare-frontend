import apiClient from "@/lib/apiClient";
import {
  ApiResponse,
  ICreateSchedulePayload,
  ISchedule,
  IScheduleParams,
} from "@/types";

export function createSchedule(payload: ICreateSchedulePayload) {
  return apiClient<ApiResponse<ISchedule>>("/schedule/create-schedule", {
    method: "POST",
    body: payload,
  });
}

export function getMySchedules(params: IScheduleParams) {
  return apiClient<ApiResponse<ISchedule[]>>("/schedule/my-schedules", {
    params,
  });
}

export function publishSchedule(scheduleId: string) {
  return apiClient<ApiResponse<ISchedule>>(
    `/schedule/publish-schedule/${scheduleId}`,
    { method: "PATCH" },
  );
}

export function deleteSchedule(scheduleId: string) {
  return apiClient<ApiResponse<ISchedule>>(
    `/schedule/delete-schedule/${scheduleId}`,
    {
      method: "DELETE",
    },
  );
}
