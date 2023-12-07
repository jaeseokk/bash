"use client";

import * as React from "react";
import EventView from "./EventView";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import ky from "ky";
import { EventDetail } from "@/types/events";
import { signIn, useSession } from "next-auth/react";
import { notFound } from "next/navigation";

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

  if (error) {
    return notFound();
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <EventView
        eventInfo={data}
        onPublish={async (eventId) => {
          await ky.put(`/api/events/${eventId}/publish`);
          await refetch();
        }}
        onVerify={async ({ phoneNumber }) => {
          await ky.post(`/api/events/${slug}/verify`, {
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
      />
    </>
  );
};

export default EventViewContainer;
