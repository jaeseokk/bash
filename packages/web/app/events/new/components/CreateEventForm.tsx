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
import LoginForm from "../../../signin/components/LoginForm";
import { PrismaDBMainTypes } from "@bash/db";
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
  startDate: string;
  endDate?: string;
  authorName?: string;
  location?: string;
  description?: string;
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
  const submit = async (data: CreateEventFormData) => {
    const res = await onSubmit(data);
    router.push(`/events/${res.slug}`);
  };
  const endDateString = watch("endDate");
  const endDate = endDateString ? new Date(endDateString) : undefined;

  return (
    <>
      {coverImage && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-[-3.5rem] z-[-1] overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0 top-0"
            style={{
              background:
                "linear-gradient(0deg, #000 27.08%, rgba(0, 0, 0, 0.50) 100%)",
              backdropFilter: "blur(25px)",
            }}
          ></div>
          <Image
            src={coverImage}
            alt=""
            width="200"
            height="200"
            style={{
              width: "auto",
              height: "120%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>
      )}
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
          <Controller
            name="title"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { value, onChange, ref } }) => (
              <EventTitleInput
                placeholder="이벤트 이름을 적어주세요"
                value={value}
                onChange={(value) => {
                  onChange(value);
                }}
                ref={ref}
              />
            )}
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
            <button className="absolute bottom-[1rem] right-[1rem] flex h-[3rem] w-[3rem] items-center justify-center rounded-full bg-[#000000cc]">
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

                return (
                  <DatePicker
                    placeholder="날짜를 선택해주세요"
                    startDate={date}
                    endDate={endDate}
                    onChange={(value) => {
                      if (!value) {
                        return;
                      }

                      setValue("startDate", value[0].toISOString());

                      if (value[1]) {
                        setValue("endDate", value[1].toISOString());
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
        <Block className="mb-[2.7rem] mt-[2.625rem]">
          <Button className="w-full">저장하기</Button>
        </Block>
      </form>
      <FloatingArea>
        <BottomButton.Root>
          <BottomButton.Item icon={<EffectIcon />}>꾸미기</BottomButton.Item>
          <BottomButton.Divider />
          <BottomButton.Item icon={<PreviewIcon />}>미리보기</BottomButton.Item>
        </BottomButton.Root>
      </FloatingArea>
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
    <div className={cn("mx-auto max-w-[750px] px-8", className)} {...rest}>
      {children}
    </div>
  );
};

export default CreateEventForm;
