"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import NumericInput from "@/components/NumericInput";
import { Input } from "@/components/ui/input";
import Field from "@/components/Field";
import MessageEmojiRadioGroup from "@/components/MessageEmojiRadioGroup";
import ReplyRadioGroup from "@/components/ReplyRadioGroup";
import ButtonGroup from "@/components/ButtonGroup";
import VerifyCodeDialog from "@/components/VerifyCodeDialog";
import { useDialogControl } from "@/hooks/useDialogControl";
import { PrismaDBMainConstants } from "@bash/db";

interface AttendFormData {
  status: PrismaDBMainConstants.AttendanceStatus;
  username?: string;
  phoneNumber?: string;
  message?: string;
  emoji: string;
}

export interface AttendFormProps {
  defaultStatus?: PrismaDBMainConstants.AttendanceStatus;
  defaultEmoji?: string;
  onSubmit: (data: AttendFormData) => void;
  onSubmitWithSign: (data: AttendFormData & { code?: string }) => void;
  onVerify: (data: { phoneNumber: string }) => void;
  onCancel?: () => void;
}

const AttendForm = ({
  defaultStatus,
  defaultEmoji,
  onSubmit,
  onVerify,
  onSubmitWithSign,
  onCancel,
}: AttendFormProps) => {
  const session = useSession();
  const { register, control, formState, handleSubmit } =
    useForm<AttendFormData>({
      values: {
        status:
          defaultStatus ?? PrismaDBMainConstants.AttendanceStatus.ATTENDING,
        emoji: defaultEmoji ?? "1f497",
      },
      resetOptions: {
        keepDirtyValues: true,
      },
    });
  const { isSubmitting } = formState;
  const verificationCodeDialogControl = useDialogControl<
    {
      phoneNumber: string;
    },
    { code: string }
  >();

  return (
    <>
      <form
        onSubmit={handleSubmit(async (data) => {
          if (
            session.status === "unauthenticated" &&
            data.phoneNumber &&
            data.username
          ) {
            await onVerify({
              phoneNumber: data.phoneNumber,
            });
            const codeResult = await verificationCodeDialogControl.start({
              phoneNumber: data.phoneNumber,
            });

            if (!codeResult) {
              return;
            }

            await onSubmitWithSign({
              ...data,
              code: codeResult.code,
            });
            return;
          }

          await onSubmit({
            ...data,
          });
        })}
      >
        <div className="mb-[3.75rem]">
          <Controller
            name="status"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <ReplyRadioGroup value={value} onValueChange={onChange} />
            )}
          />
        </div>
        <div className="space-y-[2.25rem]">
          {session.status === "unauthenticated" && (
            <div className="space-y-2">
              <Field label="이름">
                <Input
                  placeholder="홍길동"
                  {...register("username", {
                    required: true,
                  })}
                />
              </Field>
              <Field label="전화번호">
                <NumericInput
                  placeholder="010-0000-0000"
                  maxLength={11}
                  {...register("phoneNumber", {
                    required: true,
                    pattern: /^01[0-9]{9}$/,
                  })}
                />
              </Field>
            </div>
          )}
          <div>
            <Field label="메시지 남기기">
              <Input
                placeholder="너무너무 기대돼요!"
                {...register("message")}
              />
            </Field>
            <div className="mt-[1.125rem]">
              <Controller
                name="emoji"
                defaultValue={"1f497"}
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <MessageEmojiRadioGroup
                      value={value}
                      onValueChange={onChange}
                    />
                  );
                }}
              />
            </div>
          </div>
        </div>
        <ButtonGroup className="mt-[4rem]">
          <Button variant="secondary" type="button" onClick={onCancel}>
            취소
          </Button>
          <Button pending={isSubmitting}>입력완료</Button>
        </ButtonGroup>
      </form>
      <VerifyCodeDialog
        open={verificationCodeDialogControl.show}
        phoneNumber={verificationCodeDialogControl.data?.phoneNumber}
        onSubmit={verificationCodeDialogControl.onConfirm}
        onClose={verificationCodeDialogControl.close}
      />
    </>
  );
};

export default AttendForm;
