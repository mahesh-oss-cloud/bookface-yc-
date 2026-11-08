import { NextResponse } from "next/server";
import { getFounders } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") || "12", 10) || 12));

  const founders = getFounders();
  const base = q
    ? founders.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.company.toLowerCase().includes(q) ||
          f.role.toLowerCase().includes(q)
      )
    : founders.filter((f) => f.top);

  const items = base.slice(0, limit).map((f) => ({
    id: f.id,
    name: f.name,
    company: f.company,
    role: f.role,
    image: f.image,
  }));

  return NextResponse.json(items);
}
