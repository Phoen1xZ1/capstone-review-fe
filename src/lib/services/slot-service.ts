import { apiRequest } from "@/lib/api";
import type { AvailableSlot } from "@/types";

export async function getAvailableSlots() {
  return apiRequest<AvailableSlot[]>("/api/Slot/available");
}
