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

export interface VerifyCodeDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  phoneNumber: string;
  onClose?: () => void;
}

const VerifyCodeDialog = ({
  phoneNumber,
  children,
  onClose,
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
        <div>
          <div>{phoneNumber}로 보내드린 인증번호를 입력해주세요</div>
          <div>
            <NumericInput maxLength={6} />
          </div>
          <div>
            <Button>동의합니다</Button>
          </div>
        </div>
        <DialogClose onClick={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default VerifyCodeDialog;
