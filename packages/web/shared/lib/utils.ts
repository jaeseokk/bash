import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ReactRef<T> =
  | React.Ref<T>
  | React.RefObject<T>
  | React.MutableRefObject<T>;

export const mergeRefs = <T>(...refs: (ReactRef<T> | undefined)[]) => {
  return (value: any) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        // @ts-ignore
        (ref as React.MutableRefObject<T>).current = value;
      }
    });
  };
};

export const shimmer = (w: number, h: number) => `
<svg
  role="img"
  width="${w}"
  height="${h}"
  aria-labelledby="loading-aria"
  viewBox="0 0 ${w} ${h}"
  preserveAspectRatio="none"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
>
  <title id="loading-aria">Loading...</title>
  <rect
    x="0"
    y="0"
    width="100%"
    height="100%"
    clip-path="url(#clip-path)"
    style='fill: url("#fill");'
  ></rect>
  <defs>
    <clipPath id="clip-path">
        <rect x="0" y="0" rx="0" ry="0" width="${w}" height="${h}" />
    </clipPath>
    <linearGradient id="fill">
      <stop
        offset="0.599964"
        stop-color="#f3f3f3"
        stop-opacity="1"
      >
        <animate
          attributeName="offset"
          values="-2; -2; 1"
          keyTimes="0; 0.25; 1"
          dur="2s"
          repeatCount="indefinite"
        ></animate>
      </stop>
      <stop
        offset="1.59996"
        stop-color="#ecebeb"
        stop-opacity="1"
      >
        <animate
          attributeName="offset"
          values="-1; -1; 2"
          keyTimes="0; 0.25; 1"
          dur="2s"
          repeatCount="indefinite"
        ></animate>
      </stop>
      <stop
        offset="2.59996"
        stop-color="#f3f3f3"
        stop-opacity="1"
      >
        <animate
          attributeName="offset"
          values="0; 0; 3"
          keyTimes="0; 0.25; 1"
          dur="2s"
          repeatCount="indefinite"
        ></animate>
      </stop>
    </linearGradient>
  </defs>
</svg>
`;

export const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const formatDistanceToNowInKorean = (date: Date) => {
  const today = new Date();

  const betweenTime = Math.floor(
    (today.getTime() - date.getTime()) / 1000 / 60,
  );
  if (betweenTime < 1) return "방금전";
  if (betweenTime < 60) {
    return `${betweenTime}분전`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간전`;
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  if (betweenTimeDay < 365) {
    return `${betweenTimeDay}일전`;
  }

  return `${Math.floor(betweenTimeDay / 365)}년전`;
};

export const replaceToAMPM = (dateStr: string) => {
  return dateStr.replace("오전", "AM").replace("오후", "PM");
};

export const formatDate = (date: Date | string | null | undefined) => {
  if (!date) {
    return "";
  }

  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();

  if (now.getFullYear() === dateObj.getFullYear()) {
    return replaceToAMPM(format(dateObj, "M월 d일(E) hh:mm a", { locale: ko }));
  }

  return replaceToAMPM(format(dateObj, "yyyy년 M월 d일(E) hh:mm a"));
};

export const getFullUrl = (pathProp: string) => {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const path = pathProp.startsWith("/") ? pathProp : `/${pathProp}`;
  return `${origin}${path}`;
};

export const generateRandomPoints = (w: number, h: number, count: number) => {
  const points: { x: number; y: number }[] = [];
  // generate random points with similar distance
  const r = Math.min(w, h) / 2;
  const cx = w / 2;
  const cy = h / 2;
  const minDist = r / Math.sqrt(count);
  let tries = 1000;
  let i = 0;
  while (i < count && tries > 0) {
    const p = {
      x: Math.random() * w,
      y: Math.random() * h,
    };
    const dist = Math.sqrt(Math.pow(p.x - cx, 2) + Math.pow(p.y - cy, 2));
    if (dist > r - minDist && dist < r + minDist) {
      let valid = true;
      for (let j = 0; j < points.length; j++) {
        const p2 = points[j];
        const dist2 = Math.sqrt(
          Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2),
        );
        if (dist2 < minDist) {
          valid = false;
          break;
        }
      }
      if (valid) {
        points.push(p);
        i++;
      }
    }
    tries--;
  }

  return points;
};

export const isProd = process.env.NODE_ENV === "production";

export const isDeployProd = process.env.VERCEL_ENV === "production";

export const getUrlOrigin = () => {
  if (isDeployProd) {
    return "https://lets.fyi";
  } else if (isProd) {
    return `${process.env.VERCEL_URL}`;
  } else {
    return `http://localhost:${process.env.PORT || "3000"}`;
  }
};
