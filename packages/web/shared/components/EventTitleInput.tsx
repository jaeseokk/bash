"use client";

import * as React from "react";
import { cn, mergeRefs } from "@/utils";
import { useCallback, useEffect, useRef, useState } from "react";

export interface EventTitleInputProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
  maxHeight: number;
}

const EventTitleInput = React.forwardRef<HTMLSpanElement, EventTitleInputProps>(
  ({ className, onKeyDown, ...props }, ref) => {
    return (
      <span
        className={cn(
          "flex w-full justify-center bg-transparent px-4 py-4 text-center text-[1.75rem] font-bold text-[#FFFEFE] transition-colors placeholder:text-muted-foreground before:text-muted-foreground empty:before:content-[attr(placeholder)] hover:border-[#ffffff99] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        contentEditable
        role="textbox"
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
  },
);

EventTitleInput.displayName = "EventTitleInput";

export { EventTitleInput };
