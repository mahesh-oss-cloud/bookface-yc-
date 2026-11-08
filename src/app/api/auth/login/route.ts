import { createHmac, pbkdf2Sync, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SESSION_COOKIE = "bookface_session";
const SESSION_SECONDS = 60 * 60 * 12;

function verifyPassword(password: string, storedHash: string): boolean {
  const [algorithm, iterationsText, saltHex, hashHex, extra] = storedHash.split("$");
  if (algorithm !== "pbkdf2" || extra || !iterationsText || !saltHex || !hashHex) {
    return false;
  }

  const iterations = Number(iterationsText);
  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");

  if (
    !Number.isInteger(iterations) ||
    iterations < 100000 ||
    iterations > 1000000 ||
    salt.length !== 16 ||
    expected.length !== 64
  ) {
    return false;
  }

  const actual = pbkdf2Sync(password, salt, iterations, expected.length, "sha512");
  return timingSafeEqual(actual, expected);
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const requestOrigin = new URL(request.url).origin;

  if (origin && origin !== requestOrigin) {
    return NextResponse.json({ error: "Request not allowed." }, { status: 403 });
  }

  const allowedEmail = process.env.BOOKFACE_LOGIN_EMAIL?.trim().toLowerCase();
  const storedHash = process.env.BOOKFACE_LOGIN_PASSWORD_HASH;
  const sessionSecret = process.env.BOOKFACE_SESSION_SECRET;

  if (!allowedEmail || !storedHash || !sessionSecret) {
    return NextResponse.json(
      { error: "Sign-in is not configured. Contact the administrator." },
      { status: 503 }
    );
  }

  let body: { email?: unknown; password?: unknown };
  try {
    body = (await request.json()) as { email?: unknown; password?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  const emailMatches = email.length > 0 && email === allowedEmail;
  const passwordMatches =
    password.length > 0 &&
    password.length <= 1024 &&
    verifyPassword(password, storedHash);

  if (!emailMatches || !passwordMatches) {
    return NextResponse.json(
      { error: "We couldn't sign in with those details. Check them and try again." },
      { status: 401 }
    );
  }

  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = Buffer.from(
    JSON.stringify({ email: allowedEmail, exp: expiresAt })
  ).toString("base64url");
  const signature = createHmac("sha256", sessionSecret)
    .update(payload)
    .digest("base64url");

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: payload + "." + signature,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });

  return response;
}
