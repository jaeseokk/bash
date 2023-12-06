import { useCallback, useEffect, useRef, useState } from "react";

export const useLoading = () => {
  const [loading, setLoading] = useState(false);

  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const startLoading = useCallback(
    async <T>(promiseFn: () => Promise<T> | void): Promise<T> => {
      setLoading(true);

      let data;
      try {
        data = await promiseFn();
      } catch (e) {
        throw e;
      } finally {
        /**
         * Can't perform a React state update on an unmounted component error 방지
         * unmount시 state가 update되는걸 막기위한 코드
         */
        if (isMountedRef.current) {
          setLoading(false);
        }
      }

      return data as T;
    },
    [],
  );

  return [loading, startLoading] as [boolean, typeof startLoading];
};
