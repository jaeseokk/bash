"use client";

import * as React from "react";
import CreateEventForm from "../../components/CreateEventForm";
import ky from "ky";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { PrismaDBMainTypes } from "@bash/db";
import { useRouter } from "next/navigation";
import LoadingLayer from "@/components/LoadingLayer";

const kyInstance = ky.create({});

export interface EventNewPageProps {
  params: {
    slug: string;
  };
}

const EventNewPage = ({ params: { slug } }: EventNewPageProps) => {
  return (
    <main className="pt-4">
      <Suspense fallback={<LoadingLayer />}>
        <CreateEventFormContainer slug={slug} />
      </Suspense>
    </main>
  );
};

interface CreateEventFormContainerProps {
  slug: string;
}

const CreateEventFormContainer = ({ slug }: CreateEventFormContainerProps) => {
  const router = useRouter();
  const { data, refetch } = useSuspenseQuery<PrismaDBMainTypes.Event>({
    queryKey: ["event", slug],
    queryFn: async () => {
      const res = await kyInstance.get(`/api/events/${slug}`);

      return res.json();
    },
  });

  return (
    <CreateEventForm
      initialData={data}
      slug={slug}
      onSubmit={async (data) => {
        await ky.put(`/api/events/${slug}`, {
          json: data,
        });

        await refetch();
        router.push(`/events/${slug}`);
      }}
    />
  );
};

export default EventNewPage;
