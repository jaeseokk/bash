import * as React from "react";
import { Input } from "@/components/ui/input";
import { mergeRefs } from "@/utils";
import { useRef } from "react";

interface SocialInputProps
  extends React.ComponentPropsWithoutRef<typeof Input> {}

const SocialIdInput = React.forwardRef<HTMLInputElement, SocialInputProps>(
  ({ onChange, ...rest }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const adjustInputValue = (value: HTMLInputElement["value"]) => {
      const adjustedValue = value[0] !== "@" ? `@${value}` : value;

      if (inputRef.current) {
        inputRef.current.value = adjustedValue;
      }
    };

    return (
      <Input
        inputMode="numeric"
        onFocus={(e) => {
          adjustInputValue(e.target.value);

          onChange?.(e);
        }}
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

export default SocialIdInput;

SocialIdInput.displayName = "NumericInput";
