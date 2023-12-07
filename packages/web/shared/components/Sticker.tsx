import * as React from "react";
import Moveable, { OnDrag } from "react-moveable";
import Image from "next/image";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";

export interface StickerProps {
  index: number;
}

const Sticker = ({ index }: StickerProps) => {
  const [target, setTarget] = useState<HTMLElement | null>();
  return (
    <>
      <span ref={setTarget} className="absolute z-10 h-[90px] w-[90px]">
        <Image
          src={`https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/effects/effect${index}.png`}
          alt=""
          width={90}
          height={90}
        />
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
          console.log("onDrag left, top", left, top);
          // target!.style.left = `${left}px`;
          // target!.style.top = `${top}px`;
          console.log("onDrag translate", dist);
          target!.style.transform = transform;
        }}
        onDragEnd={({ target, isDrag, clientX, clientY }) => {
          console.log("onDragEnd", target, isDrag);
        }}
      />
    </>
  );
};

export default Sticker;
