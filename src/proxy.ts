import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "bookface_session";
const SIGN_IN_PATH = "/signin";

// Only static assets needed by the public sign-in screen and PWA shell are public.
// All application pages and data APIs are protected, including paths containing dots.
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
  const allowedEmail = process.env.BOOKFACE_LOGIN_EMAIL?.trim().toLowerCase();

  if (!token || !secret || !allowedEmail) return false;

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

    return (
      typeof session.email === "string" &&
      session.email.toLowerCase() === allowedEmail &&
      typeof session.exp === "number" &&
      session.exp > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Keep public sign-in branding and PWA resources available before login.
  if (PUBLIC_ASSET_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  // The login and logout handlers must be reachable before a session exists.
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
    // Clear stale or invalid cookies so an expired browser session cannot linger.
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  // Do not use a blanket "contains a dot" exclusion: that can leave dotted
  // application routes outside the authentication gate.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
