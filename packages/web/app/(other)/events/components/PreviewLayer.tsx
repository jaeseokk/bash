import * as React from "react";
import Layer from "@/components/Layer";
import EventView from "./EventView";
import { EventDetail } from "@/types/events";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LetsLogo from "@/assets/lets_logo.svg";
import SignInButton from "../../../components/SignInButton";
import AppProviders from "../../../components/AppProviders";

export interface PreviewLayerProps
  extends React.ComponentPropsWithoutRef<typeof Layer> {
  eventInfo: EventDetail;
}

const PreviewLayer = ({ eventInfo, ...props }: PreviewLayerProps) => {
  return (
    <Layer {...props}>
      <div className="absolute inset-0">
        <ScrollArea className="h-full">
          <header className="w-full bg-transparent">
            <div className="container flex h-[5.25rem] items-center justify-center">
              <Link href="/">
                <LetsLogo />
              </Link>
            </div>
          </header>
          <EventView eventInfo={eventInfo} preview />
        </ScrollArea>
      </div>
    </Layer>
  );
};

export default PreviewLayer;
