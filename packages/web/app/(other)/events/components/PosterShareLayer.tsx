"use client";

import * as React from "react";
import Layer, { LayerContentWithScrollArea } from "@/components/Layer";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PrismaDBMainTypes } from "@bash/db";
import { format } from "date-fns";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface PosterShareLayerProps
  extends React.ComponentPropsWithoutRef<typeof Layer> {
  eventInfo: PrismaDBMainTypes.Event;
}

const PosterShareLayer = ({ eventInfo, ...props }: PosterShareLayerProps) => {
  const posterElementRef = useRef<HTMLDivElement>(null);

  const getDataURL = async () => {
    if (!posterElementRef.current) {
      return null;
    }

    const canvas = await html2canvas(posterElementRef.current);

    return canvas.toDataURL("image/png");
  };

  const handleSaveImage = async () => {
    const dataURL = await getDataURL();

    if (!dataURL) {
      return;
    }

    const link = document.createElement("a");
    link.download = `${eventInfo.title}.png`;
    link.href = dataURL;
    link.click();
  };
  const isSupportedShareApi = "share" in navigator;

  const handleShare = async () => {
    const dataURL = await getDataURL();

    if (!dataURL) {
      return;
    }

    if (!isSupportedShareApi) {
      console.log("navigator.share is not supported");
      return;
    }

    const blob = await (await fetch(dataURL)).blob();
    const file = new File([blob], "fileName.png", { type: blob.type });

    await navigator.share({
      files: [file],
    });
  };

  return (
    <Layer title="포스터 공유" {...props}>
      <LayerContentWithScrollArea>
        <div className="flex flex-col items-center justify-between pt-6">
          <div
            className="relative h-[28.125rem] w-[17.5rem] flex-none overflow-hidden border border-[#AEFF5E]"
            ref={posterElementRef}
          >
            {eventInfo.coverImage && (
              <div className="absolute bottom-0 left-0 right-0 top-0">
                <Image
                  src={eventInfo.coverImage}
                  alt=""
                  width="200"
                  height="200"
                  style={{
                    width: "auto",
                    height: "120%",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                  sizes="100vw"
                />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[#000000] bg-opacity-60 backdrop-blur-[25px]"></div>
            {eventInfo.coverImage && (
              <div className="z-1 absolute left-0 right-0 top-[6.82rem] mx-auto h-[14.375rem] w-[14.375rem] overflow-hidden rounded-2xl">
                <Image
                  src={eventInfo.coverImage}
                  alt=""
                  width="200"
                  height="200"
                  style={{
                    width: "auto",
                    height: "100%",
                  }}
                  sizes="100vw"
                />
              </div>
            )}
            <div className="absolute left-4 top-4 w-[12.8125rem] text-[3.125rem] font-bold leading-[110%] [text-shadow:_0_1px_10px_rgb(0_0_0_/_25%)]">
              {eventInfo.title}
            </div>
            <div className="absolute bottom-4 left-4 w-[12.8125rem] space-y-[1.35rem] text-[1.25rem] font-bold leading-[130%] [text-shadow:_0_1px_10px_rgb(0_0_0_/_25%)]">
              <div className="whitespace-pre-wrap">
                {format(new Date(eventInfo.startDate), "MMMM@do@a h:mm")
                  .split("@")
                  .join("\n")}
              </div>
              <div className="whitespace-pre-wrap">{eventInfo.location}</div>
            </div>
          </div>
          <div className="sticky bottom-9 mt-6 w-full space-y-[0.75rem]">
            {isSupportedShareApi ? (
              <Button type="button" className="w-full" onClick={handleShare}>
                공유
              </Button>
            ) : (
              <Button
                type="button"
                className="w-full"
                onClick={handleSaveImage}
              >
                저장
              </Button>
            )}
          </div>
        </div>
      </LayerContentWithScrollArea>
    </Layer>
  );
};

export default PosterShareLayer;
