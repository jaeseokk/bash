import * as React from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { cn } from "@/utils";

export interface RemoveButtonProps
  extends React.ComponentPropsWithoutRef<"button"> {}

const RemoveButton = ({ className, ...props }: RemoveButtonProps) => {
  return (
    <button
      className={cn(
        "inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-600 p-[0.125rem]",
        className,
      )}
      {...props}
    >
      <Cross2Icon />
    </button>
  );
};

export default RemoveButton;
