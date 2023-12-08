import * as React from "react";
import AttendConfirmLayer from "../components/AttendConfirmLayer";
import MyProfileLayer from "@/components/MyProfileLayer";
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
      <EventViewContainer slug={slug} />
      <AttendConfirmLayer />
      <MyProfileLayer />
    </main>
  );
};

export default EventPage;
