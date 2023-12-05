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
import NameForSignUpDialog from "@/components/NameForSignUpDialog";
import { useDialogControl } from "@/hooks/useDialogControl";
import ky from "ky";
import { flushSync } from "react-dom";
import { useAlertDialog } from "@/components/AlertDialogProvider";

interface LoginFormData {
  phoneNumber: string;
  code: string;
  username?: string;
}

enum Step {
  PHONE_NUMBER = 0,
  VERIFYING = 1,
  NAME = 2,
}

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<SignInResponse | undefined>;
  onCallback?: () => void;
}

const LoginForm = ({ onSubmit, onCallback }: LoginFormProps) => {
  const [step, setStep] = useState<Step>(Step.PHONE_NUMBER);

  const router = useRouter();
  const { register, setFocus, handleSubmit, formState } =
    useForm<LoginFormData>();
  const { isSubmitting } = formState;
  const nameDialogControl = useDialogControl<never, { name: string }>();
  const { openDialog } = useAlertDialog();

  const handleVerify = async ({ phoneNumber }: { phoneNumber: string }) => {
    await ky.post("/api/user/verify", {
      json: { phoneNumber },
    });
  };

  const signUp = async (data: LoginFormData) => {
    const res = await onSubmit(data);

    if (res?.ok) {
      if (onCallback) {
        await onCallback();
      } else {
        router.replace("/");
      }
    }
  };

  return (
    <>
      <form
        className="space-y-4"
        onSubmit={handleSubmit(async (data, e) => {
          if (step === Step.PHONE_NUMBER) {
            await handleVerify({
              phoneNumber: data.phoneNumber,
            });
            flushSync(() => {
              setStep(Step.VERIFYING);
            });
            setFocus("code");
            return;
          }

          const res = await onSubmit(data);

          console.log(res);

          if (res?.error === "invalid code") {
            openDialog({
              title: "인증번호가 일치하지 않습니다.",
              hideCancel: true,
            });
            return;
          }

          if (res?.error === "need to register") {
            const nameResult = await nameDialogControl.start();

            if (!nameResult) {
              setStep(Step.PHONE_NUMBER);

              return;
            }

            await signUp({
              ...data,
              username: nameResult.name,
            });

            return;
          }

          if (res?.ok) {
            if (onCallback) {
              await onCallback();
            } else {
              router.replace("/");
            }
          }
        })}
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
        </div>
        <div className="space-y-2">
          <Field label="전화번호">
            <NumericInput
              placeholder="010-0000-0000"
              maxLength={11}
              {...register("phoneNumber", {
                required: true,
                pattern: /^01[0-9]{9}$/,
              })}
              readOnly={step > Step.PHONE_NUMBER}
            />
          </Field>
          {step > Step.PHONE_NUMBER && (
            <Field
              label="안증번호"
              message={
                <>
                  위 번호로 인증번호를 보내드려요{" "}
                  <button type="button" className="text-[#AEFF5E] underline">
                    재발송 요청
                  </button>
                </>
              }
            >
              <NumericInput
                id="code"
                placeholder="인증번호 6자리"
                maxLength={6}
                {...register("code", {
                  required: true,
                  pattern: /^[0-9]{6}$/,
                })}
                readOnly={step > Step.VERIFYING}
              />
            </Field>
          )}
        </div>
        {step < Step.VERIFYING ? (
          <Button className="w-full" type="submit" pending={isSubmitting}>
            인증하기
          </Button>
        ) : (
          <div>
            <div className="mb-1 text-[0.825rem] text-muted-foreground">
              아래 동의합니다 를 클릭하여 <a>이용약관·개인정보방침</a>을
              동의하고 가입 및 저장을 완료합니다.
            </div>
            <Button className="w-full" type="submit" pending={isSubmitting}>
              동의합니다.
            </Button>
          </div>
        )}
      </form>
      <NameForSignUpDialog
        open={nameDialogControl.show}
        onSubmit={nameDialogControl.onConfirm}
      />
    </>
  );
};

export default LoginForm;
