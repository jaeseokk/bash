import * as React from "react";
import { STICKERS } from "@/constants/sticker";
import Sticker from "@/components/Sticker";
import { generateRandomPoints } from "@/utils";
import useResizeObserver from "use-resize-observer";
import { useState } from "react";

export interface StickerContainerProps {
  eventKey?: string;
  effect: keyof typeof STICKERS;
}

const StickerContainer = ({ eventKey, effect }: StickerContainerProps) => {
  const [containerInfo, setContainerInfo] = useState({
    scrollHeight: 0,
    scrollWidth: 0,
  });
  useResizeObserver({
    ref:
      typeof document === "undefined"
        ? undefined
        : document.querySelector("body"),
    onResize: () => {
      setContainerInfo({
        scrollHeight: document.documentElement.scrollHeight,
        scrollWidth: document.documentElement.scrollWidth,
      });
    },
  });

  const stickerUrls = STICKERS[effect];

  const points = generateRandomPoints(90, 90, stickerUrls.length);

  const handleSaveStickerPosition =
    (effect: keyof typeof STICKERS, index: number) =>
    (x: number, y: number) => {
      if (!eventKey) {
        return;
      }

      const stickerPosition = {
        x,
        y,
      };
      const key = `${eventKey}_${effect}_${index}`;

      localStorage.setItem(key, JSON.stringify(stickerPosition));
    };

  const getInitialPosition = (effect: keyof typeof STICKERS, index: number) => {
    const key = `${eventKey}_${effect}_${index}`;
    const stickerPosition = localStorage.getItem(key);

    if (!stickerPosition) {
      localStorage.setItem(key, JSON.stringify(points[index]));
      return {
        x: points[index].x,
        y: points[index].y,
      };
    }

    return JSON.parse(stickerPosition);
  };

  return (
    <div className="pointer-events-none absolute inset-0 h-full overflow-hidden [&_.moveable-control-box]:opacity-0">
      {stickerUrls.map((src, index) => {
        return (
          <Sticker
            key={`${src}_${index}_${containerInfo.scrollHeight}_${containerInfo.scrollWidth}`}
            src={src}
            containerInfo={containerInfo}
            initialPosition={getInitialPosition(effect, index)}
            onSavePosition={handleSaveStickerPosition(effect, index)}
          />
        );
      })}
    </div>
  );
};

export default StickerContainer;
