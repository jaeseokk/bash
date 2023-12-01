"use client";

import * as React from "react";
import { cn } from "@/utils";
import { useImperativeHandle, useRef } from "react";

export interface EventTitleInputProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "onChange"> {
  placeholder?: string;
  value: string;
  onChange?: (value: string) => void;
}

const EventTitleInput = React.forwardRef<
  { focus: () => void },
  EventTitleInputProps
>(({ className, onChange, onKeyDown, ...props }, ref) => {
  const inputRef = useRef<HTMLSpanElement>(null);
  const defaultValue = useRef(props.value);

  const handleInput = (e: React.FormEvent<HTMLSpanElement>) => {
    onChange?.(e.currentTarget.innerHTML);
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        focus: () => {
          inputRef.current?.focus();
          // move caret to end
          const textLength = inputRef.current?.textContent?.length ?? 0;
          const range = document.createRange();
          const sel = window.getSelection();

          const child = inputRef.current?.childNodes[0];

          if (!child || !sel) return;

          range.setStart(inputRef.current?.childNodes[0], textLength);
          range.collapse(true);

          sel.removeAllRanges();
          sel.addRange(range);
        },
      };
    },
    [],
  );

  return (
    <span
      className={cn(
        "flex w-full justify-center bg-transparent px-4 py-4 text-center text-[1.75rem] font-bold text-[#FFFEFE] transition-colors placeholder:text-muted-foreground before:text-muted-foreground empty:before:content-[attr(placeholder)] hover:border-[#ffffff99] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
        onKeyDown?.(e);
      }}
      onInput={handleInput}
      {...props}
      ref={inputRef}
      dangerouslySetInnerHTML={{ __html: defaultValue.current }}
    />
  );
});

EventTitleInput.displayName = "EventTitleInput";

export { EventTitleInput };
