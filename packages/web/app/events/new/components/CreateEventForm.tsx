"use client";

import * as React from "react";
import EventInput from "@/components/EventInput";
import Image from "next/image";
import DatePicker from "@/components/DatePicker";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn, shimmer, toBase64 } from "@/utils";
import { Controller, useForm } from "react-hook-form";
import BottomSheet from "@/components/BottomSheet";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginForm from "../../../signin/components/LoginForm";
import { PrismaDBMainTypes } from "@bash/db";
import { getPalette } from "../../../../shared/lib/color-thief";

const COVER_IMAGE_LIST = [
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/mood01.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/mood02.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/mood03.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/mood04.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/mood05.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/mood06.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/xmas00.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/xmas01.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/xmas02.png",
];

interface CreateEventFormData {
  title: string;
  coverImage: string;
  date: string;
  authorName: string;
  location: string;
  description: string;
}

export interface CreateEventFormProps {
  onSubmit: (data: CreateEventFormData) => Promise<PrismaDBMainTypes.Event>;
}

const CreateEventForm = ({ onSubmit }: CreateEventFormProps) => {
  const session = useSession();
  const router = useRouter();
  const { control, register, setValue, handleSubmit, watch } =
    useForm<CreateEventFormData>({
      defaultValues: {
        coverImage: COVER_IMAGE_LIST[0],
      },
    });
  const coverImage = watch("coverImage");
  const [showCoverImageBottomSheet, setShowCoverImageBottomSheet] =
    useState(false);
  const [showLoginBottomSheet, setShowLoginBottomSheet] = useState(false);
  const [coverImagePalette, setCoverImagePalette] =
    useState<
      [
        [number, number, number],
        [number, number, number],
        [number, number, number],
        [number, number, number],
      ]
    >();
  const submit = async (data: CreateEventFormData) => {
    const res = await onSubmit(data);
    router.push(`/events/${res.slug}`);
  };

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-[-1]"
        style={
          coverImagePalette
            ? {
                background: `linear-gradient(-45deg, rgb(${coverImagePalette[0].join(
                  ",",
                )}), rgb(${coverImagePalette[1].join(
                  ",",
                )}), rgb(${coverImagePalette[2].join(
                  ",",
                )}), rgb(${coverImagePalette[3].join(",")}))`,
                animation: `gradient 5s ease infinite`,
                backgroundSize: "150% 150%",
              }
            : undefined
        }
      />
      <form
        onSubmit={handleSubmit(async (data) => {
          if (session.status === "unauthenticated") {
            setShowLoginBottomSheet(true);
            return;
          }

          await submit(data);
        })}
      >
        <Block className="mb-4">
          <EventInput
            placeholder="Title"
            {...register("title", {
              required: true,
            })}
          />
        </Block>
        <div className="mb-4">
          <input
            type="hidden"
            {...register("coverImage", {
              required: true,
            })}
          />
          <div
            role="button"
            onClick={() => {
              setShowCoverImageBottomSheet(true);
            }}
          >
            <Image
              src={coverImage}
              alt="Party main image"
              width="200"
              height="200"
              style={{
                width: "100%",
                height: "auto",
              }}
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                shimmer(1, 1),
              )}`}
              sizes="100vw"
              onLoad={async (e) => {
                const img = e.currentTarget;
                const palette = await getPalette(img);

                setCoverImagePalette(palette as any);
              }}
            />
          </div>
        </div>
        <Block className="mb-6">
          <Controller
            name="date"
            rules={{
              required: true,
            }}
            render={({ field: { value, onChange } }) => {
              const date = value ? new Date(value) : undefined;

              return (
                <DatePicker
                  placeholder="날짜 및 시간"
                  value={date}
                  onChange={(value) => {
                    onChange(value?.toISOString());
                  }}
                />
              );
            }}
            control={control}
          />
        </Block>
        <Block className="mb-6 space-y-2">
          <EventInput
            label="모임장"
            placeholder="홍길동"
            {...register("authorName")}
          />
          <EventInput
            label="장소 위치"
            placeholder="주소, 링크"
            {...register("location")}
          />
        </Block>
        <Block>
          <Textarea
            placeholder="모임에 대한 설명을 적어주세요"
            {...register("description")}
          />
        </Block>
        <FloatingArea>
          <Button className="w-full" size="lg">
            Save Draft
          </Button>
        </FloatingArea>
      </form>
      <BottomSheet
        isOpen={showCoverImageBottomSheet}
        onClose={() => {
          setShowCoverImageBottomSheet(false);
        }}
      >
        <div className="grid grid-cols-2 gap-4 px-4 pb-4 md:grid-cols-3">
          {COVER_IMAGE_LIST.map((url) => (
            <div
              key={url}
              role="button"
              onClick={() => {
                setValue("coverImage", url);
                setShowCoverImageBottomSheet(false);
              }}
            >
              <Image
                src={url}
                alt="Party main image"
                width="200"
                height="200"
                style={{
                  width: "100%",
                  height: "auto",
                }}
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                  shimmer(1, 1),
                )}`}
                sizes="100vw"
              />
            </div>
          ))}
        </div>
      </BottomSheet>
      <BottomSheet
        snapPoints={[400, 0]}
        isOpen={showLoginBottomSheet}
        onClose={() => {
          setShowLoginBottomSheet(false);
        }}
      >
        <div className="px-4 pb-10 pt-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Sign In</h1>
          </div>
          <div className="mt-4">
            <LoginForm
              onSubmit={async (data) => {
                return signIn("credentials", {
                  redirect: false,
                  ...data,
                });
              }}
              onCallback={() => {
                return handleSubmit(submit)();
              }}
            />
          </div>
        </div>
      </BottomSheet>
    </>
  );
};

interface BlockProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Block = ({ children, className, ...rest }: BlockProps) => {
  return (
    <div className={cn("mx-auto max-w-[750px] px-2", className)} {...rest}>
      {children}
    </div>
  );
};

interface FloatingAreaProps {
  children: React.ReactNode;
}

const FloatingArea = ({ children }: FloatingAreaProps) => {
  return <div className="fixed bottom-0 left-0 right-0">{children}</div>;
};

export default CreateEventForm;
