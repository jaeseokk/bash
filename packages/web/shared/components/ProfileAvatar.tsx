import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarFallbackIcon from "@/assets/avatar.svg";

export interface ProfileAvatarProps {
  size?: string | number;
}

const ProfileAvatar = ({ size }: ProfileAvatarProps) => {
  return (
    <Avatar
      style={{
        height: size,
        width: size,
      }}
    >
      <AvatarImage />
      <AvatarFallback>
        <AvatarFallbackIcon />
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
