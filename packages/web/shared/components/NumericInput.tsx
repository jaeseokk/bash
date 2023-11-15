import * as React from "react";
import { Input } from "@/components/ui/input";
import { mergeRefs } from "@/utils";
import { useRef } from "react";

interface NumericInputProps
  extends React.ComponentPropsWithoutRef<typeof Input> {}

const NumericInput = React.forwardRef<HTMLInputElement, NumericInputProps>(
  ({ onChange, ...rest }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const adjustInputValue = (value: HTMLInputElement["value"]) => {
      const matches = value.match(/(\d+)/);
      const adjustedValue = matches?.[0] || "";

      if (inputRef.current) {
        inputRef.current.value = adjustedValue;
      }
    };

    return (
      <Input
        inputMode="numeric"
        onChange={(e) => {
          adjustInputValue(e.target.value);

          onChange?.(e);
        }}
        onBlur={(e) => {
          adjustInputValue(e.target.value);

          onChange?.(e);
        }}
        {...rest}
        ref={mergeRefs(ref, inputRef)}
      />
    );
  },
);

export default NumericInput;

NumericInput.displayName = "NumericInput";
