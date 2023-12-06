import * as React from "react";
import AttendConfirmLayer from "../components/AttendConfirmLayer";
import ProfileLayer from "@/components/ProfileLayer";
import EventViewContainer from "../components/EventViewContainer";
import { Suspense } from "react";

export interface EventPageProps {
  params: {
    slug: string;
  };
}

const EventPage = async ({ params: { slug } }: EventPageProps) => {
  return (
    <main className="pt-4">
      <Suspense fallback={null}>
        <EventViewContainer slug={slug} />
      </Suspense>
      <AttendConfirmLayer />
      <ProfileLayer />
    </main>
  );
};

export default EventPage;
