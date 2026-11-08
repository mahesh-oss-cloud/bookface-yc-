import { NextResponse } from "next/server";
import { NETWORK_PROFILES } from "@/data/network";

export const runtime = "nodejs";

const ALLOWED_IMAGE_HOSTS = new Set([
  "www.ril.com",
  "www.adani.com",
  "joinditto.in",
  "inc42.com",
  "www.thecasecentre.org",
  "bharatdialogues.com",
  "assets.weforum.org",
  "images.yourstory.com",
  "www.boat-lifestyle.com",
  "akm-img-a-in.tosshub.com",
  "blackhattalent.com",
  "img-2.outlookindia.com",
  "media.fortuneindia.com",
  "images.moneycontrol.com",
  "images.forbesindia.com",
  "media.assettype.com",
  "m.economictimes.com",
  "images.storyboard18.com",
  "cdn.forbes.sk",
  "i.guim.co.uk",
  "cdn.mos.cms.futurecdn.net",
  "thumbor.forbes.com",
  "panshiyiphoto.com",
  "s201.q4cdn.com",
  "www.gatesfoundation.org",
  "assets.entrepreneur.com",
  "thekeynotecurators.com",
  "s.yimg.com",
  "www.karmanproject.org",
  "cdn.i-scmp.com",
]);

const ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const profile = NETWORK_PROFILES.find((item) => item.id === id);

  if (!profile?.image) {
    return NextResponse.json({ error: "Network portrait not found." }, { status: 404 });
  }

  let imageUrl: URL;
  try {
    imageUrl = new URL(profile.image);
  } catch {
    return NextResponse.json({ error: "Invalid portrait source." }, { status: 400 });
  }

  if (
    imageUrl.protocol !== "https:" ||
    !ALLOWED_IMAGE_HOSTS.has(imageUrl.hostname.toLowerCase())
  ) {
    return NextResponse.json({ error: "Portrait source is not allowed." }, { status: 400 });
  }

  try {
    const upstream = await fetch(imageUrl, {
      cache: "force-cache",
      redirect: "error",
      headers: { Accept: "image/avif,image/webp,image/png,image/jpeg" },
      signal: AbortSignal.timeout(8000),
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: "Portrait is temporarily unavailable." }, { status: 502 });
    }

    const contentType =
      upstream.headers.get("content-type")?.split(";")[0].trim().toLowerCase() ?? "";
    if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
      return NextResponse.json({ error: "Unsupported portrait format." }, { status: 415 });
    }

    const declaredLength = Number(upstream.headers.get("content-length") ?? 0);
    if (declaredLength > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Portrait is too large." }, { status: 413 });
    }

    const image = await upstream.arrayBuffer();
    if (image.byteLength === 0 || image.byteLength > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Portrait is empty or too large." }, { status: 413 });
    }

    return new Response(image, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(image.byteLength),
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer",
      },
    });
  } catch {
    return NextResponse.json({ error: "Portrait could not be loaded." }, { status: 502 });
  }
}
