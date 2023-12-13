"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverArrow } from "@radix-ui/react-popover";
import { useControllableState } from "@/hooks/useControllableState";
import { useEffect } from "react";

export interface NudgePopoverProps
  extends React.ComponentPropsWithoutRef<typeof Popover>,
    Pick<
      React.ComponentPropsWithoutRef<typeof PopoverContent>,
      "side" | "sideOffset"
    > {
  trigger?: React.ReactNode;
}

const NudgePopover = ({
  trigger,
  children,
  side,
  sideOffset,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  ...props
}: NudgePopoverProps) => {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: false,
    onChangeValue: onOpenChangeProp,
  });

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      {trigger && (
        <PopoverTrigger
          asChild
          onClick={(e) => {
            if (!open) {
              e.preventDefault();
            }
          }}
        >
          {trigger}
        </PopoverTrigger>
      )}
      <PopoverContent
        className="z-[1] w-auto border-0 bg-[#AEFF5E] px-[0.5rem] py-[0.5rem] text-[0.875rem] font-bold text-black"
        side={side}
        sideOffset={sideOffset}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        onClick={(e) => {
          console.log("??");
          setOpen(false);
          e.stopPropagation();
        }}
      >
        <PopoverArrow className="fill-[#AEFF5E]" />
        {children}
      </PopoverContent>
    </Popover>
  );
};

export default NudgePopover;
