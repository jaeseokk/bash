import * as React from "react";
import { Input } from "@/components/ui/input";
import { ComponentPropsWithoutRef } from "react";

export interface EventInputProps extends ComponentPropsWithoutRef<"input"> {
  label?: string;
  viewMode?: boolean;
}

const EventInput = React.forwardRef<HTMLInputElement, EventInputProps>(
  ({ label, viewMode, ...rest }, ref) => {
    return (
      <label className="relative flex h-9 items-center">
        {label && <span className="mr-1 flex-none font-bold">{label}</span>}
        {viewMode ? (
          rest.value
        ) : (
          <Input className="flex-1" {...rest} ref={ref} />
        )}
      </label>
    );
  },
);

export default EventInput;

EventInput.displayName = "EventInput";
