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
  title?: string;
  description?: React.ReactNode;
  showNameFieldForInitial?: boolean;
  onSubmit: (data: LoginFormData) => Promise<SignInResponse | undefined>;
  onCallback?: () => void;
}

const LoginForm = ({
  title,
  description,
  showNameFieldForInitial,
  onSubmit,
  onCallback,
}: LoginFormProps) => {
  const [step, setStep] = useState<Step>(Step.PHONE_NUMBER);

  const router = useRouter();
  const { getValues, register, setFocus, handleSubmit, formState } =
    useForm<LoginFormData>();
  const { isSubmitting } = formState;
  const nameDialogControl = useDialogControl<never, { name: string }>();
  const { openDialog } = useAlertDialog();
  const [retried, setRetried] = useState(false);

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
          <h1 className="text-3xl font-bold">{title ?? "Sign In"}</h1>
          {description && (
            <div className="mt-10 text-[1.125rem] font-bold">{description}</div>
          )}
        </div>
        <div className="space-y-2">
          {showNameFieldForInitial && (
            <Field label="이름">
              <Input
                placeholder="홍길동"
                {...register("username", { required: true })}
              />
            </Field>
          )}
          <Field
            label="전화번호"
            message={
              step === Step.PHONE_NUMBER ? (
                "전화번호는 이벤트 안내를 위해서만 활용되니 안심하세요."
              ) : step > Step.PHONE_NUMBER ? (
                <>
                  위 번호로 인증번호를 보내드렸어요.
                  <button
                    type="button"
                    disabled={retried}
                    className="text-[#AEFF5E] underline disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={async () => {
                      setRetried(true);
                      const phoneNumber = getValues("phoneNumber");
                      await handleVerify({
                        phoneNumber,
                      });
                    }}
                  >
                    재발송 요청
                  </button>
                </>
              ) : null
            }
          >
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
              label="인증번호"
              message={
                <>
                  아래 동의합니다 를 클릭하여{" "}
                  <a
                    className="underline"
                    href="https://letscompany.notion.site/63b35667626344748c1b84b5fa11ff48"
                    target="_blank"
                    rel="noreferrer"
                  >
                    이용약관·개인정보방침
                  </a>
                  을 동의하고 가입 및 오픈을 완료합니다.
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
        <div className="mt-8">
          {step < Step.VERIFYING ? (
            <Button className="w-full" type="submit" pending={isSubmitting}>
              인증하기
            </Button>
          ) : (
            <Button className="w-full" type="submit" pending={isSubmitting}>
              동의합니다.
            </Button>
          )}
        </div>
      </form>
      <NameForSignUpDialog
        open={nameDialogControl.show}
        onSubmit={nameDialogControl.onConfirm}
      />
    </>
  );
};

export default LoginForm;
