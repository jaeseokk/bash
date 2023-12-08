"use client";

import Image from "next/image";
import { formatDate, shimmer, toBase64 } from "@/utils";
import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import ky from "ky";
import { EventItem } from "@/types/events";
import ProfileAvatar from "@/components/ProfileAvatar";

interface MyEventsProps {}

const MyEvents = ({}: MyEventsProps) => {
  const { data, isLoading } = useSuspenseQuery<EventItem[]>({
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
      <div className="mt-4 w-full overflow-x-auto">
        <ul className="flex items-center space-x-4 px-8 pb-2 after:block after:h-full after:w-8 after:flex-none after:opacity-0 after:content-['.']">
          {data.map((event) => (
            <li key={event.id} className="flex-none">
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
                      blurDataURL={`data:image/svg+xml;base64,${toBase64(
                        shimmer(1, 1),
                      )}`}
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
                      />
                      <span className="ml-1">
                        Hosted by {event.author.username}
                      </span>
                    </div>
                  </div>
                  {!event.publishedAt && (
                    <div className="absolute right-0 top-0 bg-white px-2">
                      Draft
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyEvents;
