import * as React from "react";
import { STICKERS } from "@/constants/sticker";
import Sticker from "@/components/Sticker";
import { generateRandomPoints } from "@/utils";

export interface StickerContainerProps {
  effect: keyof typeof STICKERS;
}

const StickerContainer = ({ effect }: StickerContainerProps) => {
  const stickerUrls = STICKERS[effect];
  const vw = Math.max(
    document?.documentElement.clientWidth || 0,
    window?.innerWidth || 0,
  );
  const vh = Math.max(
    document?.documentElement.clientHeight || 0,
    window?.innerHeight || 0,
  );

  if (!vw || !vh) {
    return;
  }

  const points = generateRandomPoints(vw - 200, vh - 300, stickerUrls.length);

  console.log(vw, vh, points);

  return (
    <div className="pointer-events-none absolute inset-0 h-full overflow-hidden [&_.moveable-control-box]:opacity-0">
      {stickerUrls.map((src, index) => {
        return (
          <Sticker
            key={`${src}_${index}`}
            src={src}
            initialPosition={{
              x: points[index].x + 50,
              y: points[index].y,
            }}
          />
        );
      })}
    </div>
  );
};

export default StickerContainer;
