"use client";

import * as React from "react";
import EventInput from "@/components/EventInput";
import Image from "next/image";
import { cn, shimmer, toBase64 } from "@/utils";
import { PrismaDBMainTypes, PrismaDBMainConstants } from "@bash/db";
import { signIn, useSession } from "next-auth/react";
import ky from "ky";
import { useRouter } from "next/navigation";
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
    setShowLoginBottomSheet(false);
  };

  return (
    <>
      <div>
        {eventInfo.coverImage && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-[-3.5rem] z-[-1] overflow-hidden">
            <div
              className="absolute bottom-0 left-0 right-0 top-0"
              style={{
                background:
                  "linear-gradient(0deg, #000 27.08%, rgba(0, 0, 0, 0.50) 100%)",

                backdropFilter: "blur(25px)",
              }}
            ></div>
            <Image
              src={eventInfo.coverImage}
              alt=""
              width="200"
              height="200"
              style={{
                width: "auto",
                height: "120%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>
        )}
        <Block className="mb-[3.125rem]">
          <div className="whitespace-pre-wrap text-center text-[1.75rem] font-bold">
            {eventInfo.title}
          </div>
        </Block>
        <Block className="mb-[1.625rem]">
          <div className="relative overflow-hidden rounded-2xl border border-[#343434]">
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
              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                shimmer(1, 1),
              )}`}
              sizes="100vw"
            />
          </div>
        </Block>
        <Block className="mb-6">{eventInfo.date.toDateString()}</Block>
        <Block className="mb-6 space-y-2">
          <div>{eventInfo.authorName ?? (session.data?.user.name || "")}</div>
          <div>{eventInfo.location}</div>
        </Block>
        {eventInfo.description && <Block>{eventInfo.description}</Block>}
        {/*<FloatingArea>*/}
        {/*  <div className="flex bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">*/}
        {/*    {eventInfo.publishedAt && (*/}
        {/*      <>*/}
        {/*        <Button*/}
        {/*          className={cn(*/}
        {/*            "h-20 flex-1 text-2xl",*/}
        {/*            attendanceStatus ===*/}
        {/*              PrismaDBMainConstants.AttendanceStatus.ATTENDING &&*/}
        {/*              "bg-green-500",*/}
        {/*          )}*/}
        {/*          variant="ghost"*/}
        {/*          disabled={isMyEvent}*/}
        {/*          onClick={() => {*/}
        {/*            return handleAttend(*/}
        {/*              PrismaDBMainConstants.AttendanceStatus.ATTENDING,*/}
        {/*            );*/}
        {/*          }}*/}
        {/*        >*/}
        {/*          👍*/}
        {/*        </Button>*/}
        {/*        <Button*/}
        {/*          className={cn(*/}
        {/*            "h-20 flex-1 text-2xl",*/}
        {/*            attendanceStatus ===*/}
        {/*              PrismaDBMainConstants.AttendanceStatus.MAYBE &&*/}
        {/*              "bg-green-500",*/}
        {/*          )}*/}
        {/*          variant="ghost"*/}
        {/*          disabled={isMyEvent}*/}
        {/*          onClick={() => {*/}
        {/*            return handleAttend(*/}
        {/*              PrismaDBMainConstants.AttendanceStatus.MAYBE,*/}
        {/*            );*/}
        {/*          }}*/}
        {/*        >*/}
        {/*          🤔*/}
        {/*        </Button>*/}
        {/*        <Button*/}
        {/*          className={cn(*/}
        {/*            "h-20 flex-1 text-2xl",*/}
        {/*            attendanceStatus ===*/}
        {/*              PrismaDBMainConstants.AttendanceStatus.NOT_ATTENDING &&*/}
        {/*              "bg-green-500",*/}
        {/*          )}*/}
        {/*          variant="ghost"*/}
        {/*          disabled={isMyEvent}*/}
        {/*          onClick={() => {*/}
        {/*            return handleAttend(*/}
        {/*              PrismaDBMainConstants.AttendanceStatus.NOT_ATTENDING,*/}
        {/*            );*/}
        {/*          }}*/}
        {/*        >*/}
        {/*          😢*/}
        {/*        </Button>*/}
        {/*      </>*/}
        {/*    )}*/}
        {/*  </div>*/}
        {/*  {!isPublished && (*/}
        {/*    <Button className="w-full" size="lg" onClick={handlePublish}>*/}
        {/*      Publish*/}
        {/*    </Button>*/}
        {/*  )}*/}
        {/*</FloatingArea>*/}
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
    <div className={cn("mx-auto max-w-[750px] px-8", className)} {...rest}>
      {children}
    </div>
  );
};

export default EventView;
