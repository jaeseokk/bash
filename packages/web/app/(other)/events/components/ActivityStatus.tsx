"use client";

import * as React from "react";
import Layer, { LayerContentWithScrollArea } from "@/components/Layer";
import ProfileAvatar from "@/components/ProfileAvatar";
import { EventDetail } from "@/types/events";
import { formatDistanceToNowInKorean } from "@/utils";
import { PrismaDBMainConstants, PrismaDBMainTypes } from "@bash/db";

export interface ActivityStatusProps {
  activities: EventDetail["activities"];
}

const ActivityStatus = ({ activities }: ActivityStatusProps) => {
  if (activities.length) {
    return null
  }

  return (
    <Layer
      title="이벤트 활동"
      trigger={
        <div className="space-y-[1.25rem] px-8">
          <div className="font-bold">이벤트 활동</div>
          <div className="space-y-8">
            {activities.slice(0, 3).map((activity) => (
              <ActivityItem
                key={activity.id}
                status={activity.status}
                name={activity.user.username}
                message={activity.message}
                date={activity.createdAt}
              />
            ))}
          </div>
        </div>
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
            />
          ))}
        </div>
      </LayerContentWithScrollArea>
    </Layer>
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
}

const ActivityItem = ({ status, name, message, date }: ActivityItemProps) => {
  return (
    <div className="flex space-x-4">
      <ProfileAvatar size="3rem" name={name} />
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
