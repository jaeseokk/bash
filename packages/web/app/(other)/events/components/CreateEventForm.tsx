"use client";

import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import DatePicker from "@/components/DatePicker";
import { AutosizeTextarea, Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn, shimmer, toBase64 } from "@/utils";
import { Controller, useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
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
import PeopleIcon from "@/assets/people_gradient.svg";
import SmileIcon from "@/assets/smile_gradient.svg";
import FloatingArea from "@/components/FloatingArea";
import PreviewLayer from "./PreviewLayer";
import EventBackground from "@/components/EventBackground";
import Layer, { LayerContentWithScrollArea } from "@/components/Layer";
import EffectBottomSheet from "@/components/EffectBottomSheet";
import StickerContainer from "@/components/StickerContainer";
import { STICKERS } from "@/constants/sticker";
import { ScrollArea } from "@/components/ui/scroll-area";
import NumericInput from "@/components/NumericInput";
import ReplyRadioGroup from "@/components/ReplyRadioGroup";
import * as process from "process";

const baseUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_ID}.supabase.co`;

const COVER_IMAGE_LIST = [
  `${baseUrl}/storage/v1/object/public/cover-images/cover1.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover2.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover3.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover4.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover5.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover6.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover7.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover8.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover9.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover10.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover11.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover12.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover13.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover14.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover15.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover16.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover17.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover18.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover19.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover20.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover21.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover22.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover23.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover24.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover25.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover26.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover27.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover28.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover29.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover30.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover31.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover32.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover33.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover34.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover35.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover36.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover37.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover38.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover39.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover40.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover41.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover42.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover43.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover44.png`,
  `${baseUrl}/storage/v1/object/public/cover-images/cover45.png`,
];

interface CreateEventFormData {
  title: string;
  coverImage: string;
  startDate: Date;
  endDate: Date | null;
  authorName: string | null;
  location: string | null;
  spots: number | null;
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
        <Block className="mb-[3rem]">
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
                blurDataURL={`/_next/image?url=${encodeURIComponent(
                  coverImage,
                )}&w=16&q=1`}
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
        <Block className="mb-6 space-y-2.5">
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
          <Field labelIcon={<PeopleIcon />} label="인원수">
            <NumericInput
              placeholder="무제한"
              {...register("spots", {
                setValueAs: (value) => {
                  if (value === "") {
                    return undefined;
                  }

                  return Number(value);
                },
              })}
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
        <Block className="mb-[1.75rem] mt-8">
          <Field
            labelIcon={<SmileIcon />}
            label="참석자 응답"
            topMessage="게스트가 이 중에 답변을 고를 수 있어요!"
          >
            <div className="rounded-xl border border-input px-2 py-8">
              <ReplyRadioGroup disabled={true} />
            </div>
          </Field>
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
                    onOpenChange={setShowEffectSheet}
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
          <Button
            className="w-full rounded-none"
            variant="highlight"
            pending={isSubmitting}
          >
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
                    blurDataURL={`/_next/image?url=${encodeURIComponent(
                      url,
                    )}&w=16&q=1`}
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
              title="초대장 오픈"
              description={
                <>
                  <p>오픈을 위해 전화번호를 인증해주세요</p>
                  <p className="text-[0.875rem] text-[#AEFF5E]">
                    참가자가 생길 때마다 문자메시지로 알려드려요
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
