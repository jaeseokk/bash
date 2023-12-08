"use client";

import * as React from "react";
import Layer, { LayerContent } from "@/components/Layer";
import Image from "next/image";
import treeImage from "@/public/images/tree.png";
import { useEffect, useRef } from "react";

export interface AttendConfirmLayerProps
  extends React.ComponentPropsWithoutRef<typeof Layer> {}

const AttendConfirmLayer = ({ ...props }: AttendConfirmLayerProps) => {
  const timerRef = useRef<NodeJS.Timer>();

  useEffect(() => {
    if (props.open) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        props.onClose?.();
      }, 2000);
    }
  }, [props.open]);

  return (
    <Layer hideCloseButton {...props}>
      <LayerContent className="h-full">
        <div className="flex h-full flex-col items-center justify-center space-y-8 pb-20">
          <div>
            <Image
              src={treeImage}
              height={164}
              width={164}
              alt=""
              placeholder="blur"
            />
          </div>
          <div className="text-center text-[1.625rem] font-bold">
            <p>축하합니다</p>
            <p>이벤트에 대한 답변을</p>
            <p>완료했어요!</p>
          </div>
        </div>
      </LayerContent>
    </Layer>
  );
};

export default AttendConfirmLayer;
