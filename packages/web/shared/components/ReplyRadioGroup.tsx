import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { PrismaDBMainConstants } from "@bash/db";
import { cn } from "@/utils";
import Emoji from "@/components/Emoji";

const OPTIONS = [
  {
    value: PrismaDBMainConstants.AttendanceStatus.ATTENDING,
    icon: <Emoji code="1f4dd" />,
    label: "갈게요!",
  },
  {
    value: PrismaDBMainConstants.AttendanceStatus.MAYBE,
    icon: <Emoji code="1f914" />,
    label: "아마도?",
  },
  {
    value: PrismaDBMainConstants.AttendanceStatus.NOT_ATTENDING,
    icon: <Emoji code="1f622" />,
    label: "어려울 듯",
  },
];

export interface ReplyRadioGroupProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
    "onClick"
  > {
  showOnlySelected?: boolean;
  onClick?: (value: string) => void;
}

const ReplyRadioGroup = ({
  showOnlySelected,
  onClick,
  ...props
}: ReplyRadioGroupProps) => {
  return (
    <RadioGroupPrimitive.Root className="flex justify-center" {...props}>
      <div
        className={cn(
          "flex w-full max-w-[20rem] justify-around",
          props.disabled && "opacity-50",
        )}
      >
        {OPTIONS.map((option) => {
          if (showOnlySelected && option.value !== props.value) {
            return null;
          }

          return (
            <RadioGroupPrimitive.Item
              key={option.value}
              className="group"
              value={option.value}
              onClick={(e) => {
                onClick?.(option.value);
              }}
            >
              <ItemContent icon={option.icon}>{option.label}</ItemContent>
            </RadioGroupPrimitive.Item>
          );
        })}
      </div>
    </RadioGroupPrimitive.Root>
  );
};

interface ItemContentProps {
  icon: React.ReactNode;
  children: React.ReactNode;
}

const ItemContent = ({ icon, children }: ItemContentProps) => {
  return (
    <>
      <div className="flex h-[5rem] w-[5rem] items-center justify-center rounded-full border border-[#343434] text-[2.5rem] transition-colors group-data-[state=checked]:border-[#AEFF5E]">
        {icon}
      </div>
      <div
        className={cn(
          "mt-2 text-base font-bold text-[#888] transition-colors group-data-[state=checked]:text-[#AEFF5E]",
        )}
      >
        {children}
      </div>
    </>
  );
};

export default ReplyRadioGroup;
