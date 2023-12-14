"use client";

import * as React from "react";
import Image from "next/image";
import {
  cn,
  formatDate,
  getUrlOrigin,
  isDeployProd,
  isProd,
  shimmer,
  toBase64,
} from "@/utils";
import { PrismaDBMainConstants, PrismaDBMainTypes } from "@bash/db";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import ViewField from "@/components/ViewField";
import CalendarIcon from "@/assets/calendar_gradient.svg";
import CrownIcon from "@/assets/crown_gradient.svg";
import LocationIcon from "@/assets/location_gradient.svg";
import PeopleIcon from "@/assets/people_gradient.svg";
import ReplyRadioGroup from "@/components/ReplyRadioGroup";
import { Button } from "@/components/ui/button";
import FloatingArea from "@/components/FloatingArea";
import BottomButton from "@/components/BottomButton";
import Edit2Icon from "@/assets/edit2.svg";
import NoticeIcon from "@/assets/notice.svg";
import InviteIcon from "@/assets/invite.svg";
import PosterIcon from "@/assets/poster.svg";
import LetsLogo from "@/assets/lets_logo.svg";
import { useDisclosure } from "@/hooks/useDisclosure";
import BottomSheet2 from "@/components/BottomSheet2";
import AttendForm from "@/components/AttendForm";
import Divider from "@/components/Divider";
import AttendeesStatus from "./AttendeesStatus";
import ActivityStatus from "./ActivityStatus";
import PosterShareLayer from "./PosterShareLayer";
import { EventDetail, PreviewEventDetail } from "@/types/events";
import { useLoading } from "@/hooks/useLoading";
import EventBackground from "@/components/EventBackground";
import { useAlertDialog } from "@/components/AlertDialogProvider";
import Linkify from "linkify-react";
import StickerContainer from "@/components/StickerContainer";
import ShareLayer from "./ShareLayer";
import { useIntersection } from "@/hooks/useIntersection";
import Link from "next/link";

