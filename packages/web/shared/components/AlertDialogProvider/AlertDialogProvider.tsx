"use client";

import * as React from "react";
import { AlertDialogContextProvider } from "@/components/AlertDialogProvider/context";
import { useRef, useState } from "react";
import MessageDialog, { MessageDialogProps } from "@/components/MessageDialog";

export interface AlertDialogProviderProps {}

const AlertDialogProvider = ({}: AlertDialogProviderProps) => {
  const dialogKeyRef = useRef(0);
  const [dialogs, setDialogs] = useState<
    (MessageDialogProps & { dialogId: number })[]
  >([]);

  const createDialog = (dialog: MessageDialogProps) => {
    const dialogId = dialogKeyRef.current++;
    setDialogs((dialogs) => [...dialogs, { ...dialog, open: true, dialogId }]);

    return dialogId;
  };

  const removeDialog = (dialogId?: number) => {
    if (!dialogId) {
      setDialogs((dialogs) => dialogs.slice(0, dialogs.length - 1));
    }
    setDialogs((dialogs) => {
      let nextDialogs = dialogs;

      if (!dialogId) {
        nextDialogs = dialogs.slice(0, dialogs.length - 1);
      } else {
        nextDialogs = dialogs.filter((d) => d.dialogId !== dialogId);
      }

      return nextDialogs;
    });
  };

  return (
    <AlertDialogContextProvider
      value={{
        dialogs,
        createDialog,
        removeDialog,
      }}
    >
      {dialogs.map(({ dialogId, ...dialogProps }) => {
        return (
          <MessageDialog
            key={dialogId}
            onClose={() => removeDialog(dialogId)}
            {...dialogProps}
          />
        );
      })}
    </AlertDialogContextProvider>
  );
};

export default AlertDialogProvider;
