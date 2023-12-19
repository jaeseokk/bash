import { NextRequest, NextResponse } from "next/server";
import { getPrismaClientDbMain } from "@/server/prisma";
import { add, format, set } from "date-fns";
import { sendMessage } from "@/server/message";
import { getJosa } from "@/lib/josa";
import { utcToKst } from "@/utils";

const prisma = getPrismaClientDbMain();

const notifyBefore1Day = async (date: Date) => {
  const start = add(
    set(date, {
      seconds: 0,
      milliseconds: 0,
    }),
    {
      days: 1,
    },
  );
  const end = add(
    set(date, {
      seconds: 0,
      milliseconds: 0,
    }),
    {
      days: 1,
      minutes: 1,
    },
  );

  const events = await prisma.event.findMany({
    where: {
      startDate: {
        gte: start,
        lt: end,
      },
    },
    include: {
      attendances: {
        include: {
          user: true,
        },
      },
      author: true,
    },
  });

  const promisesForGuests = events.flatMap((event) => {
    return event.attendances.map((attendance) => {
      return sendMessage(
        attendance.user.phoneNumber,
        `[렛츠 Let's] 안녕하세요 ${attendance.user.username}님, '${
          event.title
        }'${getJosa(event.title, "이/가")} 내일 ${format(
          utcToKst(event.startDate),
          "hh:mm a",
        )}에 시작해요. 상세내용과 업데이트를 확인하세요.\n확인링크 : https://lets.fyi/events/${
          event.slug
        }`,
      );
    });
  });

  const promisesForHost = events.map((event) => {
    return sendMessage(
      event.author.phoneNumber,
      `[렛츠 Let's] 안녕하세요 ${event.author.username}님, '${
        event.title
      }'${getJosa(
        event.title,
        "이/가",
      )} 내일로 다가왔어요. 참석자를 확인하세요.\n확인링크 : https://lets.fyi/events/${
        event.slug
      }`,
    );
  });

  await Promise.all([...promisesForGuests, ...promisesForHost]);
};

const notifyBefore1Hour = async (date: Date) => {
  const start = add(
    set(date, {
      seconds: 0,
      milliseconds: 0,
    }),
    {
      hours: 1,
    },
  );
  const end = add(
    set(date, {
      seconds: 0,
      milliseconds: 0,
    }),
    {
      hours: 1,
      minutes: 1,
    },
  );

  const events = await prisma.event.findMany({
    where: {
      startDate: {
        gte: start,
        lt: end,
      },
    },
    include: {
      author: true,
    },
  });

  const promisesForHost = events.map((event) => {
    return sendMessage(
      event.author.phoneNumber,
      `[렛츠 Let's] 안녕하세요 ${event.author.username}님, '${
        event.title
      }'${getJosa(
        event.title,
        "이/가",
      )} 1시간 남았어요. 참석자를 확인하세요.\n확인링크 : https://lets.fyi/events/${
        event.slug
      }`,
    );
  });

  await Promise.all(promisesForHost);
};

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const nowDate = new Date();

  const promises = [notifyBefore1Hour(nowDate), notifyBefore1Day(nowDate)];
  await Promise.all(promises);

  return NextResponse.json(nowDate, { status: 200 });
}
