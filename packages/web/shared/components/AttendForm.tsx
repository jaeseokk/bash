"use client";

import * as React from "react";
import { SignInResponse, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
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

interface AttendFormData {
  username: string;
  phoneNumber: string;
  code: string;
}

export interface AttendFormProps {
  onSubmit: (data: AttendFormData) => void;
  onCallback?: () => void;
}

const AttendForm = ({ onSubmit, onCallback }: AttendFormProps) => {
  const session = useSession();
  const router = useRouter();
  const { register, trigger, handleSubmit } = useForm<AttendFormData>();
  const [showCodeField, setShowCodeField] = useState(false);
  const [showNameField, setShowNameField] = useState(false);

  const handleVerify = async () => {
    const isValidPhoneNumber = await trigger("phoneNumber", {
      shouldFocus: true,
    });
    if (!isValidPhoneNumber) {
      return;
    }

    /*
     * 문자 인증 요청
     */

    setShowCodeField(true);
  };

  return (
    <>
      <form>
        <div className="mb-[3.75rem]">
          <ReplyRadioGroup />
        </div>
        <div className="space-y-[2.25rem]">
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
          <div>
            <Field label="메시지 남기기">
              <Input placeholder="너무너무 기대돼요!" />
            </Field>
            <div className="mt-[1.125rem]">
              <MessageEmojiRadioGroup />
            </div>
          </div>
        </div>
        <ButtonGroup className="mt-[4rem]">
          <Button variant="secondary" type="button" onClick={handleVerify}>
            Request Code
          </Button>
          <Button type="button">Request Code</Button>
        </ButtonGroup>
      </form>
      <VerifyCodeDialog open={true} phoneNumber={"010-0000-0000"} />
    </>
  );
};

export default AttendForm;
