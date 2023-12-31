import { getPrismaClientDbMain } from "@/server/prisma";
import { getServerSession } from "@/server/auth";

const prisma = getPrismaClientDbMain();

export interface GetEventByProps {
  id?: number;
  slug?: string;
}

export const getEventBy = async ({ id, slug }: GetEventByProps) => {
  if (!id && !slug) {
    throw new Error("id or slug is required");
  }

  const session = await getServerSession();

  const event = await prisma.event.findUnique({
    where: {
      id,
      slug,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatarFallback: true,
        },
      },
      attendances: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatarFallback: true,
            },
          },
          activities: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
      activities: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatarFallback: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const isPublished = event?.publishedAt !== null;

  if (!isPublished && event?.authorId !== session?.user.id) {
    throw new Error("Event not found");
  }

  return {
    ...event,
    attendances: event?.attendances.sort((a, b) => {
      return (
        (b.activities[0]?.createdAt.getTime() ?? 0) -
        (a.activities[0]?.createdAt.getTime() ?? 0)
      );
    }),
  } as typeof event;
};

export interface publishEventProps {
  id: number;
}

export const publishEvent = ({ id }: publishEventProps) => {
  return prisma.event.update({
    where: {
      id,
    },
    data: {
      publishedAt: new Date(),
    },
  });
};

export const getMyEvents = async () => {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const events = await prisma.event.findMany({
    where: {
      OR: [
        {
          authorId: session.user.id,
        },
        {
          attendances: {
            some: {
              userId: session.user.id,
            },
          },
        },
      ],
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatarFallback: true,
        },
      },
    },
  });

  return events.sort((a, b) => {
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
};
