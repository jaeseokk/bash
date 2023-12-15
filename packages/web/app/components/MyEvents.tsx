"use client";

import Image from "next/image";
import { formatDate, shimmer, toBase64 } from "@/utils";
import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import ky from "ky";
import { EventItem } from "@/types/events";
import ProfileAvatar from "@/components/ProfileAvatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import CrownIcon from "@/assets/crown_gradient.svg";
import { useSession } from "next-auth/react";

interface MyEventsProps {}

const MyEvents = ({}: MyEventsProps) => {
  const session = useSession();
  const { data } = useSuspenseQuery<EventItem[]>({
    queryKey: ["events"],
    queryFn: () => {
      return ky.get("/api/events").json();
    },
  });

  return (
    <div>
      <div className="px-8">
        <strong>{data.length}개</strong>의 이벤트가 있습니다.
      </div>
      <ScrollArea
        className="mt-4 w-full"
        viewportClassName="snap-x snap-mandatory scroll-pl-8"
      >
        <ul className="flex items-center space-x-4 px-8 pb-4 after:block after:h-full after:w-0 after:flex-none after:content-['']">
          {data.map((event) => (
            <li key={event.id} className="flex-none snap-start">
              <Link href={`/events/${event.slug}`}>
                <div className="relative w-[15.625rem] overflow-hidden rounded-2xl">
                  <div className="relative h-[11.25rem]">
                    <Image
                      src={event.coverImage ?? "https://picsum.photos/300/200"}
                      width="200"
                      height="200"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                      placeholder="blur"
                      blurDataURL={`/_next/image?url=${event.coverImage}&w=16&q=1`}
                      sizes="100vw"
                      alt={event.title}
                    />
                  </div>
                  <div className="flex h-[7.25rem] flex-col justify-between bg-white px-4 py-[1.25rem] text-[#030303]">
                    <div>
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[1.125rem] font-bold">
                        {event.title}
                      </div>
                      <div className="text-[0.75rem] text-[#03030399]">
                        {formatDate(event.startDate)}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <ProfileAvatar
                        size="1.5rem"
                        white
                        name={event.author.username}
                        avatarFallback={event.author.avatarFallback}
                      />
                      <span className="ml-1">
                        Hosted by {event.author.username}
                      </span>
                    </div>
                  </div>
                  {session.data?.user.id === event.authorId && (
                    <div className="pointer-events-none absolute left-4 top-4 flex h-[1.75rem] w-[1.75rem] items-center justify-center rounded-full bg-black/70 [&_svg]:w-4">
                      <CrownIcon />
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default MyEvents;
