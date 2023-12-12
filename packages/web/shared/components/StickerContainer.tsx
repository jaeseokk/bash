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

const getLocalStorage = (key: string) => {
  if (typeof window === "undefined") {
    return;
  }

  return localStorage.getItem(key);
};

const setLocalStorage = (key: string, value: string) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(key, value);
};

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

  const stickers = STICKERS[effect].data;

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

      setLocalStorage(key, JSON.stringify(stickerPosition));
    };

  const getInitialPosition = (effect: keyof typeof STICKERS, index: number) => {
    const key = `${eventKey}_${effect}_${index}`;
    const stickerPosition = getLocalStorage(key);

    if (!stickerPosition) {
      const initialPosition = {
        x: STICKERS[effect].data[index].initialPosition.x,
        y: STICKERS[effect].data[index].initialPosition.y,
      };

      setLocalStorage(key, JSON.stringify(initialPosition));
      return initialPosition;
    }

    return JSON.parse(stickerPosition);
  };

  if (!STICKERS[effect]) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 h-full overflow-hidden [&_.moveable-control-box]:opacity-0">
      {stickers.map((sticker, index) => {
        return (
          <Sticker
            key={`${sticker.src}_${index}_${containerInfo.scrollHeight}_${containerInfo.scrollWidth}`}
            src={sticker.src}
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
