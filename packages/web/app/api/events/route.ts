import { z } from "zod";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getServerSession } from "@/server/auth";
import { getPrismaClientDbMain } from "@/server/prisma";
import { getMyEvents } from "@/server/events";
import { sendSlackMessage } from "@/server/message";

const prisma = getPrismaClientDbMain();

export async function GET(request: NextRequest) {
  try {
    const res = await getMyEvents();

    return NextResponse.json(res, { status: 200 });
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    throw e;
  }
}

const CreateEventInputSchema = z.object({
  title: z.string(),
  coverImage: z.string().url(),
  startDate: z.string().datetime(),
  endDate: z.optional(z.string().datetime()),
  authorName: z.optional(z.string()),
  location: z.optional(z.string()),
  description: z.optional(z.string()),
  spots: z.optional(z.nullable(z.number())),
  effect: z.optional(z.string()),
});

export async function POST(request: NextRequest) {
  const input = CreateEventInputSchema.parse(await request.json());

  const session = await getServerSession();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const slug = nanoid();

  const res = await prisma.event.create({
    data: {
      slug,
      title: input.title,
      coverImage: input.coverImage,
      startDate: input.startDate,
      endDate: input.endDate,
      authorName: input.authorName,
      location: input.location,
      authorId: session.user.id,
      description: input.description,
      spots: input.spots,
      effect: input.effect,
    },
  });

  return NextResponse.json(res, { status: 200 });
}
