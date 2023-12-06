"use client";

import * as React from "react";
import CreateEventForm from "../../components/CreateEventForm";
import ky from "ky";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { PrismaDBMainConstants, PrismaDBMainTypes } from "@bash/db";

const kyInstance = ky.create({});

export interface EventNewPageProps {
  params: {
    slug: string;
  };
}

const EventNewPage = ({ params: { slug } }: EventNewPageProps) => {
  console.log(slug);

  return (
    <main className="pt-4">
      <Suspense fallback={null}>
        <CreateEventFormContainer slug={slug} />
      </Suspense>
    </main>
  );
};

interface CreateEventFormContainerProps {
  slug: string;
}

const CreateEventFormContainer = ({ slug }: CreateEventFormContainerProps) => {
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery<PrismaDBMainTypes.Event>({
    queryKey: ["event", slug],
    queryFn: async () => {
      const res = await kyInstance.get(
        `http://localhost:3001/api/events/${slug}`,
      );

      return res.json();
    },
  });

  return (
    <CreateEventForm
      initialData={data}
      onSubmit={async (data) => {
        const res = await ky.put(`/api/events/${slug}`, {
          json: data,
        });

        await queryClient.invalidateQueries({
          queryKey: ["event", slug],
        });

        return res.json();
      }}
    />
  );
};

export default EventNewPage;
