import { apiRequest } from "@/lib/api";
import type { ApiMessageResponse, ModeratorConfigLecturerRequest } from "@/types";

export async function configLecturer(lecturerId: number, payload: ModeratorConfigLecturerRequest) {
  return apiRequest<ApiMessageResponse>(`/api/Moderator/lecturer-config/${lecturerId}`, {
    method: "PUT",
    body: payload
  });
}
