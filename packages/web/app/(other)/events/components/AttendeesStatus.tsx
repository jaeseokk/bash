import * as React from "react";
import Layer from "@/components/Layer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarFallbackIcon from "@/assets/avatar.svg";
import ProfileAvatar from "@/components/ProfileAvatar";
import Divider from "@/components/Divider";
import { EventDetail } from "@/types/events";

export interface AttendeesStatusProps {
  attendances: EventDetail["attendances"];
}

const AttendeesStatus = ({ attendances }: AttendeesStatusProps) => {
  return (
    <Layer
      title="참석자 리스트"
      trigger={
        <div className="space-y-[1.25rem]">
          <div className="px-8 font-bold">
            {attendances.length}명이 갈게요! 라고 응답했어요
          </div>
          <ScrollArea>
            <div className="flex space-x-[0.75rem] px-8">
              {attendances.map((attendance) => (
                <UserItem key={attendance.id} name={attendance.user.username} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      }
    >
      <Divider />
      <div>
        <div className="mb-4 font-bold">갈게요 ({attendances.length}명)</div>
        <ul className="grid grid-cols-4 gap-4">
          {attendances.map((attendance) => (
            <UserItem key={attendance.id} name={attendance.user.username} />
          ))}
        </ul>
      </div>
    </Layer>
  );
};

interface UserItemProps {
  name: string;
}

const UserItem = ({ name }: UserItemProps) => {
  return (
    <div className="flex flex-col items-center space-y-[0.25rem]">
      <ProfileAvatar size="3rem" name={name} />
      <div className="text-[0.75rem]">{name}</div>
    </div>
  );
};

export default AttendeesStatus;
