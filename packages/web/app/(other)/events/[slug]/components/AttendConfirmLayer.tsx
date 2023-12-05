"use client";

import * as React from "react";
import Layer from "@/components/Layer";
import Image from "next/image";
import treeImage from "@/public/images/tree.png";

export interface AttendConfirmLayerProps
  extends React.ComponentPropsWithoutRef<typeof Layer> {}

const AttendConfirmLayer = ({ ...props }: AttendConfirmLayerProps) => {
  return (
    <Layer hideCloseButton {...props}>
      <div className="flex h-full flex-col items-center justify-center space-y-8 pb-20">
        <div>
          <Image src={treeImage} height={164} width={164} alt="" />
        </div>
        <div className="text-center text-[1.625rem] font-bold">
          <p>축하합니다</p>
          <p>이벤트에 대한 답변을</p>
          <p>완료했어요!</p>
        </div>
      </div>
    </Layer>
  );
};

export default AttendConfirmLayer;
