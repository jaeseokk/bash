import * as React from "react";
import Layer from "@/components/Layer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarFallbackIcon from "@/assets/avatar.svg";
import ProfileAvatar from "@/components/ProfileAvatar";
import { EventDetail } from "@/types/events";

export interface ActivityStatusProps {
  activities: EventDetail["activities"];
}

const ActivityStatus = ({ activities }: ActivityStatusProps) => {
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
                name={activity.user.username}
                message={activity.message}
                date={activity.createdAt}
              />
            ))}
          </div>
        </div>
      }
    >
      <ScrollArea className="h-full">
        <div className="space-y-8 py-8">
          {activities.map((activity) => (
            <ActivityItem
              key={activity.id}
              name={activity.user.username}
              message={activity.message}
              date={activity.createdAt}
            />
          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </Layer>
  );
};

interface ActivityItemProps {
  name?: string;
  message?: string | null;
  date?: string | Date;
}

const ActivityItem = ({ name, message, date }: ActivityItemProps) => {
  return (
    <div className="flex space-x-4">
      <ProfileAvatar size="3rem" name={name} />
      <div>
        <div className="text-[0.875rem] font-bold">
          {name} 님이 이벤트에 참석해요
        </div>
        <div className="font-bold text-gray-400">3일 전</div>
        <div className="mt-1 text-[1.125rem] font-bold">
          &ldquo;{message}&rdquo;
        </div>
      </div>
    </div>
  );
};

export default ActivityStatus;
