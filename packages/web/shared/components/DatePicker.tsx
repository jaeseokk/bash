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
  endDate?: Date;
  onChange?: (date: [Date] | [Date, Date] | undefined) => void;
  placeholder?: string;
}

const DatePicker = ({
  startDate,
  endDate,
  onChange,
  placeholder,
}: DatePickerProps) => {
  const [startDateState, setStartDateState] = useState<Date | undefined>(
    startDate,
  );
  const [endDateState, setEndDateState] = useState(endDate);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isRange, setIsRange] = useState(false);
  const display = useMemo(() => {
    if (startDateState && endDateState) {
      return `${format(startDateState, "PPP")} ~ ${format(
        endDateState,
        "PPP",
      )}`;
    } else if (startDateState) {
      return format(startDateState, "PPP");
    }

    return undefined;
  }, [startDateState, endDateState]);
  const [openTimeSelect, setOpenTimeSelect] = useState(false);
  const handleChangeSingleDate = (date: Date | undefined) => {
    if (!date) {
      return;
    }

    setStartDateState((prev) => {
      if (!prev) {
        return date;
      }

      return set(prev, {
        year: date.getFullYear(),
        month: date.getMonth(),
        date: date.getDate(),
      });
    });
    setEndDateState(undefined);
    setIsRange(false);
    setOpenTimeSelect(true);
  };
  const handleChangeRange = (range: DateRange | undefined, date: Date) => {
    if (!date || !startDateState) {
      return;
    }

    if (isBefore(date, startDateState)) {
      setEndDateState((prev) => {
        if (!prev) {
          return startDateState;
        }

        return set(prev, {
          year: startDateState?.getFullYear(),
          month: startDateState?.getMonth(),
          date: startDateState?.getDate(),
        });
      });
      setStartDateState((prev) => {
        if (!prev) {
          return date;
        }

        return set(prev, {
          year: date.getFullYear(),
          month: date.getMonth(),
          date: date.getDate(),
        });
      });
      return;
    }

    setEndDateState((prev) => {
      if (!prev) {
        return date;
      }

      return set(prev, {
        year: date.getFullYear(),
        month: date.getMonth(),
        date: date.getDate(),
      });
    });
    setOpenTimeSelect(true);
  };
  const calendarProps = isRange
    ? {
        mode: "range" as const,
        selected: {
          from: startDateState,
          to: endDateState,
        },
        onSelect: handleChangeRange,
      }
    : {
        mode: "single" as const,
        selected: startDateState,
        onSelect: handleChangeSingleDate,
      };
  const timeValue = useMemo(() => {
    if (isRange && endDateState) {
      return format(endDateState, "HH:mm:ss");
    } else if (!isRange && startDateState) {
      return format(startDateState, "HH:mm:ss");
    }

    return undefined;
  }, [endDateState, isRange, startDateState]);

  const handleConfirm = () => {
    if (isRange && startDateState && endDateState) {
      onChange?.([startDateState, endDateState]);
    } else if (!isRange && startDateState) {
      onChange?.([startDateState]);
    } else {
      console.error("invalid date");
      return;
    }
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
      <BottomSheet
        snapPoints={[534]}
        isOpen={showCalendar}
        onClose={() => {
          setShowCalendar(false);
        }}
      >
        <div className="pb-10">
          <div className="flex h-10 items-center justify-center">
            {startDateState && (
              <div className="flex w-[20rem] items-center justify-between">
                <div className="flex w-[45%] items-center justify-between">
                  <span className="flex-1 text-center">
                    {format(startDateState, "yyyy-MM-dd HH:mm")}
                  </span>
                  <RemoveButton
                    className="ml-4 flex-none"
                    type="button"
                    onClick={() => {
                      setStartDateState(undefined);
                      setEndDateState(undefined);
                      setIsRange(false);
                    }}
                  />
                </div>
                <div className="w-[10%] text-center">~</div>
                <div className="flex w-[45%] items-center justify-between">
                  {isRange ? (
                    <>
                      <span className="flex-1 text-center">
                        {endDateState
                          ? format(endDateState, "yyyy-MM-dd HH:mm")
                          : "-"}
                      </span>
                      <RemoveButton
                        className="ml-4 flex-none"
                        type="button"
                        onClick={() => {
                          setEndDateState(undefined);
                          setIsRange(false);
                        }}
                      />
                    </>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="no-horizontal-padding"
                      onClick={() => {
                        setIsRange(true);
                      }}
                    >
                      종료 시간 추가
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
          <Calendar
            {...calendarProps}
            initialFocus
            footer={
              <div className="mt-4">
                <Select
                  open={openTimeSelect}
                  value={timeValue}
                  onOpenChange={setOpenTimeSelect}
                  onValueChange={(value) => {
                    if (!value) {
                      return;
                    }

                    const [hour, minute, second] = value.split(":");

                    if (isRange && endDateState) {
                      setEndDateState(
                        set(endDateState, {
                          hours: Number(hour),
                          minutes: Number(minute),
                          seconds: Number(second),
                        }),
                      );
                    } else if (!isRange && startDateState) {
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
              </div>
            }
          />
          <div>
            <div className="mx-auto max-w-[750px]">
              <Button
                className="w-full"
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleConfirm}
              >
                확인
              </Button>
            </div>
          </div>
        </div>
      </BottomSheet>
    </>
  );
};

export default DatePicker;
