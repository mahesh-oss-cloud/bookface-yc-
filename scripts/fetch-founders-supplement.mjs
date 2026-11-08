// Supplemental pass: capture founders not bucketed by batch (no batch recorded).
import fs from "node:fs";
import path from "node:path";

const UA = "Mozilla/5.0";
async function getOpts(page) {
  const res = await fetch(page, { headers: { "User-Agent": UA } });
  const html = await res.text();
  return JSON.parse(html.match(/window\.AlgoliaOpts\s*=\s*(\{.*?\});/s)[1]);
}
async function query(opts, index, body) {
  const url = `https://${opts.app}-dsn.algolia.net/1/indexes/${index}/query?x-algolia-application-id=${opts.app}&x-algolia-api-key=${encodeURIComponent(opts.key)}`;
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}
const attrs = ["url_slug","first_name","last_name","avatar_thumb","current_company","company_slug","current_title","batches","current_region","yc_titles","yc_parent_industries","top_company"];
const dataDir = path.join(process.cwd(), "src", "data");
const existing = JSON.parse(fs.readFileSync(path.join(dataDir, "founders.json"), "utf8"));
const seen = new Set(existing.map((f) => f.id));

const opts = await getOpts("https://www.ycombinator.com/founders");
const f = await query(opts, "YCUsers_production", { query: "", hitsPerPage: 0, facets: ["current_region"], maxValuesPerFacet: 500 });
const regions = Object.keys(f.facets.current_region || {});
console.log("regions:", regions.length);

const added = [];
for (const region of regions) {
  let page = 0;
  while (true) {
    const d = await query(opts, "YCUsers_production", {
      query: "", hitsPerPage: 1000, page,
      facetFilters: [[`current_region:${region}`]],
      attributesToRetrieve: attrs,
    });
    for (const h of d.hits || []) {
      const id = h.url_slug || `f-${h.objectID}`;
      if (seen.has(id) || (!h.first_name && !h.last_name)) continue;
      seen.add(id);
      added.push({
        id,
        name: [h.first_name, h.last_name].filter(Boolean).join(" "),
        image: h.avatar_thumb || null,
        company: h.current_company || "",
        companySlug: h.company_slug || null,
        role: h.current_title || (h.yc_titles && h.yc_titles[0]) || "Founder",
        batch: toBatchShort(h.batches && h.batches[0]),
        location: h.current_region || region,
        industry: h.yc_parent_industries || [],
        top: !!h.top_company,
      });
    }
    if (!d.hits || d.hits.length < 1000) break;
    page++;
  }
}
// Second pass: partition by industry to catch anyone with no region/batch.
const ind = await query(opts, "YCUsers_production", { query: "", hitsPerPage: 0, facets: ["yc_parent_industries"], maxValuesPerFacet: 500 });
for (const industry of Object.keys(ind.facets.yc_parent_industries || {})) {
  let page = 0;
  while (true) {
    const d = await query(opts, "YCUsers_production", {
      query: "", hitsPerPage: 1000, page,
      facetFilters: [[`yc_parent_industries:${industry}`]],
      attributesToRetrieve: attrs,
    });
    for (const h of d.hits || []) {
      const id = h.url_slug || `f-${h.objectID}`;
      if (seen.has(id) || (!h.first_name && !h.last_name)) continue;
      seen.add(id);
      added.push({
        id,
        name: [h.first_name, h.last_name].filter(Boolean).join(" "),
        image: h.avatar_thumb || null,
        company: h.current_company || "",
        companySlug: h.company_slug || null,
        role: h.current_title || (h.yc_titles && h.yc_titles[0]) || "Founder",
        batch: toBatchShort(h.batches && h.batches[0]),
        location: h.current_region || "",
        industry: h.yc_parent_industries || [industry],
        top: !!h.top_company,
      });
    }
    if (!d.hits || d.hits.length < 1000) break;
    page++;
  }
}

console.log("new founders:", added.length);
const merged = existing.concat(added).sort((a, b) => (a.top === b.top ? a.name.localeCompare(b.name) : a.top ? -1 : 1));
fs.writeFileSync(path.join(dataDir, "founders.json"), JSON.stringify(merged));
console.log("total founders:", merged.length);

function toBatchShort(batch) {
  if (!batch) return "";
  const m = batch.match(/^(Summer|Winter|Fall|Spring)\s+(\d{4})$/i);
  if (m) {
    const w = m[1].toLowerCase();
    return (w.startsWith("summer") ? "S" : w.startsWith("winter") ? "W" : w.startsWith("fall") ? "F" : "P") + m[2].slice(2);
  }
  return batch;
}
