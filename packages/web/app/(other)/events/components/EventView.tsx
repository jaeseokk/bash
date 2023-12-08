"use client";

import * as React from "react";
import Image from "next/image";
import { cn, formatDate, shimmer, toBase64 } from "@/utils";
import { PrismaDBMainConstants } from "@bash/db";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
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
import { useDisclosure } from "@/hooks/useDisclosure";
import BottomSheet2 from "@/components/BottomSheet2";
import AttendForm from "@/components/AttendForm";
import Divider from "@/components/Divider";
import AttendeesStatus from "./AttendeesStatus";
import ActivityStatus from "./ActivityStatus";
import LetsLogo from "@/assets/lets_logo.svg";
import PosterShareLayer from "./PosterShareLayer";
import { EventDetail, PreviewEventDetail } from "@/types/events";
import Link from "next/link";
import { useLoading } from "@/hooks/useLoading";
import InviteBottomSheet from "./InviteBottomSheet";
import Sticker from "@/components/Sticker";
import EventBackground from "@/components/EventBackground";
import { useAlertDialog } from "@/components/AlertDialogProvider";

export interface CommonEventViewProps {
  preview?: boolean;
  onSignin?: (data: {
    username?: string;
    phoneNumber?: string;
    code?: string;
  }) => void;
  onAttend?: (data: {
    id: number;
    status: PrismaDBMainConstants.AttendanceStatus;
    message?: string;
    emoji: string;
  }) => void;
  onVerify?: (data: { phoneNumber: string }) => void;
  onPublish?: (slug: string) => void;
  onAttendCallback?: (data: {
    isFirst?: boolean;
    withSignUp?: boolean;
  }) => void;
}
export interface PreviewEventViewProps extends CommonEventViewProps {
  preview: true;
  eventInfo: PreviewEventDetail;
}

export interface GeneralEventViewProps extends CommonEventViewProps {
  preview?: false;
  eventInfo: EventDetail;
  onSignin: (data: {
    username?: string;
    phoneNumber?: string;
    code?: string;
  }) => Promise<void>;
  onAttend: (data: {
    id: number;
    status: PrismaDBMainConstants.AttendanceStatus;
    message?: string;
    emoji: string;
  }) => Promise<void>;
  onVerify: (data: { phoneNumber: string }) => Promise<void>;
  onPublish: (slug: string) => Promise<void>;
  onAttendCallback: (data: {
    isFirst?: boolean;
    withSignUp?: boolean;
  }) => Promise<void>;
}

export type EventViewProps = PreviewEventViewProps | GeneralEventViewProps;

