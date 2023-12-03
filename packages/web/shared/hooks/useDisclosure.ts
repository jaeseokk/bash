import { useCallback, useState } from "react";

export interface UseDisclosureProps {
  defaultShow?: boolean;
}

export const useDisclosure = ({
  defaultShow = false,
}: UseDisclosureProps = {}) => {
  const [show, setShow] = useState(defaultShow);

  const handleShow = useCallback(() => {
    setShow(true);
  }, []);

  const handleClose = useCallback(() => {
    setShow(false);
  }, []);

  const handleToggle = useCallback(() => {
    setShow((prev) => !prev);
  }, []);

  return {
    show,
    handleShow,
    handleClose,
    handleToggle,
    handleChange: setShow,
  };
};
