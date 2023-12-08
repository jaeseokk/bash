"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarFallbackIcon from "@/assets/avatar.svg";
import { signOut } from "next-auth/react";
import MyProfileLayer from "@/components/MyProfileLayer";
import { useState } from "react";
import { useDisclosure } from "@/hooks/useDisclosure";
import ProfileAvatar from "@/components/ProfileAvatar";

export interface AvatarButtonProps {
  user: {
    id: number;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const AvatarButton = ({ user }: AvatarButtonProps) => {
  const {
    show: showProfileLayer,
    handleShow: handleShowProfileLayer,
    handleClose: handleCloseProfileLayer,
  } = useDisclosure();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <ProfileAvatar size="2rem" name={user?.name} />
        </DropdownMenuTrigger>
        <DropdownMenuContent avoidCollisions>
          <DropdownMenuItem onClick={handleShowProfileLayer}>
            프로필 보기
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              return signOut();
            }}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <MyProfileLayer
        open={showProfileLayer}
        onClose={handleCloseProfileLayer}
      />
    </>
  );
};

export default AvatarButton;
