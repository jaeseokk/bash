import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { sendMessage } from "@/server/message";

const redis = new Redis({
  url: `${process.env.UPSTASH_REDIS_URL}`,
  token: `${process.env.UPSTASH_REDIS_TOKEN}`,
});

export async function POST(request: Request) {
  const { phoneNumber } = await request.json();

  const code = Math.floor(100000 + Math.random() * 900000);

  await redis.set(phoneNumber, `${code}`, {
    ex: 60 * 3,
  });

  // const res = await messageService.sendOne({
  //   to: phoneNumber,
  //   from: "07082331145",
  //   text: `Your verification code is ${code}`,
  // });
  await sendMessage(phoneNumber, `[렛츠 Let’s] 인증 번호는 [${code}]입니다.`);

  return NextResponse.json("ok", { status: 200 });
}
