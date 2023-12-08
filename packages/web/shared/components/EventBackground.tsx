import * as React from "react";
import Image from "next/image";

export interface EventBackgroundProps {
  coverImage?: string;
}

const EventBackground = ({ coverImage }: EventBackgroundProps) => {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-[-3.5rem] z-[-1] overflow-hidden">
      <div
        className="absolute left-0 right-0 top-0 h-[7.5rem]"
        style={{
          background:
            "linear-gradient(180deg, #000 60%, rgba(0, 0, 0, 0.00) 100%)",
        }}
      ></div>
      <div
        className="absolute bottom-0 left-0 right-0 top-0 backdrop-blur-[25px]"
        style={{
          background:
            "linear-gradient(0deg, #000 27.08%, rgba(0, 0, 0, 0.50) 100%)",
        }}
      ></div>
      {coverImage && (
        <Image
          src={coverImage}
          alt=""
          width="200"
          height="200"
          style={{
            width: "auto",
            height: "120%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      )}
    </div>
  );
};

export default EventBackground;
