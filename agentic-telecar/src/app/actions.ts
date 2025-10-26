"use server";

import { z } from "zod";

type ShareState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const PayloadSchema = z.object({
  title: z.string().min(1).max(500),
  url: z.string().url(),
  source: z.string().min(1).max(200),
  summary: z.string().max(2000).optional(),
});

function env(name: "TELEGRAM_BOT_TOKEN" | "TELEGRAM_CHAT_ID") {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Add it to your deployment configuration.`,
    );
  }
  return value;
}

export async function shareToTelegram(
  _prevState: ShareState,
  formData: FormData,
): Promise<ShareState> {
  try {
    const payload = PayloadSchema.parse({
      title: formData.get("title"),
      url: formData.get("url"),
      source: formData.get("source"),
      summary: formData.get("summary") ?? undefined,
    });

    const token = env("TELEGRAM_BOT_TOKEN");
    const chatId = env("TELEGRAM_CHAT_ID");

    const message = `<b>${payload.title}</b>\n<u>${payload.source}</u>\n\n${payload.summary ?? ""}\n\n${payload.url}`;

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
          disable_web_page_preview: false,
        }),
      },
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Telegram API responded with an error.");
    }

    return {
      status: "success",
      message: "Delivered to Telegram",
    };
  } catch (error) {
    console.error("Failed to share to Telegram", error);
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Unexpected error occurred.",
    };
  }
}
