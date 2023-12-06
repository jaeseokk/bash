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
      attendances: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
      activities: true,
    },
  });

  const isPublished = event?.publishedAt !== null;

  if (event?.authorId !== session?.user.id && !isPublished) {
    throw new Error("Event not found");
  }

  return event;
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
      authorId: session.user.id,
    },
  });

  return events.sort((a, b) => {
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
};
