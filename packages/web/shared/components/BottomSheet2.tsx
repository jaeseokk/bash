import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as SheetPrimitive from "@radix-ui/react-dialog";

export interface BottomSheet2Props
  extends React.ComponentPropsWithoutRef<typeof Sheet> {
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  disabledOverlay?: boolean;
  disableInteractOutside?: boolean;
  hideCloseButton?: boolean;
  onClose?: () => void;
}

const BottomSheet2 = ({
  children,
  trigger,
  title,
  disabledOverlay,
  disableInteractOutside,
  hideCloseButton,
  onClose,
  ...props
}: BottomSheet2Props) => {
  return (
    <Sheet {...props}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent
        side="bottom"
        disableOverlay={disabledOverlay}
        onInteractOutside={(e) => {
          if (disableInteractOutside) {
            e.preventDefault();
            return;
          }
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
        {!hideCloseButton && (
          <SheetPrimitive.Close
            className="absolute right-9 top-[2.5rem] rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
            onClick={onClose}
          >
            <Cross2Icon className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default BottomSheet2;
