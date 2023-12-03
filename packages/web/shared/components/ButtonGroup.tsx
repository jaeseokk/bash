import { cn } from "@/utils";
import * as React from "react";

export interface ButtonGroupProps {
  className?: string;
  children: React.ReactNode;
}

const ButtonGroup = ({ className, children }: ButtonGroupProps) => {
  return (
    <div
      className={cn("flex justify-between space-x-2 [&>*]:flex-1", className)}
    >
      {children}
    </div>
  );
};

export default ButtonGroup;
