import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/utils";
import Emoji from "@/components/Emoji";

const OPTIONS = ["1f497", "1f389", "1f382", "1f973", "1f38a", "1f490"] as const;

export interface MessageEmojiRadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {}

const MessageEmojiRadioGroup = ({ ...props }: MessageEmojiRadioGroupProps) => {
  return (
    <RadioGroupPrimitive.Root {...props}>
      <div
        className={cn(
          "flex w-full justify-center space-x-[0.625rem]",
          props.disabled && "opacity-50",
        )}
      >
        {OPTIONS.map((code) => (
          <RadioGroupPrimitive.Item className="group" value={code} key={code}>
            <ItemContent>
              <Emoji code={code} />
            </ItemContent>
          </RadioGroupPrimitive.Item>
        ))}
      </div>
    </RadioGroupPrimitive.Root>
  );
};

interface ItemContentProps {
  children: React.ReactNode;
}

const ItemContent = ({ children }: ItemContentProps) => {
  return (
    <>
      <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full border border-[#343434] text-[1.375rem] transition-colors group-data-[state=checked]:border-[#AEFF5E]">
        {children}
      </div>
    </>
  );
};

export default MessageEmojiRadioGroup;
