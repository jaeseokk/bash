import * as React from "react";
import Image from "next/image";

export interface LoadingLayerProps {}

const LoadingLayer = ({}: LoadingLayerProps) => {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center"
      aria-label="Loading"
    >
      <Image src="/images/loading.svg" alt="" width={80} height={80} />
    </div>
  );
};

export default LoadingLayer;
