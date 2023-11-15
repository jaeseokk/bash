"use client";

import * as React from "react";
import CreateEventForm from "./components/CreateEventForm";

export interface EventNewPageProps {}

const EventNewPage = ({}: EventNewPageProps) => {
  return (
    <main className="pb-20 pt-4">
      <CreateEventForm
        onSubmit={async (data) => {
          const res = await fetch("/api/events", {
            method: "POST",
            body: JSON.stringify(data),
          });

          return res.json();
        }}
      />
    </main>
  );
};

export default EventNewPage;
