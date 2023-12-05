import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
} from "@/components/ui/sheet";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as SheetPrimitive from "@radix-ui/react-dialog";

export interface BottomSheet2Props
  extends React.ComponentPropsWithoutRef<typeof Sheet> {
  title?: React.ReactNode;
  onClose?: () => void;
}

const BottomSheet2 = ({
  children,
  title,
  onClose,
  ...props
}: BottomSheet2Props) => {
  return (
    <Sheet {...props}>
      <SheetContent
        side="bottom"
        onInteractOutside={(e) => {
          onClose?.();
        }}
        onEscapeKeyDown={(e) => {
          onClose?.();
        }}
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="mt-9 flex flex-col">
          <div className="px-9 pb-9">{children}</div>
        </ScrollArea>
        <SheetPrimitive.Close
          className="absolute right-9 top-[2.5rem] rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
          onClick={onClose}
        >
          <Cross2Icon className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetContent>
    </Sheet>
  );
};

export default BottomSheet2;
