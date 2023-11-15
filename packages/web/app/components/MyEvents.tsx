import { getMyEvents } from "@/server/events";
import Image from "next/image";
import { shimmer, toBase64 } from "@/utils";
import Link from "next/link";

interface MyEventsProps {}

const MyEvents = async ({}: MyEventsProps) => {
  const events = await getMyEvents();

  return (
    <div className="w-full overflow-x-auto">
      <ul className="flex items-center space-x-4 px-8">
        {events.map((event) => (
          <li key={event.id} className="h-[200px] w-[200px] flex-none">
            <Link href={`/events/${event.slug}`}>
              <div className="relative">
                <Image
                  src={event.coverImage ?? "https://picsum.photos/300/200"}
                  width="200"
                  height="200"
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(
                    shimmer(1, 1),
                  )}`}
                  sizes="100vw"
                  alt={event.title}
                />
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
  );
};

export default MyEvents;
