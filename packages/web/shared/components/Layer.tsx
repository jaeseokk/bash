import * as React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface LayerProps
  extends React.ComponentPropsWithoutRef<typeof Sheet> {
  title?: React.ReactNode;
  hideCloseButton?: boolean;
  disableAutoFocus?: boolean;
  trigger?: React.ReactNode;
  onClose?: () => void;
  autoFocus?: boolean;
}

const Layer = ({
  children,
  title,
  hideCloseButton,
  trigger,
  onClose,
  disableAutoFocus,
  ...props
}: LayerProps) => {
  return (
    <Sheet {...props}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent
        className="flex h-full flex-col"
        side="bottom"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          onClose?.();
        }}
      >
        {title && (
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
        )}
        <div className="flex-1 overflow-hidden">{children}</div>
        {!hideCloseButton && (
          <SheetClose
            className="absolute right-9 top-[2.5rem] rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
            onClick={onClose}
          >
            <Cross2Icon className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </SheetClose>
        )}
      </SheetContent>
    </Sheet>
  );
};

interface LayerContentProps {
  className?: string;
  children?: React.ReactNode;
}

export const LayerContent = ({ className, children }: LayerContentProps) => {
  return <div className={cn("px-9 pb-9", className)}>{children}</div>;
};

interface LayerContentWithScrollAreaProps {
  children?: React.ReactNode;
}

export const LayerContentWithScrollArea = ({
  children,
}: LayerContentWithScrollAreaProps) => {
  return (
    <ScrollArea className="h-full">
      <div className="px-9 pb-9">{children}</div>
    </ScrollArea>
  );
};

export default Layer;
