import * as React from "react";
import EventView from "./EventView";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import ky from "ky";
import { EventDetail } from "@/types/events";

export interface EventViewContainerProps {
  slug: string;
}

const EventViewContainer = ({ slug }: EventViewContainerProps) => {
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery<EventDetail>({
    queryKey: ["event", slug],
    queryFn: async () => {
      const res = await ky.get(`http://localhost:3001/api/events/${slug}`);

      return res.json();
    },
  });

  return (
    <>
      <EventView eventInfo={data} />
    </>
  );
};

export default EventViewContainer;
