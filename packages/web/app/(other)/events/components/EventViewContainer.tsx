"use client";

import * as React from "react";
import EventView from "./EventView";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import ky from "ky";
import { EventDetail } from "@/types/events";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";

export interface EventViewContainerProps {
  slug: string;
}

const EventViewContainer = ({ slug }: EventViewContainerProps) => {
  const session = useSession();
  const queryClient = useQueryClient();
  const { data, error } = useQuery<EventDetail>({
    queryKey: ["event", slug],
    queryFn: async () => {
      const res = await ky.get(`http://localhost:3001/api/events/${slug}`);

      return res.json();
    },
    enabled: session.status !== "loading",
  });

  console.log(error);

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
        onRevalidate={() => {
          return queryClient.invalidateQueries({
            queryKey: ["event", slug],
          });
        }}
      />
    </>
  );
};

export default EventViewContainer;
