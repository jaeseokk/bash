"use client";

import * as React from "react";
import CreateEventForm from "../components/CreateEventForm";
import { useRouter } from "next/navigation";

export interface EventNewPageProps {}

const EventNewPage = ({}: EventNewPageProps) => {
  const router = useRouter();

  return (
    <main className="pt-4">
      <CreateEventForm
        onSubmit={async (data) => {
          const res = await fetch("/api/events", {
            method: "POST",
            body: JSON.stringify(data),
          });

          const { slug } = (await res.json()) as { slug: string };
          router.push(`/events/${slug}`);
        }}
      />
    </main>
  );
};

export default EventNewPage;
