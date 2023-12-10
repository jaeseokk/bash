const isProd = process.env.VERCEL_ENV === "production";

export const sendSlackMessageToNotificationTestChannel = async (
  to: string,
  message: string,
) => {
  await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
    },
    body: JSON.stringify({
      channel: "C0698S7CE6A",
      text: `[${to}]\n\n${message}`,
    }),
  });
};
export const sendMessage = async (to: string, message: string) => {
  await sendSlackMessageToNotificationTestChannel(to, message);
};
