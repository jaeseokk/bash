import * as React from "react";
import Moveable, { OnDrag } from "react-moveable";
import Image from "next/image";
import { useState } from "react";
import { flushSync } from "react-dom";

export interface StickerProps {
  src: string;
  initialPosition?: {
    x: number;
    y: number;
  };
}

const Sticker = ({ src, initialPosition }: StickerProps) => {
  const [target, setTarget] = useState<HTMLElement | null>();
  const [transform, setTransform] = useState<string | undefined>(() => {
    if (!initialPosition) {
      return undefined;
    }

    return `translate(${initialPosition.x}px, ${initialPosition.y}px)`;
  });

  return (
    <>
      <span
        ref={setTarget}
        className="pointer-events-auto absolute z-10 h-[90px] w-[90px]"
        style={{
          transform,
        }}
      >
        <Image src={src} alt="" width={90} height={90} />
      </span>
      <Moveable
        draggable={true}
        target={target}
        flushSync={flushSync}
        onDrag={({
          target,
          beforeDelta,
          beforeDist,
          left,
          top,
          right,
          bottom,
          delta,
          dist,
          transform,
          clientX,
          clientY,
        }: OnDrag) => {
          // console.log("onDrag left, top", left, top);
          // // target!.style.left = `${left}px`;
          // // target!.style.top = `${top}px`;
          // console.log("onDrag translate", dist);
          setTransform(transform);
        }}
        onDragEnd={({ target, isDrag, clientX, clientY }) => {
          console.log("onDragEnd", target, isDrag);
        }}
      />
    </>
  );
};

export default Sticker;
