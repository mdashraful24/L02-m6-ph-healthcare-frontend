import apiClient from "@/lib/apiClient";
import type { ApiResponse, IChatPayload, IChatResponse } from "@/types";

export function sendChatMessage(payload: IChatPayload) {
  return apiClient<ApiResponse<IChatResponse>>("/chat", {
    method: "POST",
    body: payload,
  });
}
