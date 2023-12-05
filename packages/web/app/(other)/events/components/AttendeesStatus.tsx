import * as React from "react";
import Layer from "@/components/Layer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarFallbackIcon from "@/assets/avatar.svg";
import ProfileAvatar from "@/components/ProfileAvatar";
import Divider from "@/components/Divider";

export interface AttendeesStatusProps {}

const AttendeesStatus = ({}: AttendeesStatusProps) => {
  return (
    <Layer
      title="참석자 리스트"
      trigger={
        <div className="space-y-[1.25rem]">
          <div className="px-8 font-bold">3명이 갈게요! 라고 응답했어요</div>
          <ScrollArea>
            <div className="flex space-x-[0.75rem] px-8">
              <UserItem />
              <UserItem />
              <UserItem />
              <UserItem />
              <UserItem />
              <UserItem />
              <UserItem />
              <UserItem />
              <UserItem />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      }
    >
      <Divider />
      <div>
        <div className="mb-4 font-bold">갈게요 (00명)</div>
        <ul className="grid grid-cols-4 gap-4">
          <UserItem />
          <UserItem />
          <UserItem />
          <UserItem />
          <UserItem />
          <UserItem />
          <UserItem />
          <UserItem />
          <UserItem />
          <UserItem />
          <UserItem />
          <UserItem />
          <UserItem />
          <UserItem />
          <UserItem />
          <UserItem />
          <UserItem />
          <UserItem />
        </ul>
      </div>
    </Layer>
  );
};

interface UserItemProps {}

const UserItem = ({}: UserItemProps) => {
  return (
    <div className="flex flex-col items-center space-y-[0.25rem]">
      <ProfileAvatar size="3rem" />
      <div className="text-[0.75rem]">형구</div>
    </div>
  );
};

export default AttendeesStatus;
