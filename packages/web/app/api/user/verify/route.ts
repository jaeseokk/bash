import { Redis } from "@upstash/redis";
import { SolapiMessageService } from "solapi";
import { NextResponse } from "next/server";

const SMS_API_KEY = `${process.env.SOLAPI_API_KEY}`;
const SMS_SECRET_KEY = `${process.env.SOLAPI_API_SECRET}`;

const messageService = new SolapiMessageService(SMS_API_KEY, SMS_SECRET_KEY);

const redis = new Redis({
  url: `${process.env.UPSTASH_REDIS_URL}`,
  token: `${process.env.UPSTASH_REDIS_TOKEN}`,
});

export async function POST(request: Request) {
  const { phoneNumber } = await request.json();

  const code = Math.floor(100000 + Math.random() * 900000);

  // await redis.set(phoneNumber, `${code}`, {
  //   ex: 60 * 3,
  // });
  //
  // const res = await messageService.sendOne({
  //   to: phoneNumber,
  //   from: "07082331145",
  //   text: `Your verification code is ${code}`,
  // });

  return NextResponse.json("ok", { status: 200 });
}
