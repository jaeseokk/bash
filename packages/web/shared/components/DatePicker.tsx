"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { format, isBefore } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import BottomSheet from "@/components/BottomSheet";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import RemoveButton from "@/components/RemoveButton";
import { set } from "date-fns";
import BottomSheet2 from "@/components/BottomSheet2";
import { formatDate } from "@/utils";

const TIME_OPTIONS = [
  ...Array.from({ length: 24 })
    .map((_, i) => {
      const hour = i === 12 ? 12 : i % 12;
      const hourString = hour.toString().padStart(2, "0");
      const hourString24 = i.toString().padStart(2, "0");
      const ampm = i >= 12 ? "PM" : "AM";

      return [
        {
          label: `${hourString}:00 ${ampm}`,
          value: `${hourString24}:00:00`,
        },
        {
          label: `${hourString}:30 ${ampm}`,
          value: `${hourString24}:30:00`,
        },
      ];
    })
    .flat(),
];

export interface DatePickerProps {
  startDate?: Date;
  onChange?: (date: [Date] | [Date, Date] | undefined) => void;
  placeholder?: string;
}

const DatePicker = ({ startDate, onChange, placeholder }: DatePickerProps) => {
  const [startDateState, setStartDateState] = useState<Date | undefined>(
    startDate,
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [isRange, setIsRange] = useState(false);
  const display = useMemo(() => {
    if (!startDateState) {
      return undefined;
    }

    return formatDate(startDateState);
  }, [startDateState]);
  const handleChangeSingleDate = (date: Date | undefined) => {
    if (!date) {
      return;
    }

    setStartDateState((prev) => {
      if (!prev) {
        return set(date, {
          hours: 19,
          minutes: 0,
          seconds: 0,
        });
      }

      return set(prev, {
        year: date.getFullYear(),
        month: date.getMonth(),
        date: date.getDate(),
      });
    });
    setIsRange(false);
  };
  const calendarProps = {
    mode: "single" as const,
    selected: startDateState,
    onSelect: handleChangeSingleDate,
  };
  const timeValue = useMemo(() => {
    if (!startDateState) {
      return undefined;
    }

    return format(startDateState, "HH:mm:ss");
  }, [startDateState]);

  const handleConfirm = () => {
    if (!startDateState) {
      return;
    }

    onChange?.([startDateState]);
    setShowCalendar(false);
  };

  return (
    <>
      <button
        className="w-full"
        type="button"
        onClick={() => {
          setShowCalendar(true);
        }}
      >
        <Input placeholder={placeholder} value={display} readOnly />
      </button>
      <BottomSheet2
        title="날짜 선택"
        open={showCalendar}
        onClose={() => {
          setShowCalendar(false);
        }}
      >
        <div>
          <div className="flex h-10 items-center justify-center">
            {startDateState ? (
              <div className="flex items-center justify-center">
                <div className="flex items-center justify-between">
                  <span className="flex-1 text-center">
                    {formatDate(startDateState)}
                  </span>
                  <RemoveButton
                    className="ml-4 flex-none"
                    type="button"
                    onClick={() => {
                      setStartDateState(undefined);
                    }}
                  />
                </div>
              </div>
            ) : (
              "-"
            )}
          </div>
          <Calendar
            {...calendarProps}
            initialFocus
            footer={
              <div className="mt-4 h-9">
                {startDateState && (
                  <Select
                    defaultValue={"19:00:00"}
                    value={timeValue}
                    onValueChange={(value) => {
                      if (!value) {
                        return;
                      }

                      const [hour, minute, second] = value.split(":");

                      if (startDateState) {
                        setStartDateState(
                          set(startDateState, {
                            hours: Number(hour),
                            minutes: Number(minute),
                            seconds: Number(second),
                          }),
                        );
                      }
                    }}
                  >
                    <SelectTrigger id="framework">
                      <SelectValue placeholder="시간을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {TIME_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            }
          />
          <div className="mt-4">
            <div className="mx-auto max-w-[750px]">
              <Button className="w-full" type="button" onClick={handleConfirm}>
                확인
              </Button>
            </div>
          </div>
        </div>
      </BottomSheet2>
    </>
  );
};

export default DatePicker;
