import { NextResponse } from "next/server";
import { YC_PARTNERS } from "@/data/partners";

export const runtime = "nodejs";

const ALLOWED_IMAGE_HOST = "bookface-images.s3.amazonaws.com";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const partner = YC_PARTNERS.find((item) => item.id === id);

  if (!partner?.image) {
    return NextResponse.json({ error: "Partner portrait not found." }, { status: 404 });
  }

  let imageUrl: URL;
  try {
    imageUrl = new URL(partner.image);
  } catch {
    return NextResponse.json({ error: "Invalid portrait source." }, { status: 400 });
  }

  if (imageUrl.protocol !== "https:" || imageUrl.hostname !== ALLOWED_IMAGE_HOST) {
    return NextResponse.json({ error: "Portrait source is not allowed." }, { status: 400 });
  }

  try {
    const upstream = await fetch(imageUrl, {
      cache: "force-cache",
      redirect: "error",
      headers: { Accept: "image/avif,image/webp,image/png,image/jpeg" },
      signal: AbortSignal.timeout(8000),
    });

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json({ error: "Portrait is temporarily unavailable." }, { status: 502 });
    }

    const contentType = upstream.headers.get("content-type")?.split(";")[0].trim() ?? "";
    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
    if (!allowedTypes.has(contentType)) {
      return NextResponse.json({ error: "Unsupported portrait format." }, { status: 415 });
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer",
      },
    });
  } catch {
    return NextResponse.json({ error: "Portrait could not be loaded." }, { status: 502 });
  }
}
