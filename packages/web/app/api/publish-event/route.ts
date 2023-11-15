import { getServerSession } from "@/server/auth";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { getPrismaClientDbMain } from "@/server/prisma";

const prisma = getPrismaClientDbMain();

const PublishEventInputSchema = z.object({
  id: z.number(),
});

export async function PUT(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const input = PublishEventInputSchema.parse(await request.json());

  const res = await prisma.event.update({
    where: {
      id: input.id,
    },
    data: {
      publishedAt: new Date(),
    },
  });

  if (res.authorId !== session.user.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  return NextResponse.json(res, { status: 200 });
}
