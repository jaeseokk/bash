"use client";

import * as React from "react";

import Image from "next/image";
import emoji_1f4dd from "@/public/images/emoji/1f4dd.png";
import emoji_1f38a from "@/public/images/emoji/1f38a.png";
import emoji_1f382 from "@/public/images/emoji/1f382.png";
import emoji_1f389 from "@/public/images/emoji/1f389.png";
import emoji_1f490 from "@/public/images/emoji/1f490.png";
import emoji_1f497 from "@/public/images/emoji/1f497.png";
import emoji_1f973 from "@/public/images/emoji/1f973.png";

const DATA = {
  "1f4dd": {
    url: emoji_1f4dd,
    native: "👍",
  },
  "1f38a": {
    url: emoji_1f38a,
    native: "🎊",
  },
  "1f382": {
    url: emoji_1f382,
    native: "🎂",
  },
  "1f389": {
    url: emoji_1f389,
    native: "🎉",
  },
  "1f490": {
    url: emoji_1f490,
    native: "💐",
  },
  "1f497": {
    url: emoji_1f497,
    native: "💗",
  },
  "1f973": {
    url: emoji_1f973,
    native: "🥳",
  },
} as const;

export interface EmojiProps extends React.ComponentPropsWithoutRef<"span"> {
  code: keyof typeof DATA;
  size?: string;
}

const Emoji = ({ code, size, ...props }: EmojiProps) => {
  const emoji = DATA[code];

  return (
    <span {...props}>
      <Image
        style={{
          maxWidth: size ?? "1em",
          maxHeight: size ?? "1em",
        }}
        alt={emoji.native}
        src={emoji.url}
      />
    </span>
  );
};

export default Emoji;
