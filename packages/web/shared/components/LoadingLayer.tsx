import * as React from "react";

export interface LoadingLayerProps {}

const LoadingLayer = ({}: LoadingLayerProps) => {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center"
      aria-label="Loading"
    >
      <img
        src="/images/loading.svg"
        alt=""
        style={{
          width: "5rem",
          height: "5rem",
        }}
      />
    </div>
  );
};

export default LoadingLayer;
