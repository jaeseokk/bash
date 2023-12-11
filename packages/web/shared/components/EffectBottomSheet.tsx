import * as React from "react";
import BottomSheet2 from "@/components/BottomSheet2";
import { cn } from "@/utils";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { STICKERS } from "@/constants/sticker";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const OPTIONS = Object.keys(STICKERS) as (keyof typeof STICKERS)[];

export interface EffectBottomSheetProps
  extends React.ComponentPropsWithoutRef<typeof BottomSheet2> {
  value?: string | null;
  onChange: (value?: string | null) => void;
  onSubmit: (value?: string | null) => void;
}

const EffectBottomSheet = ({
  value = "",
  onChange,
  onSubmit,
  ...props
}: EffectBottomSheetProps) => {
  return (
    <BottomSheet2
      title="꾸미기"
      disabledOverlay
      disableInteractOutside
      hideCloseButton
      {...props}
    >
      <div className="space-y-4">
        <RadioGroupPrimitive.Root value={value ?? ""} onValueChange={onChange}>
          <div className="absolute left-0 right-0 h-[5rem]">
            <ScrollArea>
              <div className={cn("flex space-x-[0.625rem] px-9 pb-4")}>
                <RadioGroupPrimitive.Item className="group" value={""}>
                  <div className="flex h-[4rem] w-[4rem] items-center justify-center rounded-full border border-[#343434] text-[1.375rem] transition-colors group-data-[state=checked]:border-[#AEFF5E]">
                    ❌
                  </div>
                </RadioGroupPrimitive.Item>
                {OPTIONS.map((effectId) => {
                  const src = STICKERS[effectId][0];

                  return (
                    <RadioGroupPrimitive.Item
                      className="group"
                      value={effectId}
                      key={effectId}
                    >
                      <div className="flex h-[4rem] w-[4rem] items-center justify-center overflow-hidden rounded-full border border-[#343434] text-[1.375rem] transition-colors group-data-[state=checked]:border-[#AEFF5E]">
                        <Image src={src} alt="" width={64} height={64} />
                      </div>
                    </RadioGroupPrimitive.Item>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          <div className="h-[5rem]"></div>
        </RadioGroupPrimitive.Root>
        <div>
          <Button
            className="w-full"
            type="button"
            onClick={() => {
              onSubmit(value);
            }}
          >
            선택 완료
          </Button>
        </div>
      </div>
    </BottomSheet2>
  );
};

export default EffectBottomSheet;
