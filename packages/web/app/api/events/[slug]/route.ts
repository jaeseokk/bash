import { z } from "zod";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "@/server/auth";
import { getPrismaClientDbMain } from "@/server/prisma";
import { getEventBy } from "@/server/events";

const prisma = getPrismaClientDbMain();

const CreateEventInputSchema = z.object({
  slug: z.string(),
  title: z.string(),
  coverImage: z.string().url(),
  startDate: z.string().datetime(),
  endDate: z.optional(z.nullable(z.string().datetime())),
  authorName: z.optional(z.nullable(z.string())),
  location: z.optional(z.nullable(z.string())),
  description: z.optional(z.nullable(z.string())),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const slug = params.slug;

  const res = await getEventBy({
    slug,
  });

  return NextResponse.json(res, { status: 200 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const slug = params.slug;
  const input = CreateEventInputSchema.parse(await request.json());

  const session = await getServerSession();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const res = await prisma.event.update({
    where: {
      slug,
    },
    data: {
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
