"use client";

import * as React from "react";
import { SignInResponse, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import NumericInput from "@/components/NumericInput";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import Field from "@/components/Field";
import MessageEmojiRadioGroup from "@/components/MessageEmojiRadioGroup";
import ReplyRadioGroup from "@/components/ReplyRadioGroup";
import ButtonGroup from "@/components/ButtonGroup";
import VerifyCodeDialog from "@/components/VerifyCodeDialog";
import { useDialogControl } from "../hooks/useDialogControl";
import { PrismaDBMainConstants } from "@bash/db";

interface AttendFormData {
  status: PrismaDBMainConstants.AttendanceStatus;
  username: string;
  phoneNumber: string;
  comment?: string;
}

export interface AttendFormProps {
  onSubmit: (data: AttendFormData & { code: string }) => void;
  onCallback?: () => void;
  onCancel?: () => void;
}

const AttendForm = ({ onSubmit, onCallback, onCancel }: AttendFormProps) => {
  const session = useSession();
  const { register, control, trigger, handleSubmit } =
    useForm<AttendFormData>();
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
          const codeResult = await verificationCodeDialogControl.start({
            phoneNumber: data.phoneNumber,
          });

          if (!codeResult) {
            return;
          }

          // onSubmit({
          //   ...data,
          //   code,
          // });

          console.log({ ...data, code: codeResult.code });
        })}
      >
        <div className="mb-[3.75rem]">
          <Controller
            name="status"
            control={control}
            rules={{ required: true }}
            defaultValue={PrismaDBMainConstants.AttendanceStatus.ATTENDING}
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
                {...register("comment")}
              />
            </Field>
            <div className="mt-[1.125rem]">
              <MessageEmojiRadioGroup defaultValue={"💗"} />
            </div>
          </div>
        </div>
        <ButtonGroup className="mt-[4rem]">
          <Button variant="secondary" type="button" onClick={onCancel}>
            취소
          </Button>
          <Button>입력완료</Button>
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
