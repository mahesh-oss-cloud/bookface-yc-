import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getBookfaceAccount } from "@/lib/accounts";

const SESSION_COOKIE = "bookface_session";
const SIGN_IN_PATH = "/signin";

const PUBLIC_ASSET_PATHS = new Set([
  "/favicon.ico",
  "/manifest.webmanifest",
  "/icon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-icon",
  "/apple-icon.png",
  "/yc-logo.svg",
  "/blackbird.png",
  "/sw.js",
]);

function isValidSession(token: string | undefined): boolean {
  const secret = process.env.BOOKFACE_SESSION_SECRET;
  if (!token || !secret) return false;

  const [encodedPayload, encodedSignature, extra] = token.split(".");
  if (!encodedPayload || !encodedSignature || extra) return false;

  try {
    const expected = createHmac("sha256", secret).update(encodedPayload).digest();
    const received = Buffer.from(encodedSignature, "base64url");
    if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
      return false;
    }

    const session = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as { email?: string; exp?: number };

    const email = typeof session.email === "string" ? session.email.trim().toLowerCase() : "";
    return (
      Boolean(email) &&
      getBookfaceAccount(email) !== null &&
      typeof session.exp === "number" &&
      session.exp > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (PUBLIC_ASSET_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  if (pathname === "/api/auth/login" || pathname === "/api/auth/logout") {
    return NextResponse.next();
  }

  const authenticated = isValidSession(
    request.cookies.get(SESSION_COOKIE)?.value
  );

  if (pathname === SIGN_IN_PATH) {
    return authenticated
      ? NextResponse.redirect(new URL("/", request.url))
      : NextResponse.next();
  }

  if (!authenticated) {
    const signInUrl = new URL(SIGN_IN_PATH, request.url);
    const requestedPath = pathname + request.nextUrl.search;
    if (requestedPath.length <= 2048) {
      signInUrl.searchParams.set("next", requestedPath);
    }
    const response = NextResponse.redirect(signInUrl);
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
