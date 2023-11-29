import * as React from "react";
import { getEventBy } from "@/server/events";
import { notFound } from "next/navigation";
import EventView from "./components/EventView";

export interface EventPageProps {
  params: {
    slug: string;
  };
}

const EventPage = async ({ params: { slug } }: EventPageProps) => {
  const eventData = await getEventBy({ slug });

  if (!eventData) {
    return notFound();
  }

  return (
    <main className="pt-4">
      <EventView eventInfo={eventData} />
    </main>
  );
};

export default EventPage;
