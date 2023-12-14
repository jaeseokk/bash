import { getServerSession } from "@/server/auth";
import { NextResponse } from "next/server";
import { getPrismaClientDbMain } from "@/server/prisma";
import { z } from "zod";

const prisma = getPrismaClientDbMain();

export async function GET(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      username: true,
      twitter: true,
      instagram: true,
      description: true,
      avatarFallback: true,
    },
  });

  return NextResponse.json(user, { status: 200 });
}

const UpdateUserInputSchema = z.object({
  twitter: z.optional(z.nullable(z.string())),
  instagram: z.optional(z.nullable(z.string())),
  description: z.optional(z.nullable(z.string())),
});

export async function PUT(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const input = UpdateUserInputSchema.parse(await request.json());

  const user = await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: input,
    select: {
      id: true,
      username: true,
      twitter: true,
      instagram: true,
      description: true,
    },
  });

  return NextResponse.json(user, { status: 200 });
}
