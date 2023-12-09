import * as React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NumericInput from "@/components/NumericInput";
import { Button } from "@/components/ui/button";
import Field from "@/components/Field";
import { useForm } from "react-hook-form";
import { useState } from "react";

export interface VerifyCodeDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  phoneNumber?: string;
  onSubmit: (data: { code: string }) => void;
  onVerify: (data: { phoneNumber: string }) => void;
  onClose?: () => void;
}

const VerifyCodeDialog = ({
  phoneNumber,
  children,
  onClose,
  onSubmit,
  onVerify,
  ...props
}: VerifyCodeDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent
        onInteractOutside={(e) => {
          onClose?.();
        }}
        onEscapeKeyDown={(e) => {
          onClose?.();
        }}
      >
        <DialogHeader>
          <DialogTitle>전화번호를 인증해주세요</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center">
          <div className="max-w-[20rem]">
            <CodeForm
              phoneNumber={phoneNumber}
              onSubmit={onSubmit}
              onVerify={onVerify}
            />
          </div>
        </div>
        <DialogClose onClick={onClose} />
      </DialogContent>
    </Dialog>
  );
};

interface CodeFormProps {
  phoneNumber?: string;
  onSubmit: (data: { code: string }) => void;
  onVerify: (data: { phoneNumber: string }) => void;
}

const CodeForm = ({ phoneNumber, onSubmit, onVerify }: CodeFormProps) => {
  const { register, handleSubmit } = useForm<{ code: string }>();
  const [retried, setRetried] = useState(false);

  return (
    <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="text-center">
        {phoneNumber}로 보내드린 인증번호를 입력해주세요
      </div>
      <Field
        message={
          <>
            위 번호로 인증번호를 보내드려요{" "}
            <button
              type="button"
              disabled={retried}
              className="/ 60 text-[#AEFF5E] underline disabled:cursor-not-allowed disabled:opacity-50"
              onClick={async () => {
                if (!phoneNumber) {
                  return;
                }

                setRetried(true);
                await onVerify({
                  phoneNumber,
                });
              }}
            >
              재발송 요청
            </button>
          </>
        }
      >
        <NumericInput maxLength={6} {...register("code", { required: true })} />
      </Field>
      <div>
        <Button className="w-full">동의합니다</Button>
        <div className="mt-1 text-[0.825rem] text-muted-foreground">
          동의합니다 를 클릭하여{" "}
          <a
            className="underline"
            href="https://letscompany.notion.site/63b35667626344748c1b84b5fa11ff48"
            target="_blank"
            rel="noreferrer"
          >
            이용약관·개인정보방침
          </a>
          을 동의하고 입력을 완료합니다.
        </div>
      </div>
    </form>
  );
};

export default VerifyCodeDialog;
