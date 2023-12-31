"use client";

import * as React from "react";
import Layer, { LayerContent } from "@/components/Layer";
import Image from "next/image";
import confirmImage from "@/public/images/confirm.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useToast } from "@/components/ui/use-toast";

export interface PublishConfirmLayerProps
  extends React.ComponentPropsWithoutRef<typeof Layer> {
  url?: string;
  onMoveEventPage: () => void;
}

const PublishConfirmLayer = ({
  url,
  onMoveEventPage,
  ...props
}: PublishConfirmLayerProps) => {
  const isSupportedShareApi =
    typeof navigator !== "undefined" && "share" in navigator;
  const handleShare = async () => {
    if (!url) {
      return;
    }

    if (!isSupportedShareApi) {
      console.log("navigator.share is not supported");
      return;
    }

    await navigator.share({
      url,
    });
  };
  const [, copyToClipboard] = useCopyToClipboard();
  const { toast } = useToast();

  const handleCopy = () => {
    if (!url) {
      return;
    }

    copyToClipboard(url);
    toast({
      title: "링크 복사 완료",
    });
  };

  return (
    <Layer hideCloseButton {...props}>
      <LayerContent className="h-full overflow-auto">
        <div className="flex h-full flex-col justify-between">
          <div className="flex h-full flex-col items-center justify-center space-y-8 pb-20">
            <div>
              <Image
                src={confirmImage}
                height={164}
                width={164}
                alt=""
                placeholder="blur"
              />
            </div>
            <div className="text-center text-[1.625rem] font-bold">
              <p>이벤트가 오픈되었어요!</p>
              <p className="mt-8 text-[1.125rem]">
                사람들에게 이벤트를 <br />
                알려주고 초대하세요!
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {isSupportedShareApi ? (
              <Button
                variant="highlight"
                className="w-full"
                type="button"
                onClick={handleShare}
              >
                초대링크 공유하기
              </Button>
            ) : (
              <>
                <Input value={url} readOnly />
                <Button className="w-full" type="button" onClick={handleCopy}>
                  링크 복사
                </Button>
              </>
            )}
            <Button
              variant="outline"
              className="w-full"
              type="button"
              onClick={onMoveEventPage}
            >
              이벤트 페이지로
            </Button>
          </div>
        </div>
      </LayerContent>
    </Layer>
  );
};

export default PublishConfirmLayer;
