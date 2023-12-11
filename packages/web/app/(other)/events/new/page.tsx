"use client";

import * as React from "react";
import CreateEventForm from "../components/CreateEventForm";
import { useRouter } from "next/navigation";
import { useDialogControl } from "@/hooks/useDialogControl";
import { getFullUrl } from "@/utils";
import PublishConfirmLayer from "../components/PublishConfirmLayer";

export interface EventNewPageProps {}

const EventNewPage = ({}: EventNewPageProps) => {
  const router = useRouter();
  const publishConfirmDialogControl = useDialogControl<
    { slug: string },
    never
  >();

  return (
    <>
      <main className="pt-4">
        <CreateEventForm
          onSubmit={async (data) => {
            try {
              const res = await fetch("/api/events", {
                method: "POST",
                body: JSON.stringify(data),
              });

              const { slug } = (await res.json()) as { slug: string };
              router.prefetch(
                `/events/${publishConfirmDialogControl.data?.slug}`,
              );
              await publishConfirmDialogControl.start({ slug });
            } catch (error) {
              console.error(error);
            }
          }}
        />
      </main>
      <PublishConfirmLayer
        open={publishConfirmDialogControl.show}
        url={getFullUrl(`/events/${publishConfirmDialogControl.data?.slug}`)}
        onClose={publishConfirmDialogControl.onCancel}
        onMoveEventPage={() => {
          router.push(`/events/${publishConfirmDialogControl.data?.slug}`);
        }}
      />
    </>
  );
};

export default EventNewPage;
