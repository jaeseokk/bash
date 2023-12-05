"use client";

import * as React from "react";
import Image from "next/image";
import { cn, shimmer, toBase64 } from "@/utils";
import { PrismaDBMainTypes, PrismaDBMainConstants } from "@bash/db";
import { signIn, useSession } from "next-auth/react";
import ky from "ky";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import LoginForm from "../../../signin/components/LoginForm";
import BottomSheet from "@/components/BottomSheet";
import { format } from "date-fns";
import ViewField from "@/components/ViewField";
import CalendarIcon from "@/assets/calendar_gradient.svg";
import CrownIcon from "@/assets/crown_gradient.svg";
import LocationIcon from "@/assets/location_gradient.svg";
import ReplyRadioGroup from "@/components/ReplyRadioGroup";
import { Button } from "@/components/ui/button";
import FloatingArea from "@/components/FloatingArea";
import BottomButton from "@/components/BottomButton";
import Edit2Icon from "@/assets/edit2.svg";
import NoticeIcon from "@/assets/notice.svg";
import InviteIcon from "@/assets/invite.svg";
import PosterIcon from "@/assets/poster.svg";
import { useDisclosure } from "../../../../shared/hooks/useDisclosure";
import { Sheet } from "@/components/ui/sheet";
import BottomSheet2 from "@/components/BottomSheet2";
import AttendForm from "@/components/AttendForm";
import AttendConfirmLayer from "./AttendConfirmLayer";
import Divider from "@/components/Divider";
import AttendeesStatus from "./AttendeesStatus";
import ActivityStatus from "./ActivityStatus";
import LetsLogo from "@/assets/lets_logo.svg";

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
  const dateDisplay = useMemo(() => {
    if (eventInfo.startDate && eventInfo.endDate) {
      return `${format(eventInfo.startDate, "PPP")} ~ ${format(
        eventInfo.endDate,
        "PPP",
      )}`;
    } else if (eventInfo.startDate) {
      return format(eventInfo.startDate, "PPP");
    }

    return undefined;
  }, [eventInfo.endDate, eventInfo.startDate]);
  const isMyEvent = session.data?.user.id === eventInfo.authorId;
  const isPublished = !!eventInfo.publishedAt;
  const attendanceStatus = eventInfo.attendances.find(
    (attendance) => attendance.userId === session.data?.user.id,
  )?.status;
  const {
    show: showAttendDialog,
    handleShow: handleShowAttendDialog,
    handleClose: handleCloseAttendDialog,
    handleChange: handleChangeAttendDialog,
  } = useDisclosure();

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
              className="absolute bottom-0 left-0 right-0 top-0 backdrop-blur-[25px]"
              style={{
                background:
                  "linear-gradient(0deg, #000 27.08%, rgba(0, 0, 0, 0.50) 100%)",
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
        <Block className="mb-6 space-y-6">
          <div>
            <ViewField icon={<CalendarIcon />} size="lg">
              {dateDisplay}
            </ViewField>
          </div>
          <div>
            <ViewField icon={<CrownIcon />} size="lg">
              주최자 : {eventInfo.authorName}
            </ViewField>
          </div>
        </Block>
        <Block className="mb-6 space-y-2">
          <ViewField icon={<LocationIcon />}>{eventInfo.location}</ViewField>
        </Block>
        {eventInfo.description && (
          <Block>
            <div className="text-[1.5rem]">{eventInfo.description}</div>
          </Block>
        )}
        <Block>
          <Divider />
        </Block>
        <div className="space-y-[2.5rem]">
          <AttendeesStatus />
          <ActivityStatus />
        </div>
        <div className="mt-8 flex justify-center">
          <LetsLogo />
        </div>
        <Block2 className="mt-[1.5rem]">
          <Button variant="outline">내 이벤트 직접 만들기</Button>
        </Block2>
        <Block2 className="mb-[1.75rem] mt-8">
          <div className="rounded-xl border border-[#343434] p-8">
            <ReplyRadioGroup
              value={""}
              disabled={isMyEvent}
              onClick={() => {
                if (isMyEvent) {
                  return;
                }

                handleShowAttendDialog();
              }}
            />
          </div>
        </Block2>
        {isMyEvent && !isPublished && (
          <Block2 className="mb-[1.75rem]">
            <Button
              type="button"
              variant="highlight"
              className="w-full"
              onClick={handlePublish}
            >
              이벤트 오픈하기
            </Button>
          </Block2>
        )}
      </div>
      <FloatingArea>
        <BottomButton.Root>
          {isMyEvent && (
            <>
              <BottomButton.Item icon={<Edit2Icon />}>
                이벤트 수정
              </BottomButton.Item>
              <BottomButton.Divider />
            </>
          )}
          <BottomButton.Item icon={<NoticeIcon />}>공지하기</BottomButton.Item>
          <BottomButton.Divider />
          <BottomButton.Item icon={<InviteIcon />}>초대하기</BottomButton.Item>
          <BottomButton.Divider />
          <BottomButton.Item icon={<PosterIcon />}>
            포스터 공유
          </BottomButton.Item>
        </BottomButton.Root>
      </FloatingArea>
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
      <BottomSheet2
        title={"참석여부 답하기"}
        open={showAttendDialog}
        onClose={handleCloseAttendDialog}
      >
        <AttendForm onSubmit={() => {}} onCancel={handleCloseAttendDialog} />
      </BottomSheet2>
    </>
  );
};

interface BlockProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Block = ({ children, className, ...rest }: BlockProps) => {
  return (
    <div
      className={cn("mx-auto max-w-[750px] px-8 text-center", className)}
      {...rest}
    >
      {children}
    </div>
  );
};

interface Block2Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Block2 = ({ children, className, ...rest }: Block2Props) => {
  return (
    <div
      className={cn("mx-auto max-w-[750px] px-4 text-center", className)}
      {...rest}
    >
      {children}
    </div>
  );
};

export default EventView;
