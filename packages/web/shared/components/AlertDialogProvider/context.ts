import { createContext } from "@/lib/createContext";
import { MessageDialogProps } from "@/components/MessageDialog";

export interface AlertDialogContext {
  dialogs: (MessageDialogProps & { dialogId: number })[];
  createDialog: (dialog: MessageDialogProps) => number;
  removeDialog: (dialogId?: number) => void;
}

const [AlertDialogContextProvider, useAlertDialogContext] =
  createContext<AlertDialogContext>();

export { AlertDialogContextProvider, useAlertDialogContext };
