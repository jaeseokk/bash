import { z } from "zod";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getServerSession } from "@/server/auth";
import { getPrismaClientDbMain } from "@/server/prisma";

const CreateEventInputSchema = z.object({
  title: z.string(),
  coverImage: z.string().url(),
  startDate: z.string().datetime(),
  endDate: z.optional(z.string().datetime()),
  authorName: z.optional(z.string()),
  location: z.optional(z.string()),
  description: z.optional(z.string()),
});

export async function POST(request: NextRequest) {
  const prisma = getPrismaClientDbMain();

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
    },
  });

  return NextResponse.json(res, { status: 200 });
}
