import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarFallbackIcon from "@/assets/avatar.svg";

export interface ProfileAvatarProps {
  size?: string | number;
  name?: string | null;
}

const ProfileAvatar = ({ size = "1rem", name }: ProfileAvatarProps) => {
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
            className="inline-flex h-full w-full items-center justify-center rounded-full border border-white"
            style={{
              fontSize: `calc(${size} * 0.6)`,
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
