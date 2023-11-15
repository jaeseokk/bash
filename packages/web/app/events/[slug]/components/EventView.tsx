"use client";

import * as React from "react";
import EventInput from "@/components/EventInput";
import Image from "next/image";
import { cn, shimmer, toBase64 } from "@/utils";
import DatePicker from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { PrismaDBMainTypes, PrismaDBMainConstants } from "@bash/db";
import { signIn, useSession } from "next-auth/react";
import ky from "ky";
import { useRouter } from "next/navigation";
import { getPalette } from "shared/lib/color-thief";
import { useState } from "react";
import LoginForm from "../../../signin/components/LoginForm";
import BottomSheet from "@/components/BottomSheet";

export interface EventViewProps {
  eventInfo: PrismaDBMainTypes.Event & {
    attendances: PrismaDBMainTypes.Attendance[];
  };
}

const EventView = ({ eventInfo }: EventViewProps) => {
  const session = useSession();
  const router = useRouter();
  const [showLoginBottomSheet, setShowLoginBottomSheet] = useState(false);
  const [coverImagePalette, setCoverImagePalette] =
    useState<
      [
        [number, number, number],
        [number, number, number],
        [number, number, number],
        [number, number, number],
      ]
    >();
  const [cachedAttendanceStatus, setCachedAttendanceStatus] =
    useState<PrismaDBMainTypes.AttendanceStatus>();
  const isMyEvent = session.data?.user.id === eventInfo.authorId;
  const isPublished = !!eventInfo.publishedAt;
  const attendanceStatus = eventInfo.attendances.find(
    (attendance) => attendance.userId === session.data?.user.id,
  )?.status;

  const handlePublish = async () => {
    const res = await ky.put(`/api/publish-event`, {
      json: {
        id: eventInfo.id,
      },
    });

    if (!res.ok) {
      return;
    }

    router.refresh();
  };
  const handleAttend = async (status: PrismaDBMainTypes.AttendanceStatus) => {
    if (session.status !== "authenticated") {
      setShowLoginBottomSheet(true);
      setCachedAttendanceStatus(status);
      return;
    }

    const res = await ky.put(`/api/attend-event`, {
      json: {
        id: eventInfo.id,
        status,
      },
    });

    if (!res.ok) {
      return;
    }

    router.refresh();
  };

  return (
    <>
      <div>
        <div
          className="pointer-events-none fixed inset-0 z-[-1]"
          style={
            coverImagePalette
              ? {
                  background: `linear-gradient(-45deg, rgb(${coverImagePalette[0].join(
                    ",",
                  )}), rgb(${coverImagePalette[1].join(
                    ",",
                  )}), rgb(${coverImagePalette[2].join(
                    ",",
                  )}), rgb(${coverImagePalette[3].join(",")}))`,
                  animation: `gradient 5s ease infinite`,
                  backgroundSize: "150% 150%",
                }
              : undefined
          }
        />
        <Block className="mb-4">
          <EventInput placeholder="Title" value={eventInfo.title} viewMode />
        </Block>
        <div className="mb-4">
          <Image
            src={eventInfo.coverImage ?? "https://picsum.photos/300/200"}
            alt="Party main image"
            width="200"
            height="200"
            style={{
              width: "100%",
              height: "auto",
            }}
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(1, 1))}`}
            sizes="100vw"
            onLoad={async (e) => {
              const img = e.currentTarget;
              const palette = await getPalette(img);

              setCoverImagePalette(palette as any);
            }}
          />
        </div>
        <Block className="mb-6">
          <DatePicker
            placeholder="날짜 및 시간"
            value={eventInfo.date}
            viewMode
          />
        </Block>
        <Block className="mb-6 space-y-2">
          <EventInput
            label="모임장"
            placeholder="홍길동"
            value={eventInfo.authorName ?? (session.data?.user.name || "")}
            viewMode
          />
          {eventInfo.location && (
            <EventInput
              label="장소 위치"
              placeholder="주소, 링크"
              value={eventInfo.location}
              viewMode
            />
          )}
        </Block>
        {eventInfo.description && <Block>{eventInfo.description}</Block>}
        <FloatingArea>
          <div className="flex bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {eventInfo.publishedAt && (
              <>
                <Button
                  className={cn(
                    "h-20 flex-1 text-2xl",
                    attendanceStatus ===
                      PrismaDBMainConstants.AttendanceStatus.ATTENDING &&
                      "bg-green-500",
                  )}
                  variant="ghost"
                  disabled={isMyEvent}
                  onClick={() => {
                    return handleAttend(
                      PrismaDBMainConstants.AttendanceStatus.ATTENDING,
                    );
                  }}
                >
                  👍
                </Button>
                <Button
                  className={cn(
                    "h-20 flex-1 text-2xl",
                    attendanceStatus ===
                      PrismaDBMainConstants.AttendanceStatus.MAYBE &&
                      "bg-green-500",
                  )}
                  variant="ghost"
                  disabled={isMyEvent}
                  onClick={() => {
                    return handleAttend(
                      PrismaDBMainConstants.AttendanceStatus.MAYBE,
                    );
                  }}
                >
                  🤔
                </Button>
                <Button
                  className={cn(
                    "h-20 flex-1 text-2xl",
                    attendanceStatus ===
                      PrismaDBMainConstants.AttendanceStatus.NOT_ATTENDING &&
                      "bg-green-500",
                  )}
                  variant="ghost"
                  disabled={isMyEvent}
                  onClick={() => {
                    return handleAttend(
                      PrismaDBMainConstants.AttendanceStatus.NOT_ATTENDING,
                    );
                  }}
                >
                  😢
                </Button>
              </>
            )}
          </div>
          {!isPublished && (
            <Button className="w-full" size="lg" onClick={handlePublish}>
              Publish
            </Button>
          )}
        </FloatingArea>
      </div>
      <BottomSheet
        snapPoints={[400, 0]}
        isOpen={showLoginBottomSheet}
        onClose={() => {
          setShowLoginBottomSheet(false);
        }}
      >
        <div className="px-4 pb-10 pt-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Sign In</h1>
          </div>
          <div className="mt-4">
            <LoginForm
              onSubmit={async (data) => {
                return signIn("credentials", {
                  redirect: false,
                  ...data,
                });
              }}
              onCallback={() => {
                if (!cachedAttendanceStatus) {
                  return;
                }

                return handleAttend(cachedAttendanceStatus);
              }}
            />
          </div>
        </div>
      </BottomSheet>
    </>
  );
};

interface BlockProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Block = ({ children, className, ...rest }: BlockProps) => {
  return (
    <div className={cn("mx-auto max-w-[750px] px-2", className)} {...rest}>
      {children}
    </div>
  );
};

interface FloatingAreaProps {
  children: React.ReactNode;
}

const FloatingArea = ({ children }: FloatingAreaProps) => {
  return <div className="fixed bottom-0 left-0 right-0">{children}</div>;
};

export default EventView;
