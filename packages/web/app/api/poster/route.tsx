import { ImageResponse } from "next/og";
import * as React from "react";
import { NextRequest } from "next/server";

export const runtime = "edge";

const size = {
  width: 280,
  height: 450,
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const coverImage = searchParams.get("coverImage") || "";
  const title = searchParams.get("title") || "";
  const startDate = searchParams.get("startDate") || "";
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
              top: "-30px",
              left: "-130px",
              width: "540px",
              height: "540px",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "240x",
            height: "240px",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <img src={coverImage} alt="" width="240" height="240" sizes="100vw" />
        </div>
        <div
          style={{
            position: "absolute",
            left: "20px",
            top: "20px",
            width: "210px",
            fontSize: "28px",
            fontWeight: 700,
            lineHeight: "110%",
            textShadow: "0 1px 10px rgb(0 0 0 / 25%)",
            color: "white",
          }}
        >
          {title}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            width: "180px",
            fontSize: "20px",
            fontWeight: 700,
            lineHeight: "130%",
            textShadow: "0 1px 10px rgb(0 0 0 / 25%)",
            color: "white",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              whiteSpace: "pre-wrap",
            }}
          >
            {startDate}
          </div>
          {location && (
            <div
              style={{
                marginTop: "16px",
                whiteSpace: "pre-wrap",
              }}
            >
              {location}
            </div>
          )}
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
