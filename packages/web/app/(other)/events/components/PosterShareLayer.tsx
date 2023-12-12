"use client";

import * as React from "react";
import Layer, { LayerContentWithScrollArea } from "@/components/Layer";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PrismaDBMainTypes } from "@bash/db";
import { formatDate } from "@/utils";
import { useLoading } from "@/hooks/useLoading";

export interface PosterShareLayerProps
  extends React.ComponentPropsWithoutRef<typeof Layer> {
  eventInfo: PrismaDBMainTypes.Event;
}

const splitDate = (date: string) => {
  const replaced = date.replace(") ", ")@") ?? "";
  return replaced.split("@");
};

const PosterShareLayer = ({ eventInfo, ...props }: PosterShareLayerProps) => {
  const splited = splitDate(formatDate(eventInfo.startDate));
  const searchParams = new URLSearchParams({
    coverImage: eventInfo.coverImage ?? "",
    title: eventInfo.title ?? "",
    startDate1: splited[0] ?? "",
    startDate2: splited[1] ?? "",
    location: eventInfo.location ?? "",
  });
  const imageUrl = `${
    typeof window === "undefined" || process.env.NODE_ENV !== "production"
      ? ""
      : location.origin
  }/api/poster?${searchParams.toString()}`;
  const [isLoading, startLoading] = useLoading();

  const handleSaveImage = async () => {
    const link = document.createElement("a");
    link.download = `${eventInfo.title}.png`;
    link.href = imageUrl;
    link.click();
  };
  const isSupportedShareApi =
    typeof navigator !== "undefined" && "share" in navigator;

  const handleShare = () => {
    return startLoading(async () => {
      const blob = await (await fetch(imageUrl)).blob();
      const file = new File([blob], `${eventInfo.title}.png`, {
        type: blob.type,
      });

      await navigator.share({
        files: [file],
      });
    });
  };

  return (
    <Layer title="포스터 공유" {...props}>
      <LayerContentWithScrollArea>
        <div className="flex flex-col items-center justify-between pt-6">
          <div className="border border-[#AEFF5E]">
            <img
              src={imageUrl}
              width={280}
              height={450}
              alt={eventInfo.title ?? ""}
            />
          </div>
          <div className="sticky bottom-9 mt-6 w-full space-y-[0.75rem]">
            {isSupportedShareApi ? (
              <>
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleShare}
                  pending={isLoading}
                >
                  공유
                </Button>
                <Button
                  type="button"
                  className="w-full bg-black"
                  variant="outline"
                  onClick={handleSaveImage}
                >
                  저장
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleSaveImage}
                >
                  저장
                </Button>
              </>
            )}
          </div>
        </div>
      </LayerContentWithScrollArea>
    </Layer>
  );
};

export default PosterShareLayer;
