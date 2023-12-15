import { getServerSession } from "@/server/auth";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { getPrismaClientDbMain } from "@/server/prisma";
import { PrismaDBMainConstants } from "@bash/db";
import { sendMessage } from "@/server/message";

const prisma = getPrismaClientDbMain();

const AttendEventInputSchema = z.object({
  id: z.number(),
  status: z.nativeEnum(PrismaDBMainConstants.AttendanceStatus),
  message: z.optional(z.string()),
  emoji: z.string(),
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
      activities: {
        create: {
          userId: session.user.id,
          eventId: input.id,
          message: input.message,
          emoji: input.emoji,
          status: input.status,
        },
      },
    },
    update: {
      status: input.status,
      activities: {
        create: {
          userId: session.user.id,
          eventId: input.id,
          message: input.message,
          emoji: input.emoji,
          status: input.status,
        },
      },
    },
    select: {
      event: {
        select: {
          slug: true,
          title: true,
          author: {
            select: {
              id: true,
              username: true,
              phoneNumber: true,
            },
          },
          activities: {
            where: {
              status: "ATTENDING",
            },
          },
        },
      },
    },
  });

  if (input.status === "ATTENDING" && session.user.phoneNumber) {
    await sendMessage(
      session.user.phoneNumber,
      `[렛츠 Let’s] 축하합니다! '${res.event.title}'에 가게 되었어요. 자세한 내용과 업데이트를 확인하세요.\n확인링크 : https://lets.fyi/events/${res.event.slug}`,
    );
  }

  const isFirstAttendance =
    res.event.activities.filter(
      (activity) => activity.userId !== res.event.author.id,
    ).length === 1 &&
    input.status === "ATTENDING" &&
    session.user.id !== res.event.author.id;

  if (isFirstAttendance) {
    await sendMessage(
      res.event.author.phoneNumber,
      `[렛츠 Let’s] 축하합니다 ${res.event.author.username}님! '${res.event.title}'에 첫 번째 참석자가 응답했어요.\n확인링크 : https://lets.fyi/events/${res.event.slug}`,
    );
  }

  return NextResponse.json(res, { status: 200 });
}
