export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}

const MONTHS: Record<string, string> = { W: "Winter", S: "Summer", F: "Fall", P: "Spring" };

export function batchLabel(short: string): string {
  if (!short) return "Unspecified";
  const m = short.match(/^([WSFP])(\d{2})$/i);
  if (!m) return short;
  return `${MONTHS[m[1].toUpperCase()] ?? m[1]} 20${m[2]}`;
}
