import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface MessageDialogProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialog> {
  title: React.ReactNode;
  description?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  confirmLabel?: React.ReactNode;
  hideCancel?: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
}

const MessageDialog = ({
  title,
  description,
  cancelLabel = "취소",
  confirmLabel = "확인",
  hideCancel,
  onClose,
  onCancel,
  onConfirm,
  ...props
}: MessageDialogProps) => {
  return (
    <AlertDialog {...props}>
      <AlertDialogContent
        onEscapeKeyDown={() => {
          onClose?.();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {!hideCancel && (
            <AlertDialogCancel onClick={onCancel ?? onClose}>
              {cancelLabel}
            </AlertDialogCancel>
          )}
          <AlertDialogAction onClick={onConfirm ?? onClose}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MessageDialog;
