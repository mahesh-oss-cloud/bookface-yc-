import { NextResponse } from "next/server";
import { NETWORK_PROFILES } from "@/data/network";

export const runtime = "nodejs";

// Only known portrait hosts are eligible as image sources or redirect targets.
const ALLOWED_IMAGE_HOSTS = new Set([
  "abconeprod.azureedge.net",
  "akm-img-a-in.tosshub.com",
  "assets.entrepreneur.com",
  "assets.gatsby.events",
  "assets.gqindia.com",
  "assets.weforum.org",
  "bharatdialogues.com",
  "blackhattalent.com",
  "cdn.arageek.com",
  "cdn.bankless.com",
  "cdn.i-scmp.com",
  "cdn.mos.cms.futurecdn.net",
  "cdn.prod.website-files.com",
  "cdn3.wionews.com",
  "cms-resources.groww.in",
  "consensus.coindesk.com",
  "content.macprime.ch",
  "d1epq84pwgteub.cloudfront.net",
  "d3a6q8f50538y6.cloudfront.net",
  "d6xcmfyh68wv8.cloudfront.net",
  "d92co48ro6fll.cloudfront.net",
  "etimg.etb2bimg.com",
  "fjord.dropboxstatic.com",
  "hips.hearstapps.com",
  "i.insider.com",
  "i0.wp.com",
  "icdn.dantri.com.vn",
  "image.cnbcfm.com",
  "imageio.forbes.com",
  "images.assettype.com",
  "images.crunchbase.com",
  "images.financialexpressdigital.com",
  "images.forbesindia.com",
  "images.moneycontrol.com",
  "images.squarespace-cdn.com",
  "images.storyboard18.com",
  "images.stripeassets.com",
  "images.yourstory.com",
  "img-2.outlookindia.com",
  "img.businessoffashion.com",
  "img.etimg.com",
  "img3.aksam.com.tr",
  "imgs.cwgv.com.tw",
  "inc42.com",
  "independent.ng",
  "ir.mi.com",
  "joinditto.in",
  "localist-images.azureedge.net",
  "m.economictimes.com",
  "media.assettype.com",
  "media.bizj.us",
  "media.fortuneindia.com",
  "media.gq-magazine.co.uk",
  "media.spokesman.com",
  "nyjbuhvfbjutcfbphchh.supabase.co",
  "pic1.calcalist.co.il",
  "s.yimg.com",
  "s206.q4cdn.com",
  "sb-vf-assets.s3.amazonaws.com",
  "spectrum.ieee.org",
  "startup77.com",
  "static.fireant.vn",
  "storage0.dms.mpinteractiv.ro",
  "theicons.net",
  "thekeynotecurators.com",
  "thumbor.forbes.com",
  "tycoonstories.com",
  "uix-stack-force.s3.amazonaws.com",
  "upload.wikimedia.org",
  "web.inmobicdn.net",
  "www.adani.com",
  "www.amacad.org",
  "www.boat-lifestyle.com",
  "www.bollywoodshaadis.com",
  "www.crn.com",
  "www.efinancialcareers.com",
  "www.etemaaddaily.com",
  "www.ey.com",
  "www.futureprize.org",
  "www.gatesfoundation.org",
  "www.goldmustang.ru",
  "www.igms.com",
  "www.indianspeakerbureau.com",
  "www.indiaspend.com",
  "www.infoedge.in",
  "www.karmanproject.org",
  "www.kotak.bank.in",
  "www.largus.fr",
  "www.oracle.com",
  "www.panshiyiphoto.com",
  "www.ril.com",
  "www.thecasecentre.org"
]);

const ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_REDIRECTS = 3;

function isAllowedImageUrl(url: URL): boolean {
  return url.protocol === "https:" && ALLOWED_IMAGE_HOSTS.has(url.hostname.toLowerCase());
}

async function fetchPortrait(startUrl: URL): Promise<Response | null> {
  let currentUrl = startUrl;

  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
    if (!isAllowedImageUrl(currentUrl)) return null;

    const response = await fetch(currentUrl, {
      cache: "force-cache",
      redirect: "manual",
      headers: { Accept: "image/avif,image/webp,image/png,image/jpeg" },
      signal: AbortSignal.timeout(8000),
    });

    if (![301, 302, 303, 307, 308].includes(response.status)) {
      return response;
    }

    const location = response.headers.get("location");
    if (!location || redirects === MAX_REDIRECTS) return null;

    try {
      currentUrl = new URL(location, currentUrl);
    } catch {
      return null;
    }
  }

  return null;
}

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

  if (!isAllowedImageUrl(imageUrl)) {
    return NextResponse.json({ error: "Portrait source is not allowed." }, { status: 400 });
  }

  try {
    const upstream = await fetchPortrait(imageUrl);

    if (!upstream?.ok) {
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
