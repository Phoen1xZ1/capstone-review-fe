export type ApiMessageResponse = {
  message: string;
};

export type ApiErrorResponse = {
  error: string;
  details?: string;
};

export type AvailableSlot = {
  slotId: number;
  startTime: string;
  endTime: string;
  room: string;
};

/** Team booking — leaderRollNumber thay cho leaderId theo API doc */
export type TeamBookingRequest = {
  leaderRollNumber: string;
  slotIds: number[];
};

export type LecturerBookingRequest = {
  lecturerId: number;
  slotIds: number[];
};

export type ModeratorConfigLecturerRequest = {
  minSlot: number;
  maxSlot: number;
};

export type AutoScheduleRequest = {
  reviewRound: number;
};

export type ValidateAssignmentRequest = {
  slotId: number;
  lecturerId: number;
};

export type ScheduleLecturer = {
  lecturerId: number;
  fullName: string;
  email: string;
};

export type ScheduleTopic = {
  topicId: number;
  title: string;
  teamId: number;
  teamName: string;
  instructorId: number;
  instructorName: string;
};

export type ScheduleItem = {
  slotId: number;
  reviewRound: number;
  startTime: string;
  endTime: string;
  room: string;
  reviewers: ScheduleLecturer[];
  topics: ScheduleTopic[];
};

/** Lecturer from GET /api/Lecturer */
export type Lecturer = {
  id: number;
  fullName: string;
  email: string;
  minSlot: number;
  maxSlot: number;
};

/** Team from GET /api/Team */
export type Team = {
  id: number;
  teamName: string;
  leaderId: number;
  leaderRollNumber: string;
  topicId: number;
};

/** Auth */
export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  fullName: string;
  role: "Moderator" | "Lecturer" | "Student" | string;
};

