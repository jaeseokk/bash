"use client";

import * as React from "react";
import { cn } from "@/utils";
import { useImperativeHandle, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";

export interface EventTitleInputProps
  extends React.ComponentPropsWithoutRef<typeof TextareaAutosize> {}

const EventTitleInput = React.forwardRef<
  HTMLTextAreaElement,
  EventTitleInputProps
>(({ className, onKeyDown, ...props }, ref) => {
  return (
    <TextareaAutosize
      className={cn(
        "w-full resize-none bg-transparent px-4 py-4 text-center text-[1.75rem] font-bold text-[#FFFEFE] transition-colors placeholder:text-muted-foreground hover:border-[#ffffff99] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
        onKeyDown?.(e);
      }}
      {...props}
      ref={ref}
    />
  );
});

EventTitleInput.displayName = "EventTitleInput";

export { EventTitleInput };
