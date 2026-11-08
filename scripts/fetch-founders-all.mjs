// Complete founder fetch using numeric ID ranges (bypasses the 1000-hit pagination cap).
import fs from "node:fs";
import path from "node:path";

const UA = "Mozilla/5.0";
const attrs = ["url_slug","first_name","last_name","avatar_thumb","current_company","company_slug","current_title","batches","current_region","yc_titles","yc_parent_industries","top_company"];

const res0 = await fetch("https://www.ycombinator.com/founders", { headers: { "User-Agent": UA } });
const html = await res0.text();
const opts = JSON.parse(html.match(/window\.AlgoliaOpts\s*=\s*(\{.*?\});/s)[1]);

async function q(body) {
  const url = `https://${opts.app}-dsn.algolia.net/1/indexes/YCUsers_production/query?x-algolia-application-id=${opts.app}&x-algolia-api-key=${encodeURIComponent(opts.key)}`;
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return r.json();
}

// IDs run to ~4.5M; scan wide ranges and only subdivide a range that hits the 1000 cap.
const MAX_ID = 4_700_000;
const STEP = 50_000;
const hits = [];
for (let lo = 0; lo < MAX_ID; lo += STEP) {
  const ranges = [[lo, Math.min(lo + STEP, MAX_ID)]];
  while (ranges.length) {
    const [a, b] = ranges.shift();
    const d = await q({ query: "", hitsPerPage: 1000, numericFilters: [`id>=${a}`, `id<${b}`], attributesToRetrieve: attrs });
    if (d.hits.length >= 1000 && b - a > 200) {
      const mid = Math.floor((a + b) / 2);
      ranges.push([a, mid], [mid, b]);
    } else {
      hits.push(...d.hits);
    }
  }
  process.stdout.write(`\r  scanned id<${Math.min(lo + STEP, MAX_ID)} · ${hits.length} hits`);
}
console.log(`\r  scanned all · ${hits.length} raw hits`);

const dataDir = path.join(process.cwd(), "src", "data");
const existing = JSON.parse(fs.readFileSync(path.join(dataDir, "founders.json"), "utf8"));

function toBatchShort(batch) {
  if (!batch) return "";
  const m = batch.match(/^(Summer|Winter|Fall|Spring)\s+(\d{4})$/i);
  if (m) {
    const w = m[1].toLowerCase();
    return (w.startsWith("summer") ? "S" : w.startsWith("winter") ? "W" : w.startsWith("fall") ? "F" : "P") + m[2].slice(2);
  }
  return batch;
}

const map = new Map();
function add(f) {
  if (!f.id || map.has(f.id)) return;
  map.set(f.id, f);
}
for (const f of existing) add(f);
for (const h of hits) {
  if (!h.first_name && !h.last_name) continue;
  add({
    id: h.url_slug || `f-${h.objectID}`,
    name: [h.first_name, h.last_name].filter(Boolean).join(" "),
    image: h.avatar_thumb || null,
    company: h.current_company || "",
    companySlug: h.company_slug || null,
    role: h.current_title || (h.yc_titles && h.yc_titles[0]) || "Founder",
    batch: toBatchShort(h.batches && h.batches[0]),
    location: h.current_region || "",
    industry: h.yc_parent_industries || [],
    top: !!h.top_company,
  });
}

const merged = [...map.values()].sort((a, b) => (a.top === b.top ? a.name.localeCompare(b.name) : a.top ? -1 : 1));
fs.writeFileSync(path.join(dataDir, "founders.json"), JSON.stringify(merged));
console.log("total founders:", merged.length);
