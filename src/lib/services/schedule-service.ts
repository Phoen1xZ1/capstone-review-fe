import { apiRequest } from "@/lib/api";
import type {
  ApiMessageResponse,
  AutoScheduleRequest,
  ScheduleItem,
  ValidateAssignmentRequest
} from "@/types";

export async function autoSchedule(payload: AutoScheduleRequest) {
  return apiRequest<ApiMessageResponse>("/api/Schedule/auto-schedule", {
    method: "POST",
    body: payload
  });
}

export async function validateManualAssignment(params: ValidateAssignmentRequest) {
  const searchParams = new URLSearchParams({
    slotId: String(params.slotId),
    lecturerId: String(params.lecturerId)
  });

  return apiRequest<ApiMessageResponse>(`/api/Schedule/validate-assignment?${searchParams.toString()}`, {
    method: "POST"
  });
}

export async function getScheduleByRound(reviewRound: number) {
  return apiRequest<ScheduleItem[]>(`/api/Schedule/${reviewRound}`);
}
