import { apiRequest } from "@/lib/api";
import type { Lecturer } from "@/types";

// Fallback mock data — mirrors the API shape
const mockLecturers: Lecturer[] = [
  { id: 1, fullName: "Nguyen Van A", email: "gv1@fpt.edu.vn", minSlot: 1, maxSlot: 10 },
  { id: 2, fullName: "Tran Thi B",   email: "gv2@fpt.edu.vn", minSlot: 1, maxSlot: 10 },
  { id: 3, fullName: "Le Hoang C",   email: "gv3@fpt.edu.vn", minSlot: 1, maxSlot: 10 },
  { id: 4, fullName: "Pham D",       email: "gv4@fpt.edu.vn", minSlot: 1, maxSlot: 10 },
  { id: 5, fullName: "Hoang E",      email: "gv5@fpt.edu.vn", minSlot: 1, maxSlot: 10 },
];

/** GET /api/Lecturer — fallback to mock data if API unavailable */
export async function getLecturers(): Promise<Lecturer[]> {
  try {
    const data = await apiRequest<Lecturer[]>("/api/Lecturer");
    if (Array.isArray(data) && data.length > 0) return data;
    return mockLecturers;
  } catch (err) {
    console.warn("[getLecturers] API unavailable, using mock data.", err);
    return mockLecturers;
  }
}
