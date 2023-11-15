import { getMyEvents } from "@/server/events";
import Image from "next/image";
import { shimmer, toBase64 } from "@/utils";
import Link from "next/link";

interface AttendingEventsProps {}

const AttendingEvents = async ({}: AttendingEventsProps) => {
  const events = await getMyEvents();

  return (
    <div className="w-full overflow-x-auto">
      <ul className="flex items-center space-x-4 px-8">
        {events.map((event) => (
          <li key={event.id} className="h-[200px] w-[200px] flex-none">
            <Link href={`/events/${event.slug}`}>
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
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttendingEvents;
