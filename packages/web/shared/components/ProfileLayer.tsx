"use client";

import * as React from "react";
import Layer from "@/components/Layer";
import Image from "next/image";
import treeImage from "@/public/images/tree.png";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarFallbackIcon from "@/assets/avatar.svg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface ProfileLayerProps
  extends React.ComponentPropsWithoutRef<typeof Layer> {}

const ProfileLayer = ({ ...props }: ProfileLayerProps) => {
  const session = useSession();

  return (
    <Layer {...props}>
      <div className="flex h-full flex-col justify-between pt-20">
        <div>
          <div className="flex flex-col items-center">
            <p className="text-center text-[1.625rem] font-bold">
              다른 사람들에게 보여질 {session.data?.user.name}님의 프로필이에요
            </p>
            <div className="my-[2.5rem]">
              <Avatar className="h-[5.625rem] w-[5.625rem]">
                <AvatarImage />
                <AvatarFallback>
                  <AvatarFallbackIcon />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="space-y-4">
            <Input />
            <Input placeholder="한 줄 소개" />
          </div>
        </div>
        <div>
          <Button variant="highlight" className="w-full">
            입력완료
          </Button>
        </div>
      </div>
    </Layer>
  );
};

export default ProfileLayer;
