import { getServerSession } from "@/server/auth";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { getPrismaClientDbMain } from "@/server/prisma";

const prisma = getPrismaClientDbMain();

export async function PUT(
  request: NextRequest,
  { params: { slug } }: { params: { slug: string } },
) {
  const session = await getServerSession();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const res = await prisma.event.update({
    where: {
      slug,
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
