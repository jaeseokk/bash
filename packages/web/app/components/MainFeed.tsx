"use client";

import * as React from "react";
import { Suspense } from "react";
import MyEvents from "./MyEvents";
import { useSession } from "next-auth/react";
import LoadingLayer from "@/components/LoadingLayer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export interface MainFeedProps {}

const MainFeed = ({}: MainFeedProps) => {
  const session = useSession();

  if (session.status === "loading") {
    return <LoadingLayer />;
  }

  if (session.status === "unauthenticated") {
    return null;
  }

  return (
    <div>
      <div className="mx-auto max-w-[750px]">
        <h2 className="mb-4 px-8 text-[2.8125rem] text-xl font-bold leading-[1.2]">
          Welcome back {session.data?.user?.name}!
        </h2>
        <Suspense fallback={<MyEventsSkeleton />}>
          <div>
            <MyEvents />
            <div className="mt-8 px-8">
              <Button variant="main" className="w-full" asChild>
                <Link href="/events/new">새 이벤트 만들기</Link>
              </Button>
            </div>
          </div>
        </Suspense>
      </div>
    </div>
  );
};

interface MyEventsSkeletonProps {}

const MyEventsSkeleton = ({}: MyEventsSkeletonProps) => {
  return (
    <div className="px-8">
      <div className="space-y-4">
        <Skeleton className="h-[1.5rem]" />
        <div className="flex space-x-4 overflow-hidden">
          <Skeleton className="h-[18.5rem] w-[15.625rem] flex-none rounded-2xl" />
          <Skeleton className="h-[18.5rem] w-[15.625rem] flex-none rounded-2xl" />
          <Skeleton className="h-[18.5rem] w-[15.625rem] flex-none rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default MainFeed;
