"use client";

import * as React from "react";
import Layer, { LayerContentWithScrollArea } from "@/components/Layer";
import ProfileAvatar from "@/components/ProfileAvatar";
import { EventDetail } from "@/types/events";
import { formatDistanceToNowInKorean } from "@/utils";
import { PrismaDBMainConstants, PrismaDBMainTypes } from "@bash/db";
import Emoji from "@/components/Emoji";

export interface ActivityStatusProps {
  activities: EventDetail["activities"];
}

const ActivityStatus = ({ activities }: ActivityStatusProps) => {
  if (activities.length === 0) {
    return null;
  }

  return (
    <div className="space-y-[1.25rem] px-8">
      <div className="flex items-center justify-between font-bold">
        <div>이벤트 활동</div>
        <div>
          <Layer
            urlStateKey={"event-activities"}
            title="이벤트 활동"
            trigger={
              <button className="text-[0.875rem] underline">더보기</button>
            }
          >
            <LayerContentWithScrollArea>
              <div className="space-y-8 py-8">
                {activities.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    status={activity.status}
                    name={activity.user.username}
                    message={activity.message}
                    date={activity.createdAt}
                    emoji={activity.emoji}
                    avatarFallback={activity.user.avatarFallback}
                  />
                ))}
              </div>
            </LayerContentWithScrollArea>
          </Layer>
        </div>
      </div>
      <div className="space-y-8">
        {activities.slice(0, 3).map((activity) => (
          <ActivityItem
            key={activity.id}
            status={activity.status}
            name={activity.user.username}
            message={activity.message}
            date={activity.createdAt}
            emoji={activity.emoji}
            avatarFallback={activity.user.avatarFallback}
          />
        ))}
      </div>
    </div>
  );
};

const getTitleMessage = (
  status: PrismaDBMainConstants.AttendanceStatus,
  name: string,
) => {
  switch (status) {
    case PrismaDBMainConstants.AttendanceStatus.ATTENDING:
      return `${name} 님이 참석해요`;
    case PrismaDBMainConstants.AttendanceStatus.NOT_ATTENDING:
      return `${name} 님이 불참해요`;
    case PrismaDBMainConstants.AttendanceStatus.MAYBE:
      return `${name} 님이 고민중`;
    default:
      return "";
  }
};

interface ActivityItemProps {
  status: PrismaDBMainConstants.AttendanceStatus;
  name: string;
  message?: string | null;
  date: string | Date;
  emoji?: string | null;
  avatarFallback?: string | null;
}

const ActivityItem = ({
  status,
  name,
  message,
  date,
  emoji,
  avatarFallback,
}: ActivityItemProps) => {
  return (
    <div className="flex items-start space-x-4">
      <div className="relative">
        <ProfileAvatar
          size="3rem"
          name={name}
          avatarFallback={avatarFallback}
        />
        {emoji && (
          <div className="absolute bottom-0 right-0">
            <Emoji code={emoji as any} size="1.125rem" />
          </div>
        )}
      </div>
      <div>
        <div className="text-[0.875rem] font-bold">
          {getTitleMessage(status, name)}
        </div>
        <div className="text-[0.8125rem] font-bold text-gray-400">
          {formatDistanceToNowInKorean(new Date(date))}
        </div>
        {message && (
          <div className="mt-1 text-[1.125rem] font-bold">
            &ldquo;{message}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityStatus;
