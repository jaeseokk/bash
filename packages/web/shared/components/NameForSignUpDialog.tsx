import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Field from "@/components/Field";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";

export interface NameForSignUpDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  onSubmit: (data: { name: string }) => void;
  onClose?: () => void;
}

const NameForSignUpDialog = ({
  children,
  onClose,
  onSubmit,
  ...props
}: NameForSignUpDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>회원 가입을 위해 이름을 입력해주세요</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center">
          <div className="w-[11rem]">
            <NameForm onSubmit={onSubmit} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface NameFormProps {
  onSubmit: (data: { name: string }) => void;
}

const NameForm = ({ onSubmit }: NameFormProps) => {
  const { register, handleSubmit } = useForm<{ name: string }>();

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="text-center">이름을 입력해주세요</div>
      <Field>
        <Input placeholder="홍길동" {...register("name", { required: true })} />
      </Field>
      <div>
        <Button className="w-full">확인</Button>
      </div>
    </form>
  );
};

export default NameForSignUpDialog;
