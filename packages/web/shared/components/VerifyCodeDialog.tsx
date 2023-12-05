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

export interface VerifyCodeDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  phoneNumber?: string;
  onSubmit: (data: { code: string }) => void;
  onClose?: () => void;
}

const VerifyCodeDialog = ({
  phoneNumber,
  children,
  onClose,
  onSubmit,
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
          <div className="w-[11rem]">
            <CodeForm onSubmit={onSubmit} />
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
}

const CodeForm = ({ phoneNumber, onSubmit }: CodeFormProps) => {
  const { register, handleSubmit } = useForm<{ code: string }>();

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="text-center">
        {phoneNumber}로 보내드린 인증번호를 입력해주세요
      </div>
      <Field>
        <NumericInput maxLength={6} {...register("code", { required: true })} />
      </Field>
      <div>
        <Button className="w-full" size="sm">
          동의합니다
        </Button>
      </div>
    </form>
  );
};

export default VerifyCodeDialog;
