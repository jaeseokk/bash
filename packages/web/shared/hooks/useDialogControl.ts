import { useRef, useState } from "react";

export interface UseDialogControlOptions {
  closeOnConfirm?: boolean;
}

export const useDialogControl = <InputData, OutputData>(
  options: UseDialogControlOptions = { closeOnConfirm: true },
) => {
  const promiseInfoRef = useRef<{
    resolve?: (value?: OutputData | undefined) => void;
    reject?: () => void;
  }>({});
  const [show, setShow] = useState(false);
  const [data, setData] = useState<InputData>();

  const open = () => {
    setShow(true);
  };

  const close = () => {
    setShow(false);
  };

  const start = (infoData?: InputData) => {
    return new Promise<OutputData | undefined>((resolve, reject) => {
      promiseInfoRef.current = {
        resolve,
        reject,
      };
      infoData && setData(infoData);
      open();
    });
  };

  const onCancel = () => {
    close();
    promiseInfoRef.current?.resolve?.();
  };

  const onConfirm = (outputData?: OutputData) => {
    if (options.closeOnConfirm) {
      close();
    }

    promiseInfoRef.current?.resolve?.(outputData);
  };

  const resetData = () => {
    setData(undefined);
  };

  return {
    show,
    open,
    close,
    start,
    data,
    setData,
    resetData,
    onCancel,
    onConfirm,
  };
};
