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

export type TeamBookingRequest = {
  teamId: number;
  leaderId: number;
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
