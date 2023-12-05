import * as React from "react";
import Layer from "@/components/Layer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarFallbackIcon from "@/assets/avatar.svg";
import ProfileAvatar from "@/components/ProfileAvatar";

export interface ActivityStatusProps {}

const ActivityStatus = ({}: ActivityStatusProps) => {
  return (
    <Layer
      title="이벤트 활동"
      trigger={
        <div className="space-y-[1.25rem] px-8">
          <div className="font-bold">이벤트 활동</div>
          <div className="space-y-8">
            <ActivityItem />
            <ActivityItem />
            <ActivityItem />
            {/*<ActivityItem />*/}
            {/*<ActivityItem />*/}
            {/*<ActivityItem />*/}
            {/*<ActivityItem />*/}
            {/*<ActivityItem />*/}
            {/*<ActivityItem />*/}
          </div>
        </div>
      }
    >
      <ScrollArea className="h-full">
        <div className="space-y-8 py-8">
          <ActivityItem />
          <ActivityItem />
          <ActivityItem />
          <ActivityItem />
          <ActivityItem />
          <ActivityItem />
          <ActivityItem />
          <ActivityItem />
          <ActivityItem />
          <ActivityItem />
          <ActivityItem />
          <ActivityItem />
          <ActivityItem />
          <ActivityItem />
          <ActivityItem />
          <ActivityItem />
          <ActivityItem />
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </Layer>
  );
};

interface UserItemProps {}

const ActivityItem = ({}: UserItemProps) => {
  return (
    <div className="flex space-x-4">
      <ProfileAvatar size="3rem" />
      <div>
        <div className="text-[0.875rem] font-bold">
          형구 님이 이벤트에 참석해요
        </div>
        <div className="font-bold text-gray-400">3일 전</div>
        <div className="mt-1 text-[1.125rem] font-bold">
          &ldquo;기대가 됩니다 어서만나요&rdquo;
        </div>
      </div>
    </div>
  );
};

export default ActivityStatus;
