import { useAlertDialogContext } from "@/components/AlertDialogProvider/context";

export const useAlertDialog = () => {
  const ctx = useAlertDialogContext();

  return {
    openDialog: ctx.createDialog,
    closeDialog: ctx.removeDialog,
  };
};
