import { cn } from "@/lib/utils";
import * as React from "react";

interface FloatingAreaProps {
  className?: string;
  children: React.ReactNode;
  disabledFloating?: boolean;
}

const FloatingArea = ({
  className,
  disabledFloating,
  children,
}: FloatingAreaProps) => {
  return (
    <div
      className={cn(
        !disabledFloating && "sticky",
        "bottom-[-1px] left-0 right-0 z-20",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default FloatingArea;
