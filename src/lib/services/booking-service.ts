import { apiRequest } from "@/lib/api";
import type {
  ApiMessageResponse,
  LecturerBookingRequest,
  TeamBookingRequest
} from "@/types";

export async function bookTeam(payload: TeamBookingRequest) {
  return apiRequest<ApiMessageResponse>("/api/Booking/team", {
    method: "POST",
    body: payload
  });
}

export async function bookLecturer(payload: LecturerBookingRequest) {
  return apiRequest<ApiMessageResponse>("/api/Booking/lecturer", {
    method: "POST",
    body: payload
  });
}
