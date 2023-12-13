import * as React from "react";
import { useState } from "react";
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
import { cn, isUndefined } from "@/lib/utils";
import { layerAtom } from "@/stores/layer";
import { useAtom } from "jotai";

export interface LayerProps
  extends React.ComponentPropsWithoutRef<typeof Sheet> {
  title?: React.ReactNode;
  hideCloseButton?: boolean;
  disableAutoFocus?: boolean;
  trigger?: React.ReactNode;
  onClose?: () => void;
  autoFocus?: boolean;
  urlStateKey?: string;
}

const Layer = ({
  children,
  title,
  hideCloseButton,
  trigger,
  onClose,
  disableAutoFocus,
  urlStateKey,
  defaultOpen,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  ...props
}: LayerProps) => {
  const isControlled = !isUndefined(openProp);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [urlState, setUrlState] = useAtom(layerAtom);
  const open = isControlled
    ? openProp
    : urlStateKey
      ? urlState === urlStateKey
      : uncontrolledOpen;

  const onOpenChange = (open: boolean) => {
    if (!isControlled) {
      if (urlStateKey) {
        setUrlState(open ? urlStateKey : undefined);
      } else {
        setUncontrolledOpen(open);
      }
    }

    setUrlState(open ? urlStateKey : undefined);
    onOpenChangeProp?.(open);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} {...props}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent
        className="flex h-full flex-col border-t-0"
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