const EventView = ({
  preview,
  eventInfo,
  onSignin,
  onAttend,
  onVerify,
  onPublish,
  onAttendCallback,
}: EventViewProps) => {
  const [loading, startLoading] = useLoading();
  const { openDialog } = useAlertDialog();
  const session = useSession();
  const router = useRouter();
  const dateDisplay = useMemo(() => {
    if (eventInfo.startDate && eventInfo.endDate) {
      return `${formatDate(eventInfo.startDate)} ~ ${formatDate(
        eventInfo.endDate,
      )}`;
    } else if (eventInfo.startDate) {
      return formatDate(eventInfo.startDate);
    }

    return undefined;
  }, [eventInfo.endDate, eventInfo.startDate]);
  const isMyEvent = !preview && session.data?.user.id === eventInfo.authorId;
  const isPublished = !preview && !!eventInfo.publishedAt;
  const myAttendance = preview
    ? undefined
    : eventInfo.attendances.find(
        (attendance) => attendance.userId === session.data?.user.id,
      );
  const myLatestActivity = preview
    ? undefined
    : eventInfo.activities.find(
        (activity) => activity.userId === session.data?.user.id,
      );
  const {
    show: showAttendDialog,
    handleShow: handleShowAttendDialog,
    handleClose: handleCloseAttendDialog,
  } = useDisclosure();

  const handlePublish = async () => {
    if (preview) {
      return;
    }

    return startLoading(async () => {
      await onPublish(eventInfo.slug);
    });
  };

  const handleAttend = async (data: {
    status: PrismaDBMainConstants.AttendanceStatus;
    message?: string;
    emoji: string;
    withSignUp?: boolean;
  }) => {
    if (preview) {
      return;
    }

    await onAttend?.({
      id: eventInfo.id,
      status: data.status,
      message: data.message,
      emoji: data.emoji,
    });

    await onAttendCallback({
      withSignUp: data.withSignUp,
      isFirst: !myAttendance,
    });

    handleCloseAttendDialog();
  };

  return (
    <>
      {/*<div className="absolute inset-0 h-full overflow-hidden">*/}
      {/*  <Sticker index={1} />*/}
      {/*  <Sticker index={2} />*/}
      {/*  <Sticker index={3} />*/}
      {/*  <Sticker index={4} />*/}
      {/*  <Sticker index={5} />*/}
      {/*  <Sticker index={6} />*/}
      {/*  <Sticker index={7} />*/}
      {/*  <Sticker index={8} />*/}
      {/*  <Sticker index={9} />*/}
      {/*</div>*/}
      <div>
        <EventBackground coverImage={eventInfo.coverImage} />
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
            <div className="whitespace-pre-wrap text-[1.5rem]">
              {eventInfo.description}
            </div>
          </Block>
        )}
        {!preview && (
          <>
            <Block>
              <Divider />
            </Block>
            <div className="mx-auto max-w-[750px] space-y-[2.5rem]">
              <AttendeesStatus attendances={eventInfo.attendances} />
              <ActivityStatus activities={eventInfo.activities} />
            </div>
          </>
        )}
        <div className="mt-8 flex justify-center">
          <LetsLogo />
        </div>
        {!preview && (
          <Block2 className="mt-[1.5rem]">
            <Button variant="outline" asChild>
              <Link href="/events/new">내 이벤트 직접 만들기</Link>
            </Button>
          </Block2>
        )}
        <Block2 className="mb-[1.75rem] mt-8">
          <div className="rounded-xl border border-[#343434] p-8">
            <ReplyRadioGroup
              value={myAttendance?.status}
              disabled={isMyEvent || preview}
              onClick={() => {
                if (isMyEvent) {
                  return;
                }

                handleShowAttendDialog();
              }}
            />
          </div>
        </Block2>
      </div>
      {!preview && (
        <FloatingArea>
          <BottomButton.Root>
            {isMyEvent && (
              <>
                <BottomButton.Item
                  icon={<Edit2Icon />}
                  onClick={() => {
                    router.push(`/events/${eventInfo.slug}/edit`);
                  }}
                >
                  이벤트 수정
                </BottomButton.Item>
                <BottomButton.Divider />
              </>
            )}
            {isMyEvent && (
              <>
                <BottomButton.Item
                  icon={<NoticeIcon />}
                  onClick={(e) => {
                    if (!isPublished) {
                      openDialog({
                        title: "이벤트를 오픈하면 사용할 수 있는 기능이에요.",
                        hideCancel: true,
                      });
                      e.preventDefault();
                    }
                  }}
                >
                  공지하기
                </BottomButton.Item>
                <BottomButton.Divider />
              </>
            )}
            <InviteBottomSheet
              url={`https://lets.run/events/${eventInfo.slug}`}
              trigger={
                <BottomButton.Item
                  icon={<InviteIcon />}
                  onClick={(e) => {
                    if (!isPublished) {
                      openDialog({
                        title: "이벤트를 오픈하면 사용할 수 있는 기능이에요.",
                        hideCancel: true,
                      });
                      e.preventDefault();
                    }
                  }}
                >
                  초대하기
                </BottomButton.Item>
              }
            />
            <BottomButton.Divider />
            <PosterShareLayer
              trigger={
                <BottomButton.Item
                  icon={<PosterIcon />}
                  onClick={(e) => {
                    if (!isPublished) {
                      openDialog({
                        title: "이벤트를 오픈하면 사용할 수 있는 기능이에요.",
                        hideCancel: true,
                      });
                      e.preventDefault();
                    }
                  }}
                >
                  포스터 공유
                </BottomButton.Item>
              }
              eventInfo={eventInfo}
            />
          </BottomButton.Root>
          {isMyEvent && !isPublished && !preview && (
            <Button
              type="button"
              variant="highlight"
              className="w-full rounded-none"
              onClick={handlePublish}
              pending={loading}
            >
              이벤트 오픈하기
            </Button>
          )}
        </FloatingArea>
      )}
      <BottomSheet2
        title={"참석여부 답하기"}
        open={showAttendDialog}
        onClose={handleCloseAttendDialog}
      >
        <AttendForm
          defaultStatus={myAttendance?.status}
          defaultEmoji={myLatestActivity?.emoji}
          onSubmit={handleAttend}
          onSubmitWithSign={async (data) => {
            await onSignin?.({
              username: data.username,
              phoneNumber: data.phoneNumber,
              code: data.code,
            });
            await handleAttend({
              ...data,
              withSignUp: true,
            });
          }}
          onVerify={onVerify}
          onCancel={handleCloseAttendDialog}
        />
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
