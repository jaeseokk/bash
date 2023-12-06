import { useCallback, useState } from "react";

export const useSetState = <T extends object>(initialState: T = {} as T) => {
  const [state, set] = useState<T>(initialState);
  const setState = useCallback(
    (patch: Partial<T> | ((prevState: T) => Partial<T>)) => {
      set((prevState) =>
        Object.assign(
          {},
          prevState,
          patch instanceof Function ? patch(prevState) : patch,
        ),
      );
    },
    [],
  );

  return [state, setState] as const;
};
