import { getServerSession } from "@/server/auth";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { getPrismaClientDbMain } from "@/server/prisma";
import { PrismaDBMainConstants } from "@bash/db";

const prisma = getPrismaClientDbMain();

const AttendEventInputSchema = z.object({
  id: z.number(),
  status: z.nativeEnum(PrismaDBMainConstants.AttendanceStatus),
});

export async function PUT(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const input = AttendEventInputSchema.parse(await request.json());

  const res = await prisma.attendance.upsert({
    where: {
      userId_eventId: {
        userId: session.user.id,
        eventId: input.id,
      },
    },
    create: {
      userId: session.user.id,
      eventId: input.id,
      status: input.status,
    },
    update: {
      status: input.status,
    },
  });

  return NextResponse.json(res, { status: 200 });
}
