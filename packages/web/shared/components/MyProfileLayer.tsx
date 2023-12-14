"use client";

import * as React from "react";
import Layer, { LayerContent } from "@/components/Layer";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InputWrapper from "@/components/InputWrapper";
import { InstagramLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import ProfileAvatar from "@/components/ProfileAvatar";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { useForm } from "react-hook-form";
import { PrismaDBMainTypes } from "@bash/db";
import { useAlertDialog } from "@/components/AlertDialogProvider";
import { useEffect } from "react";

interface ProfileUpdateForm {
  instagram?: string | null;
  twitter?: string | null;
  description?: string | null;
}

export interface MyProfileLayerProps
  extends React.ComponentPropsWithoutRef<typeof Layer> {}

const MyProfileLayer = ({ ...props }: MyProfileLayerProps) => {
  const session = useSession();
  const { data, refetch } = useQuery<PrismaDBMainTypes.User>({
    queryKey: ["user", session.data?.user.id],
    queryFn: () => {
      return ky.get(`/api/user`).json();
    },
    enabled: session.status === "authenticated" && props.open,
  });
  const { register, formState, handleSubmit } = useForm<ProfileUpdateForm>({
    values: {
      instagram: data?.instagram,
      twitter: data?.twitter,
      description: data?.description,
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  });
  const { isSubmitting, isDirty } = formState;
  const { openDialog } = useAlertDialog();

  // TEMP: avatarFallback이 없는 경우에만 업데이트
  useEffect(() => {
    if (data?.avatarFallback && !session.data?.user.avatarFallback) {
      session.update({
        avatarFallback: data.avatarFallback,
      });
    }
  }, [data, session]);

  return (
    <Layer title="프로필" {...props}>
      <LayerContent className="h-full overflow-auto">
        <form
          className="flex h-full flex-col justify-between"
          onSubmit={handleSubmit(async (data) => {
            if (!isDirty) {
              props.onClose?.();
              return;
            }

            try {
              await ky.put(`/api/user`, { json: data });
              await refetch();
              props.onClose?.();
            } catch (e) {
              if (e instanceof Error) {
                openDialog({
                  title: e.message,
                  hideCancel: true,
                });
              }
            }
          })}
        >
          <div>
            <div className="flex flex-col items-center">
              <p className="text-center text-[1.625rem] font-bold">
                다른 사람들에게 보여질 {session.data?.user.name}님의
                프로필이에요
              </p>
              <div className="my-[2.5rem]">
                <ProfileAvatar
                  size="6.25rem"
                  name={session.data?.user.name}
                  avatarFallback={session.data?.user.avatarFallback}
                />
              </div>
            </div>
            <div className="space-y-4">
              <InputWrapper
                leftAddon={
                  <span className="flex items-center space-x-1">
                    <InstagramLogoIcon className="h-[1.25rem] w-[1.25rem]" />
                    <span>@</span>
                  </span>
                }
              >
                <Input
                  className="pl-[3.375rem]"
                  placeholder="인스타그램 ID"
                  {...register("instagram")}
                />
              </InputWrapper>
              <InputWrapper
                leftAddon={
                  <span className="flex items-center space-x-1">
                    <TwitterLogoIcon className="h-[1.25rem] w-[1.25rem]" />
                    <span>@</span>
                  </span>
                }
              >
                <Input
                  className="pl-[3.375rem]"
                  placeholder="트위터 ID"
                  {...register("twitter")}
                />
              </InputWrapper>
              <Input placeholder="한 줄 소개" {...register("description")} />
            </div>
          </div>
          <div className="mt-8">
            <Button
              variant="highlight"
              className="w-full"
              pending={isSubmitting}
            >
              입력완료
            </Button>
          </div>
        </form>
      </LayerContent>
    </Layer>
  );
};

export default MyProfileLayer;
