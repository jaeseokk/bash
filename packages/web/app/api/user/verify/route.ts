import { Redis } from "@upstash/redis";
import { PrismaClientDbMain } from "@bash/db";

const SMS_API_ENDPOINT = "https://api-sms.cloud.toast.com";
const SMS_APP_KEY = "IUkkigV5kNz62Gfs";
const SMS_SECRET_KEY = "VOEnrLXa6rbms7FmO1EjohiTxknXcMd9";

const redis = new Redis({
  url: "https://apn1-engaged-basilisk-34307.upstash.io",
  token: "deac63aeb0b6436f9fe7a064bfc17d3d",
});

const prisma = new PrismaClientDbMain();

export async function POST(request: Request) {
  const { phoneNumber } = await request.json();

  const code = Math.floor(100000 + Math.random() * 900000);
  // await redis.set(phoneNumber, code, {
  //   ex: 60 * 3,
  // });

  const result = await prisma.user.findMany();

  console.log(result);

  const response = await fetch(
    `${SMS_API_ENDPOINT}/sms/v3.0/appKeys/${SMS_APP_KEY}/sender/sms`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "X-Secret-Key": SMS_SECRET_KEY,
      },
      body: JSON.stringify({
        body: `Your verification code is ${code}`,
        sendNo: "01050553249",
        recipientList: [
          {
            recipientNo: phoneNumber,
          },
        ],
      }),
    },
  );

  console.log(response);

  return new Response(phoneNumber);
}
