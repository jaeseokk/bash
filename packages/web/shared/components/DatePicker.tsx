"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import BottomSheet from "@/components/BottomSheet";

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  viewMode?: boolean;
}

const DatePicker = ({
  value,
  onChange,
  placeholder,
  viewMode,
}: DatePickerProps) => {
  const [showCalendar, setShowCalendar] = useState(false);

  if (viewMode) {
    return <Input value={value && format(value, "PPP")} readOnly />;
  }

  return (
    <>
      <button
        className="w-full"
        type="button"
        onClick={() => {
          setShowCalendar(true);
        }}
      >
        <Input
          placeholder={placeholder}
          value={value ? format(value, "PPP") : undefined}
          readOnly
        />
      </button>
      <BottomSheet
        isOpen={showCalendar}
        onClose={() => {
          setShowCalendar(false);
        }}
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
        />
      </BottomSheet>
    </>
  );
};

export default DatePicker;
