"use client";

import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import DatePicker from "@/components/DatePicker";
import { AutosizeTextarea, Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn, shimmer, toBase64 } from "@/utils";
import { Controller, useForm } from "react-hook-form";
import BottomSheet from "@/components/BottomSheet";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginForm from "../../../(main)/signin/components/LoginForm";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { EventTitleInput } from "@/components/EventTitleInput";
import BottomButton from "@/components/BottomButton";
import EffectIcon from "@/assets/effect.svg";
import PreviewIcon from "@/assets/preview.svg";
import EditIcon from "@/assets/edit.svg";
import CrownIcon from "@/assets/crown_gradient.svg";
import LocationIcon from "@/assets/location_gradient.svg";
import CalendarIcon from "@/assets/calendar_gradient.svg";
import FloatingArea from "@/components/FloatingArea";
import BottomSheet2 from "@/components/BottomSheet2";
import PreviewLayer from "./PreviewLayer";
import { Player } from "@lottiefiles/react-lottie-player";
import heart from "@/assets/heart.json";
import EventBackground from "@/components/EventBackground";

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
  startDate: Date;
  endDate: Date | null;
  authorName: string | null;
  location: string | null;
  description: string | null;
}

export interface CreateEventFormProps {
  initialData?: CreateEventFormData;
  onSubmit: (data: CreateEventFormData) => Promise<void>;
}

const CreateEventForm = ({ initialData, onSubmit }: CreateEventFormProps) => {
  const session = useSession();
  const router = useRouter();
  const {
    control,
    register,
    getValues,
    setValue,
    handleSubmit,
    watch,
    formState,
  } = useForm<CreateEventFormData>({
    defaultValues: {
      ...initialData,
      coverImage: initialData?.coverImage ?? COVER_IMAGE_LIST[0],
    },
  });
  const { isSubmitting } = formState;
  const coverImage = watch("coverImage");
  const [showCoverImageBottomSheet, setShowCoverImageBottomSheet] =
    useState(false);
  const [showLoginBottomSheet, setShowLoginBottomSheet] = useState(false);
  const [cachedFormData, setCachedFormData] = useState<CreateEventFormData>();
  const submit = async (data: CreateEventFormData) => {
    await onSubmit(data);
  };

  return (
    <>
      <EventBackground coverImage={coverImage} />
      {/*<div className="fixed inset-0">*/}
      {/*  <Player src={heart} autoplay loop />*/}
      {/*</div>*/}
      <form
        className=""
        onSubmit={handleSubmit(
          async (data) => {
            if (session.status === "unauthenticated") {
              setShowLoginBottomSheet(true);
              return;
            }

            await submit(data);
          },
          (e) => {
            console.log(e);
          },
        )}
      >
        <Block className="mb-[3.125rem]">
          <EventTitleInput
            placeholder="이벤트 이름을 적어주세요"
            minRows={1}
            {...register("title", {
              required: true,
            })}
          />
        </Block>
        <Block className="mb-[3.125rem]">
          <input
            type="hidden"
            {...register("coverImage", {
              required: true,
            })}
          />
          <div
            role="button"
            className="relative overflow-hidden rounded-2xl border border-[#343434]"
            onClick={() => {
              setShowCoverImageBottomSheet(true);
            }}
          >
            {coverImage && (
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
              />
            )}
            <button
              type="button"
              className="absolute bottom-[1rem] right-[1rem] flex h-[3rem] w-[3rem] items-center justify-center rounded-full bg-[#000000cc]"
            >
              <EditIcon />
            </button>
          </div>
        </Block>
        <Block className="mb-6">
          <Field labelIcon={<CalendarIcon />} label="날짜 및 시간">
            <Controller
              name="startDate"
              rules={{
                required: true,
              }}
              render={({ field: { value } }) => {
                const date = value ? new Date(value) : undefined;

                console.log(date);

                return (
                  <DatePicker
                    placeholder="날짜를 선택해주세요"
                    startDate={date}
                    onChange={(value) => {
                      if (!value) {
                        return;
                      }

                      setValue("startDate", value[0]);

                      if (value[1]) {
                        setValue("endDate", value[1]);
                      }
                    }}
                  />
                );
              }}
              control={control}
            />
          </Field>
        </Block>
        <Block className="mb-6 space-y-2.5">
          <Field labelIcon={<CrownIcon />} label="주최자">
            <Input
              placeholder="이름을 적어주세요"
              {...register("authorName")}
            />
          </Field>
          <Field labelIcon={<LocationIcon />} label="장소 위치 & 주소">
            <AutosizeTextarea
              className="resize-none"
              placeholder="장소 위치, 주소, 링크"
              minRows={1}
              {...register("location")}
            />
          </Field>
        </Block>
        <Block>
          <Textarea
            className="min-h-[11rem]"
            placeholder="이벤트에 대한 설명을 적어주세요"
            {...register("description")}
          />
        </Block>
        <FloatingArea className="mt-9">
          <BottomButton.Root>
            <BottomButton.Item icon={<EffectIcon />}>꾸미기</BottomButton.Item>
            <BottomButton.Divider />
            <BottomButton.Item
              icon={<PreviewIcon />}
              onClick={() => {
                setCachedFormData(getValues());
              }}
            >
              미리보기
            </BottomButton.Item>
          </BottomButton.Root>
          <Button className="w-full rounded-none" pending={isSubmitting}>
            저장하기
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
      <BottomSheet2
        open={showLoginBottomSheet}
        onClose={() => {
          setShowLoginBottomSheet(false);
        }}
      >
        <div className="px-4 pb-10 pt-10">
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
      </BottomSheet2>
      <PreviewLayer
        open={!!cachedFormData}
        onClose={() => {
          setCachedFormData(undefined);
        }}
        eventInfo={cachedFormData}
      />
    </>
  );
};

interface BlockProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Block = ({ children, className, ...rest }: BlockProps) => {
  return (
    <div className={cn("mx-auto max-w-[750px] px-8", className)} {...rest}>
      {children}
    </div>
  );
};

export default CreateEventForm;
