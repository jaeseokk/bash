import * as React from "react";
import Layer, { LayerContentWithScrollArea } from "@/components/Layer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarFallbackIcon from "@/assets/avatar.svg";
import ProfileAvatar from "@/components/ProfileAvatar";
import Divider from "@/components/Divider";
import { EventDetail } from "@/types/events";
import { cn } from "@/lib/utils";

const groupBy = <T, K extends string>(
  list: T[],
  keyGetter: (item: T) => K,
): Record<K, T[]> => {
  const map: Record<string, T[]> = {};
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map[key];
    if (!collection) {
      map[key] = [item];
    } else {
      collection.push(item);
    }
  });
  return map;
};

const LABELS = {
  ATTENDING: "갈게요",
  MAYBE: "아마도",
  NOT_ATTENDING: "어려울 듯",
} as const;

export interface AttendeesStatusProps {
  attendances: EventDetail["attendances"];
}

const AttendeesStatus = ({ attendances }: AttendeesStatusProps) => {
  const attendancesByStatus = groupBy(
    attendances,
    (attendance) => attendance.status,
  );

  if (
    !attendancesByStatus["ATTENDING"] ||
    attendancesByStatus["ATTENDING"].length === 0
  ) {
    return null;
  }

  return (
    <div className="space-y-[1.25rem]">
      <div className="flex items-center justify-between px-8 font-bold">
        <div>
          {attendancesByStatus["ATTENDING"].length}명이 갈게요! 라고 응답했어요
        </div>
        <div>
          <Layer
            urlStateKey={"attendees-status"}
            title="참석자 리스트"
            trigger={
              <button className="text-[0.875rem] underline">더보기</button>
            }
          >
            <LayerContentWithScrollArea>
              <div>
                {(["ATTENDING", "MAYBE", "NOT_ATTENDING"] as const).map(
                  (status) => {
                    const list = attendancesByStatus[status];

                    if (!list || list.length === 0) {
                      return null;
                    }

                    return (
                      <React.Fragment key={status}>
                        <Divider />
                        <div>
                          <div className="mb-4 font-bold">
                            {LABELS[status]} ({list.length}명)
                          </div>
                          <ul className="grid grid-cols-4 gap-4">
                            {list.map((item) => (
                              <li className="list-none" key={item.id}>
                                <UserItem
                                  name={item.user.username}
                                  avatarFallback={item.user.avatarFallback}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      </React.Fragment>
                    );
                  },
                )}
              </div>
            </LayerContentWithScrollArea>
          </Layer>
        </div>
      </div>
      <ScrollArea>
        <div className="flex space-x-[0.75rem] px-8 pb-4">
          {attendancesByStatus["ATTENDING"].map((attendance) => (
            <li className="list-none" key={attendance.id}>
              <UserItem
                className="w-12"
                name={attendance.user.username}
                avatarFallback={attendance.user.avatarFallback}
              />
            </li>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

interface UserItemProps {
  className?: string;
  name: string;
  avatarFallback?: string | null;
}

const UserItem = ({ className, name, avatarFallback }: UserItemProps) => {
  return (
    <div
      className={cn("flex flex-col items-center space-y-[0.25rem]", className)}
      title={name}
    >
      <ProfileAvatar size="3rem" name={name} avatarFallback={avatarFallback} />
      <div className="line-clamp-2 w-full text-center text-[0.75rem]">
        {name}
      </div>
    </div>
  );
};

export default AttendeesStatus;
