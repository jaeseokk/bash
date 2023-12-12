import { messageService } from "@/server/clients";

const isProd = process.env.VERCEL_ENV === "production";

export const sendSlackMessageToNotificationTestChannel = async (
  to: string,
  message: string,
) => {
  await sendSlackMessage(to, message);
};

export const sendSlackMessage = async (header: string, message: string) => {
  await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
    },
    body: JSON.stringify({
      channel: "C0698S7CE6A",
      text: `[${header}]\n\n${message}`,
    }),
  });
};

export const sendSms = async (to: string, message: string) => {
  const res = await messageService.sendOne({
    to,
    from: "07082331145",
    text: message,
  });
};

export const sendMessage = async (to: string, message: string) => {
  if (!isProd) {
    await sendSlackMessageToNotificationTestChannel(to, message);
    return;
  }

  await sendSms(to, message);
};
