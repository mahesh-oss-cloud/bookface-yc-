import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getBookfaceAccount } from "@/lib/accounts";

const SESSION_COOKIE = "bookface_session";

export type BookfaceSession = {
  email: string;
  expiresAt: number;
};

type SessionPayload = {
  email?: unknown;
  exp?: unknown;
};

export async function getBookfaceSession(): Promise<BookfaceSession | null> {
  const sessionSecret = process.env.BOOKFACE_SESSION_SECRET;
  if (!sessionSecret) return null;

  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(SESSION_COOKIE)?.value;
  if (!cookieValue) return null;

  const separator = cookieValue.lastIndexOf(".");
  if (separator <= 0) return null;

  const payload = cookieValue.slice(0, separator);
  const suppliedSignature = Buffer.from(cookieValue.slice(separator + 1), "base64url");
  const expectedSignature = createHmac("sha256", sessionSecret)
    .update(payload)
    .digest();

  if (
    suppliedSignature.length !== expectedSignature.length ||
    !timingSafeEqual(suppliedSignature, expectedSignature)
  ) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionPayload;
    const expiresAt = typeof decoded.exp === "number" ? decoded.exp : 0;
    const email = typeof decoded.email === "string" ? decoded.email.trim().toLowerCase() : "";

    if (
      !email ||
      !getBookfaceAccount(email) ||
      !Number.isInteger(expiresAt) ||
      expiresAt <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return { email, expiresAt };
  } catch {
    return null;
  }
}
