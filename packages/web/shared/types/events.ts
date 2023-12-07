import { PrismaDBMainTypes } from "@bash/db";

export interface EventDetail extends PrismaDBMainTypes.Event {
  attendances: {
    id: number;
    userId: number;
    eventId: number;
    status: PrismaDBMainTypes.AttendanceStatus;
    user: {
      username: string;
    };
  }[];
  activities: {
    id: number;
    userId: number;
    eventId: number;
    attendanceId: number;
    createdAt: Date | string;
    message: string | null;
    emoji: string;
    status: PrismaDBMainTypes.AttendanceStatus;
    user: {
      username: string;
    };
  }[];
}

export type PreviewEventDetail = Pick<
  EventDetail,
  | "title"
  | "coverImage"
  | "startDate"
  | "endDate"
  | "authorName"
  | "location"
  | "description"
>;
