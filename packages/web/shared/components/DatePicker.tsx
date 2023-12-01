"use client";

import * as React from "react";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import BottomSheet from "@/components/BottomSheet";

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
}

const DatePicker = ({ value, onChange, placeholder }: DatePickerProps) => {
  const [showCalendar, setShowCalendar] = useState(false);

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
