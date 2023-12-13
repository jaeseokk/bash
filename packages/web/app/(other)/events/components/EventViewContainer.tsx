"use client";

import * as React from "react";
import EventView from "./EventView";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import ky from "ky";
import { EventDetail } from "@/types/events";
import { signIn, useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import LoadingLayer from "@/components/LoadingLayer";
import PublishConfirmLayer from "./PublishConfirmLayer";
import { getFullUrl } from "@/utils";
import { useDialogControl } from "@/hooks/useDialogControl";
import AttendConfirmLayer from "./AttendConfirmLayer";
import { useState } from "react";
import MyProfileLayer from "@/components/MyProfileLayer";

export interface EventViewContainerProps {
  slug: string;
}

const EventViewContainer = ({ slug }: EventViewContainerProps) => {
  const session = useSession();
  const { data, error, refetch } = useQuery<EventDetail>({
    queryKey: ["event", slug],
    queryFn: async () => {
      const res = await ky.get(`/api/events/${slug}`);

      return res.json();
    },
    enabled: session.status !== "loading",
  });
  const publishConfirmDialogControl = useDialogControl();
  const attendConfirmDialogControl = useDialogControl();
  const profileDialogControl = useDialogControl();

  if (error) {
    return notFound();
  }

  if (!data) {
    return <LoadingLayer />;
  }

  return (
    <>
      <EventView
        eventInfo={data}
        onPublish={async (eventId) => {
          await ky.put(`/api/events/${eventId}/publish`);
          await refetch();
          await publishConfirmDialogControl.start();
        }}
        onVerify={async ({ phoneNumber }) => {
          await ky.post(`/api/user/verify`, {
            json: {
              phoneNumber,
            },
          });
        }}
        onSignin={async (data) => {
          await signIn("credentials", {
            redirect: false,
            ...data,
          });
        }}
        onAttend={async (data) => {
          await ky.put("/api/attend-event", {
            json: data,
          });
          await refetch();
        }}
        onAttendCallback={async (data) => {
          if (data.isFirst) {
            await attendConfirmDialogControl.start();

            if (data.withSignUp) {
              await profileDialogControl.start();
            }
          }
        }}
      />
      <PublishConfirmLayer
        open={publishConfirmDialogControl.show}
        url={getFullUrl(`/events/${data.slug}`)}
        onClose={publishConfirmDialogControl.onCancel}
        onMoveEventPage={publishConfirmDialogControl.onCancel}
      />
      <AttendConfirmLayer
        open={attendConfirmDialogControl.show}
        onClose={attendConfirmDialogControl.onCancel}
      />
      <MyProfileLayer
        urlStateKey={undefined}
        open={profileDialogControl.show}
        onClose={profileDialogControl.onCancel}
      />
    </>
  );
};

export default EventViewContainer;
