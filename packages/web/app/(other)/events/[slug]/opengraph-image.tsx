import { ImageResponse } from "next/og";
import { getUrlOrigin } from "@/utils";

export const runtime = "edge";

export const alt = "Event Cover Image";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const origin = getUrlOrigin();

  try {
    const event = await fetch(`${origin}/api/events/${slug}`).then((res) =>
      res.json(),
    );

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
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
              width="630"
              height="630"
              src={`https://lets.fyi/_next/image?url=${encodeURIComponent(
                event.coverImage,
              )}&w=16&q=10`}
              style={{
                position: "absolute",
                top: "-285px",
                width: "1200px",
                height: "1200px",
                left: 0,
                right: 0,
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "540x",
              height: "540px",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <img
              width="630"
              height="630"
              src={`https://lets.fyi/_next/image?url=${encodeURIComponent(
                event.coverImage,
              )}&w=128&q=10`}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: "54px",
              right: "170px",
            }}
          >
            <svg
              width="122"
              height="64"
              viewBox="0 0 61 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="Layer_1" clip-path="url(#clip0_1538_13457)">
                <path
                  id="Vector"
                  d="M11.1437 24.1526H0.5L3.30635 0.65918H9.36397L7.24159 18.5171H11.7931L11.1423 24.1526H11.1437Z"
                  fill="white"
                />
                <path
                  id="Vector_2"
                  d="M25.0248 13.0935H19.8225L19.4121 16.5107H24.6517L24.0009 21.8291H18.7958L18.3509 25.4211H23.5532L22.9024 31.0567H11.6079L14.4143 7.56323H25.7087L25.0248 13.0935Z"
                  fill="white"
                />
                <path
                  id="Vector_3"
                  d="M35.808 6.2947H33.1592L31.0368 24.1526H24.9792L27.1016 6.2947H23.748L24.4306 0.65918H37.8185L35.808 6.2947Z"
                  fill="white"
                />
                <path
                  id="Vector_4"
                  d="M40.7368 9.52983H35.9448L39.2445 0.65918H45.1998L40.7368 9.52983Z"
                  fill="white"
                />
                <path
                  id="Vector_5"
                  d="M51.2727 15.3857C50.6564 14.1173 49.0398 12.8147 47.5682 12.8147C46.7474 12.8147 45.7539 13.4489 45.7539 14.3647C45.7539 16.4423 50.5459 17.4292 50.5459 22.2541C50.5459 27.0791 47.1233 31.3409 42.2636 31.3409C40.7575 31.3409 39.2859 30.9542 37.9166 30.3199L38.8065 22.9581C39.5941 24.2962 40.7575 25.5291 42.3659 25.5291C43.358 25.5291 44.3515 24.8949 44.3515 23.7686C44.3515 21.6555 39.6286 20.7041 39.6286 15.6317C39.6286 11.2988 42.8909 7.07392 47.4314 7.00282C48.9375 6.97865 50.8278 7.46072 52.128 8.20018L51.2727 15.3857Z"
                  fill="white"
                />
                <path
                  id="Vector_6"
                  d="M54.5446 25.3144C52.7994 25.3144 51.5669 23.9407 51.5669 22.1803C51.5669 20.0671 53.3466 18.1644 55.3999 18.1644C57.1796 18.1644 58.4121 19.5381 58.4121 21.3341C58.4121 23.4117 56.5633 25.3144 54.5446 25.3144ZM58.6512 16.5092H52.7303L54.5791 0.65918H60.5L58.6512 16.5092Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_1538_13457">
                  <rect
                    width="60"
                    height="30.6818"
                    fill="white"
                    transform="translate(0.5 0.65918)"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      ),
      {
        ...size,
      },
    );
  } catch (e) {
    return null;
  }
}
