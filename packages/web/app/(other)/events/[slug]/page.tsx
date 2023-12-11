import * as React from "react";
import AttendConfirmLayer from "../components/AttendConfirmLayer";
import MyProfileLayer from "@/components/MyProfileLayer";
import EventViewContainer from "../components/EventViewContainer";
import { Metadata } from "next";

export interface EventPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params: { slug },
}: EventPageProps): Promise<Metadata> {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://lets.fyi"
      : `http://localhost:${process.env.PORT || 3000}`;
  try {
    const event = await fetch(`${baseUrl}/api/events/${slug}`).then((res) =>
      res.json(),
    );

    return {
      title: `${event.title} | 렛츠 LET'S`,
      description: event.description,
      metadataBase: new URL("https://lets.fyi"),
    };
  } catch (e) {
    return {};
  }
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
