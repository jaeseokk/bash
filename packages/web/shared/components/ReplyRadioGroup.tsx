import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { PrismaDBMainConstants } from "@bash/db";
import { cn } from "@/utils";

export interface ReplyRadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {}

const ReplyRadioGroup = ({ ...props }: ReplyRadioGroupProps) => {
  return (
    <RadioGroupPrimitive.Root {...props}>
      <div
        className={cn(
          "flex w-full justify-center space-x-[1.625rem]",
          props.disabled && "opacity-50",
        )}
      >
        <RadioGroupPrimitive.Item
          className="group"
          value={PrismaDBMainConstants.AttendanceStatus.ATTENDING}
        >
          <ItemContent icon={"👍"}>갈게요!</ItemContent>
        </RadioGroupPrimitive.Item>
        <RadioGroupPrimitive.Item
          className="group"
          value={PrismaDBMainConstants.AttendanceStatus.MAYBE}
        >
          <ItemContent icon={"🤔"}>아마도?</ItemContent>
        </RadioGroupPrimitive.Item>
        <RadioGroupPrimitive.Item
          className="group"
          value={PrismaDBMainConstants.AttendanceStatus.NOT_ATTENDING}
        >
          <ItemContent icon={"😢"}>어려울 듯</ItemContent>
        </RadioGroupPrimitive.Item>
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
