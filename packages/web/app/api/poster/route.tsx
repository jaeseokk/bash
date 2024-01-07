import { ImageResponse } from "next/og";
import * as React from "react";
import { NextRequest } from "next/server";

export const runtime = "edge";

const size = {
  width: 560,
  height: 900,
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const coverImage = searchParams.get("coverImage") || "";
  const title = searchParams.get("title") || "";
  const startDate1 = searchParams.get("startDate1") || "";
  const startDate2 = searchParams.get("startDate2") || "";
  const location = searchParams.get("location") || "";
  const fontData = await fetch(
    new URL("../../../public/fonts/Pretendard-Bold.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        className="relative "
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: '"Pretendard"',
          wordBreak: "keep-all",
          wordWrap: "break-word",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            filter: "blur(50px)",
            display: "flex",
            overflow: "hidden",
          }}
        >
          <img
            src={coverImage}
            alt=""
            width="200"
            height="200"
            style={{
              position: "absolute",
              top: "-60px",
              left: "-260px",
              width: "1080px",
              height: "1080px",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "480x",
            height: "480px",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <img src={coverImage} alt="" width="480" sizes="100vw" />
        </div>
        <div
          style={{
            position: "absolute",
            left: "40px",
            top: "40px",
            width: "420px",
            fontSize: "56px",
            fontWeight: 700,
            lineHeight: "110%",
            textShadow: "0 1px 5px rgb(0 0 0 / 25%)",
            color: "white",
          }}
        >
          {title}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "40px",
            fontSize: "40px",
            fontWeight: 700,
            lineHeight: "130%",
            textShadow: "0 1px 5px rgb(0 0 0 / 25%)",
            color: "white",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "480px",
            }}
          >
            <div>{startDate1}</div>
            <div>{startDate2}</div>
          </div>
          {location && (
            <div
              style={{
                width: "360px",
                marginTop: "32px",
                whiteSpace: "pre-wrap",
              }}
            >
              {location}
            </div>
          )}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "4px",
            right: "4px",
            fontSize: "24px",
            fontWeight: 700,
            color: "white",
            opacity: 0.8,
          }}
        >
          @lets.fyi
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Pretendard",
          data: fontData,
          style: "normal",
        },
      ],
    },
  );
}
