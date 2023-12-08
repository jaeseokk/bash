import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarFallbackIcon from "@/assets/avatar.svg";
import { cn } from "@/lib/utils";

export interface ProfileAvatarProps {
  size?: string | number;
  name?: string | null;
  white?: boolean;
}

const ProfileAvatar = ({ size = "1rem", name, white }: ProfileAvatarProps) => {
  return (
    <Avatar
      style={{
        height: size,
        width: size,
      }}
    >
      <AvatarImage />
      <AvatarFallback>
        {name ? (
          <span
            className={cn(
              "inline-flex h-full w-full items-center justify-center rounded-full border border-white font-bold",
              white && "border-black",
            )}
            style={{
              fontSize: `calc(${size} * 0.5)`,
            }}
          >
            {name[0].toUpperCase()}
          </span>
        ) : (
          <AvatarFallbackIcon />
        )}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
