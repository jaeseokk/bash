import * as React from "react";
import Sheet from "react-modal-sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface BottomSheetProps
  extends React.ComponentPropsWithoutRef<typeof Sheet> {}

const BottomSheet = ({ children, ...props }: BottomSheetProps) => {
  return (
    <Sheet snapPoints={[-50, 0.5, 0]} initialSnap={0} {...props}>
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <ScrollArea>{children}</ScrollArea>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={props.onClose} />
    </Sheet>
  );
};

export default BottomSheet;
