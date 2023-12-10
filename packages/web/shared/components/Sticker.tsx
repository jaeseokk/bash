import * as React from "react";
import Moveable, { OnDrag } from "react-moveable";
import Image from "next/image";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

export interface StickerProps {
  src: string;
  initialPosition?: {
    x: number;
    y: number;
  };
  containerInfo: {
    scrollHeight: number;
    scrollWidth: number;
  };
  onSavePosition: (x: number, y: number) => void;
}

const Sticker = ({
  src,
  initialPosition,
  containerInfo: { scrollHeight, scrollWidth },
  onSavePosition,
}: StickerProps) => {
  const [target, setTarget] = useState<HTMLElement | null>();
  const [transform, setTransform] = useState<string | undefined>(() => {
    if (!initialPosition) {
      return undefined;
    }

    if (!scrollHeight || !scrollWidth) {
      return undefined;
    }

    return `translate(${(initialPosition.x * scrollWidth) / 100}px, ${
      (initialPosition.y * scrollHeight) / 100
    }px)`;
  });

  if (!transform) {
    return null;
  }

  return (
    <>
      <span
        ref={setTarget}
        className="pointer-events-auto absolute z-10 h-[90px] w-[90px]"
        style={{
          transform,
          transformOrigin: "center",
        }}
      >
        <Image src={src} alt="" width={90} height={90} />
      </span>
      <Moveable
        draggable={true}
        target={target}
        flushSync={flushSync}
        onDrag={({ transform }: OnDrag) => {
          setTransform(transform);
        }}
        onDragEnd={({ target, isDrag }) => {
          const extractedTransform = target!.style.transform.match(
            /translate\((?<x>\-?[\d.]+)px, (?<y>\-?[\d.]+)px\)/,
          );

          const [, left, top] = extractedTransform ?? [];

          onSavePosition(
            (Number(left) * 100) / scrollWidth,
            (Number(top) * 100) / scrollHeight,
          );
        }}
      />
    </>
  );
};

export default Sticker;
