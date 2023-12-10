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
import Layer, { LayerContentWithScrollArea } from "@/components/Layer";
import EffectBottomSheet from "@/components/EffectBottomSheet";
import StickerContainer from "@/components/StickerContainer";
import { STICKERS } from "@/constants/sticker";
import { ScrollArea } from "@/components/ui/scroll-area";

const COVER_IMAGE_LIST = [
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/01_mood.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/02_mood.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/03_mood.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/04_mood.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/05_mood.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/06_mood.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/07.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/08.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/09_music.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/10_music.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/11_mood.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/12_mood.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/13_mood.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/14_mood.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/15_mood.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/16_mood.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/17_mood.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/18_yearend.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/19_birthday.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/20_birthday.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/21_yearend.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/22_yearend.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/23_yearend.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/24_yearend.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/25_yearend.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/26_yearend.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/27_yearend.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/28_yearend.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/29_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/30_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/31_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/32_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/33_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/34_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/35_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/36_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/37_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/38_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/39_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/40_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/41_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/42_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/43_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/44_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/45_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/46_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/47_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/48_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/49_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/50_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/51_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/52_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/53_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/54_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/55_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/56.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/57_yearand.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/58.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/59.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/60_birthday.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/61_birthday.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/62.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/63.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/64_christmas.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/65_yearend.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/66_yearend.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/67_yearend.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/68_yearend.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/69_birthday.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/70_yearend.png",
  "https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/cover-images/71.png",
];

interface CreateEventFormData {
  title: string;
  coverImage: string;
  startDate: Date;
  endDate: Date | null;
  authorName: string | null;
  location: string | null;
  description: string | null;
  effect: string | null;
}

export interface CreateEventFormProps {
  slug?: string;
  initialData?: CreateEventFormData;
  onSubmit: (data: CreateEventFormData) => Promise<void>;
}

const CreateEventForm = ({
  slug,
  initialData,
  onSubmit,
}: CreateEventFormProps) => {
  const session = useSession();
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
  const effectWatch = watch("effect") as keyof typeof STICKERS | null;
  const [showCoverImageBottomSheet, setShowCoverImageBottomSheet] =
    useState(false);
  const [showLoginBottomSheet, setShowLoginBottomSheet] = useState(false);
  const [cachedFormData, setCachedFormData] = useState<CreateEventFormData>();
  const [showEffectSheet, setShowEffectSheet] = useState(false);
  const [selectingEffect, setSelectingEffect] = useState<string | null>();
  const effect = (selectingEffect ?? effectWatch) as
    | keyof typeof STICKERS
    | null;
  const submit = async (data: CreateEventFormData) => {
    await onSubmit(data);
  };

  return (
    <>
      <EventBackground coverImage={coverImage} />
      {effect && <StickerContainer effect={effect} eventKey={slug} />}
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
            <Controller
              name="effect"
              control={control}
              render={({ field: { onChange } }) => {
                return (
                  <EffectBottomSheet
                    open={showEffectSheet}
                    onOpenChange={(open) => {
                      setShowEffectSheet(open);

                      if (!open) {
                        setSelectingEffect(undefined);
                      }
                    }}
                    value={effect}
                    onChange={setSelectingEffect}
                    onSubmit={(value) => {
                      onChange(value);
                      setShowEffectSheet(false);
                    }}
                    trigger={
                      <BottomButton.Item icon={<EffectIcon />}>
                        꾸미기
                      </BottomButton.Item>
                    }
                  />
                );
              }}
            />

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
      <Layer
        open={showCoverImageBottomSheet}
        onClose={() => {
          setShowCoverImageBottomSheet(false);
        }}
      >
        <ScrollArea className="h-full">
          <div className="px-[1.5rem] pb-9">
            <div className="grid grid-cols-2 gap-4 pb-4 pt-20 md:grid-cols-3">
              {COVER_IMAGE_LIST.map((url) => (
                <div
                  key={url}
                  className="overflow-hidden rounded-2xl border border-[#343434]"
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
          </div>
        </ScrollArea>
      </Layer>
      <Layer
        open={showLoginBottomSheet}
        onClose={() => {
          setShowLoginBottomSheet(false);
        }}
      >
        <LayerContentWithScrollArea>
          <div className="pt-20">
            <LoginForm
              title="저장 및 가입"
              description={
                <>
                  <p>저장 전에 전화번호를 인증해주세요</p>
                  <p className="text-[0.875rem] text-[#ffffff99]">
                    참가자가 생일 때마다 문자메시지로 알려드릴게요
                  </p>
                </>
              }
              showNameFieldForInitial
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
        </LayerContentWithScrollArea>
      </Layer>
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
