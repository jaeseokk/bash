import * as React from "react";
import { cn } from "@/utils";
import TextareaAutosize from "react-textarea-autosize";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-2xl border border-input bg-[#000000] px-4 py-4 text-base text-[#FFFEFE] shadow-sm transition-colors placeholder:text-muted-foreground hover:border-[#ffffff99] focus-visible:border-[#AEFF5E] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export interface AutosizeTextareaProps
  extends React.ComponentPropsWithoutRef<typeof TextareaAutosize> {}

const AutosizeTextarea = React.forwardRef<
  HTMLTextAreaElement,
  AutosizeTextareaProps
>(({ className, ...props }, ref) => {
  return (
    <TextareaAutosize
      className={cn(
        "flex h-[3.25rem] w-full rounded-2xl border border-input bg-[#000000] px-4 py-4 text-base leading-[1.14] text-[#FFFEFE] shadow-sm transition-colors placeholder:text-muted-foreground hover:border-[#ffffff99] focus-visible:border-[#AEFF5E] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
AutosizeTextarea.displayName = "AutosizeTextarea";

export { Textarea, AutosizeTextarea };
