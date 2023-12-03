import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Cross2Icon } from "@radix-ui/react-icons";

export interface LayerProps
  extends React.ComponentPropsWithoutRef<typeof Sheet> {
  onClose?: () => void;
}

const Layer = ({ children, onClose, ...props }: LayerProps) => {
  return (
    <Sheet {...props}>
      <SheetContent
        side="bottom"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          onClose?.();
        }}
      >
        <ScrollArea className="mt-9 flex flex-col">
          <div className="px-9 pb-9">{children}</div>
        </ScrollArea>
        <SheetClose
          className="absolute right-9 top-[2.5rem] rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
          onClick={onClose}
        >
          <Cross2Icon className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
};

export default Layer;
