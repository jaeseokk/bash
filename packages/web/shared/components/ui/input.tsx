import * as React from "react";
import { cn } from "@/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[3.25rem] w-full rounded-2xl border border-input bg-[#000000] px-4 py-4 text-base text-[#FFFEFE] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#fffefe66] placeholder:text-muted-foreground hover:border-[#ffffff99] focus-visible:border-[#AEFF5E] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-[#FF6262]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
