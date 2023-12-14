import { PrismaDBMainTypes } from "@bash/db";

export interface EventItem extends PrismaDBMainTypes.Event {
  author: {
    id: number;
    username: string;
    avatarFallback?: string | null;
  };
}

export interface EventDetail extends PrismaDBMainTypes.Event {
  author: {
    username: string;
  };
  attendances: {
    id: number;
    userId: number;
    eventId: number;
    status: PrismaDBMainTypes.AttendanceStatus;
    user: {
      id: number;
      username: string;
      avatarFallback?: string | null;
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
      id: number;
      username: string;
      avatarFallback?: string | null;
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
  | "spots"
  | "effect"
>;