const DUMMY = {
  activities: [
    {
      id: 1,
      userId: 49,
      eventId: 70,
      attendanceId: 20,
      createdAt: "2023-12-11T17:08:24.362Z",
      message: "😁기대가 됩니다 어서 만나요",
      emoji: "1f973",
      status: "ATTENDING" as const,
      user: {
        id: 49,
        username: "강강",
      },
    },
    {
      id: 2,
      userId: 9,
      eventId: 70,
      attendanceId: 19,
      createdAt: "2023-12-11T17:03:42.136Z",
      message: null,
      emoji: "1f497",
      status: "ATTENDING" as const,
      user: {
        id: 9,
        username: "재재",
      },
    },
    {
      id: 3,
      userId: 9,
      eventId: 70,
      attendanceId: 19,
      createdAt: "2023-12-11T17:02:49.383Z",
      message: "조만간 만나요",
      emoji: "1f497",
      status: "ATTENDING" as const,
      user: {
        id: 9,
        username: "석석",
      },
    },
  ],
  attendees: [
    {
      id: 1,
      userId: 1,
      eventId: 70,
      status: "ATTENDING" as const,
      user: {
        id: 1,
        username: "강강",
      },
    },
    {
      id: 2,
      userId: 2,
      eventId: 70,
      status: "ATTENDING" as const,
      user: {
        id: 2,
        username: "재재",
      },
    },
    {
      id: 3,
      userId: 3,
      eventId: 70,
      status: "ATTENDING" as const,
      user: {
        id: 3,
        username: "석석",
      },
    },
  ],
};

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
  const intersectionRef = React.useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "0px",
    threshold: 1,
  });
  const [loading, startLoading] = useLoading();
  const { openDialog } = useAlertDialog();
  const session = useSession();
  const router = useRouter();
  const attendancesThatSayYes = preview
    ? []
    : eventInfo.attendances.filter(
        (attendance) => attendance.status === "ATTENDING",
      );
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
  const authorName = useMemo(() => {
    if (eventInfo.authorName) {
      return eventInfo.authorName;
    } else if (preview) {
      return session.data?.user.name;
    } else {
      return eventInfo.author.username;
    }
  }, [eventInfo, preview, session]);
  const spotsDisplay = useMemo(() => {
    if (!eventInfo.spots) {
      return null;
    } else if (preview) {
      return <>0 / {eventInfo.spots}명이 참석 예정입니다.</>;
    } else {
      return (
        <>
          <span
            className={cn(
              attendancesThatSayYes.length > eventInfo.spots
                ? "text-red-600"
                : attendancesThatSayYes.length > 0
                  ? "text-[#AEFF5E]"
                  : null,
            )}
          >
            {attendancesThatSayYes.length}
          </span>{" "}
          / {eventInfo.spots}명이 참석 예정입니다.
        </>
      );
    }
  }, []);
  const isMyEvent = !preview && session.data?.user.id === eventInfo.authorId;
  const isPublished = !preview && !!eventInfo.publishedAt;
  const myAttendance = preview
    ? undefined
    : eventInfo.attendances.find(
        (attendance) => attendance.userId === session.data?.user.id,
      );
  const [cachedAttendanceStatus, setCachedAttendanceStatus] =
    useState<PrismaDBMainTypes.AttendanceStatus>();
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
  const isReplySectionPinned = !intersection?.isIntersecting;
  const shareUrl = useMemo(() => {
    if (preview) {
      return "";
    }

    const origin = getUrlOrigin();

    return `${origin}/events/${eventInfo.slug}`;
  }, [eventInfo, preview]);

  return (
    <>
      {eventInfo.effect && (
        <StickerContainer
          effect={eventInfo.effect as any}
          eventKey={preview ? undefined : eventInfo.slug}
        />
      )}
      <div>
        <EventBackground coverImage={eventInfo.coverImage} />
        <Block className="mb-[3rem]">
          <div className="whitespace-pre-wrap text-center text-[2.375rem] font-bold">
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
              blurDataURL={`/_next/image?url=${encodeURIComponent(
                eventInfo.coverImage,
              )}&w=16&q=1`}
              sizes="100vw"
            />
          </div>
        </Block>
        <Block className="mb-6 space-y-2">
          <div>
            <ViewField icon={<CalendarIcon />} size="lg">
              {dateDisplay}
            </ViewField>
          </div>
          <div>
            <ViewField icon={<CrownIcon />} size="lg">
              주최자 : {authorName}
            </ViewField>
          </div>
        </Block>
        <Block className="mb-6 space-y-2">
          {spotsDisplay && (
            <ViewField icon={<PeopleIcon />}>{spotsDisplay}</ViewField>
          )}
          {eventInfo.location && (
            <ViewField icon={<LocationIcon />}>
              <p className="whitespace-pre-wrap [&_a]:underline">
                <Linkify>{eventInfo.location}</Linkify>
              </p>
            </ViewField>
          )}
        </Block>
        {eventInfo.description && (
          <Block>
            <p className="whitespace-pre-wrap text-[1rem] [&_a]:underline">
              <Linkify>{eventInfo.description}</Linkify>
            </p>
          </Block>
        )}
        {!preview && (
          <>
            <Block>
              <Divider className="pb-0" />
            </Block>
            <FloatingArea disabledFloating={isMyEvent || !!myAttendance}>
              <div className="relative px-8 py-[2.5rem] " ref={intersectionRef}>
                {!isMyEvent && !myAttendance && (
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 z-[-1] opacity-0 transition-opacity",
                      isReplySectionPinned && "opacity-100",
                    )}
                    style={{
                      background: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #000 53.65%)`,
                    }}
                  />
                )}
                <ReplyRadioGroup
                  value={myAttendance?.status ?? ""}
                  disabled={preview}
                  showOnlySelected={!!myAttendance}
                  onClick={(value) => {
                    setCachedAttendanceStatus(value as any);
                    handleShowAttendDialog();
                  }}
                />
              </div>
            </FloatingArea>
            <div className="relative mx-auto max-w-[750px] py-4">
              {!myAttendance && !isMyEvent ? (
                <>
                  <div className="space-y-[2.5rem]">
                    <AttendeesStatus attendances={DUMMY.attendees} />
                    <ActivityStatus activities={DUMMY.activities} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[5px]">
                    <div className="mx-8 rounded-2xl border border-[#AEFF5E] bg-[#131313] p-[1.875rem] text-center">
                      <div className="font-bold">
                        아직은 볼 수 없는 영역입니다
                      </div>
                      <div className="mt-[1.25rem] text-[0.875rem]">
                        참석여부를 알려주시면,
                        <br />
                        다른 참석자들의 이름과 활동을 확인할 수 있어요
                      </div>
                      <div className="mt-[1.25rem]">
                        <Button
                          size="sm"
                          type="button"
                          onClick={handleShowAttendDialog}
                        >
                          참석여부 답하기
                        </Button>
                      </div>
                      <div className="mt-[0.5rem] text-[0.75rem] text-muted-foreground">
                        아직 잘 모르겠다면 &#39; 아마도&#39;라고 답해도 돼요
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-[2.5rem]">
                  <AttendeesStatus attendances={eventInfo.attendances} />
                  <ActivityStatus activities={eventInfo.activities} />
                </div>
              )}
            </div>
          </>
        )}
        <div className="flex items-center justify-center py-20">
          {preview ? (
            <LetsLogo />
          ) : (
            <Link href="/">
              <LetsLogo />
            </Link>
          )}
        </div>
      </div>
      {!preview && (isMyEvent || (!isMyEvent && !!myAttendance)) && (
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
                      return;
                    }

                    openDialog({
                      title:
                        "공지하기 기능은 곧 출시 예정입니다. 조금만 기다려주세요!",
                      hideCancel: true,
                    });
                    e.preventDefault();
                  }}
                >
                  공지하기
                </BottomButton.Item>
                <BottomButton.Divider />
              </>
            )}
            <ShareLayer
              url={shareUrl}
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
      {!preview && (
        <BottomSheet2
          title={"참석여부 답하기"}
          open={showAttendDialog}
          onClose={() => {
            handleCloseAttendDialog();
            setCachedAttendanceStatus(undefined);
          }}
        >
          <AttendForm
            defaultStatus={myAttendance?.status ?? cachedAttendanceStatus}
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
      )}
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
