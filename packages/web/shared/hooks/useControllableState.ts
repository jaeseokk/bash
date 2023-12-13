import { SetStateAction, useCallback, useState } from "react";
import { isUndefined } from "@/utils";

export interface UseControllableStateProps<T> {
  value?: T;
  defaultValue?: T;
  onChangeValue?: (value: T) => void;
}

export const useControllableState = <T>({
  value: valueProp,
  defaultValue,
  onChangeValue,
}: UseControllableStateProps<T>) => {
  const [uncontrolledState, setUncontrolledState] = useState(defaultValue as T);
  const isControlled = !isUndefined(valueProp);
  const value = isControlled ? valueProp : uncontrolledState;

  const setValue = useCallback(
    (setStateAction: SetStateAction<T>) => {
      const nextValue =
        setStateAction instanceof Function
          ? setStateAction(value)
          : setStateAction;

      if (!isControlled) {
        setUncontrolledState(nextValue);
      }

      onChangeValue?.(nextValue);
    },
    [isControlled, onChangeValue, value],
  );

  return [value, setValue] as const;
};
