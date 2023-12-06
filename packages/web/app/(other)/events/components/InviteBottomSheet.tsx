import * as React from "react";
import BottomSheet2 from "@/components/BottomSheet2";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useToast } from "@/components/ui/use-toast";

export interface InviteBottomSheetProps
  extends React.ComponentPropsWithoutRef<typeof BottomSheet2> {
  url: string;
}

const InviteBottomSheet = ({ url, ...props }: InviteBottomSheetProps) => {
  const [, copyToClipboard] = useCopyToClipboard();
  const { toast } = useToast();

  const handleCopy = () => {
    copyToClipboard(url);
    toast({
      title: "링크 복사 완료",
    });
  };

  return (
    <BottomSheet2 title="초대하기" {...props}>
      <Input value={url} readOnly />
      <div className="mt-8 space-y-4">
        <div></div>
        <Button className="w-full" type="button" onClick={handleCopy}>
          링크 복사
        </Button>
      </div>
    </BottomSheet2>
  );
};

export default InviteBottomSheet;
