// Fetches the full YC company + founder directories from YC's public Algolia index.
// The secured API key caps pagination at 1000 results per query, so we partition by batch.
// Run: node scripts/fetch-yc-data.mjs
import fs from "node:fs";
import path from "node:path";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36";

async function getOpts(page) {
  const res = await fetch(page, { headers: { "User-Agent": UA } });
  const html = await res.text();
  const m = html.match(/window\.AlgoliaOpts\s*=\s*(\{.*?\});/s);
  if (!m) throw new Error("AlgoliaOpts not found for " + page);
  return JSON.parse(m[1]);
}

async function query(opts, index, body) {
  const url = `https://${opts.app}-dsn.algolia.net/1/indexes/${index}/query?x-algolia-application-id=${opts.app}&x-algolia-api-key=${encodeURIComponent(opts.key)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${index} -> ${res.status} ${await res.text()}`);
  return res.json();
}

// Fetch every hit by partitioning on a facet whose value counts are all < 1000.
async function fetchAllByFacet(opts, index, facet, attrs) {
  const f = await query(opts, index, { query: "", hitsPerPage: 0, facets: [facet], maxValuesPerFacet: 500 });
  const values = Object.keys(f.facets[facet] || {});
  console.log(`  ${index}: ${f.nbHits} hits across ${values.length} ${facet} buckets`);
  const seen = new Set();
  const hits = [];
  let n = 0;
  for (const value of values) {
    let page = 0;
    while (true) {
      const d = await query(opts, index, {
        query: "",
        hitsPerPage: 1000,
        page,
        facetFilters: [[`${facet}:${value}`]],
        attributesToRetrieve: attrs,
      });
      for (const h of d.hits || []) {
        const key = h.objectID;
        if (!seen.has(key)) { seen.add(key); hits.push(h); }
      }
      if (!d.hits || d.hits.length < 1000) break;
      page++;
      if (page > 10) break;
    }
    n++;
    if (n % 10 === 0) process.stdout.write(`\r  ${n}/${values.length} buckets, ${hits.length} hits`);
  }
  process.stdout.write(`\r  done: ${hits.length} unique hits\n`);
  return hits;
}

const companyAttrs = [
  "slug", "name", "one_liner", "batch", "all_locations", "industries", "tags",
  "small_logo_thumb_url", "website", "launched_at", "team_size", "status", "top_company",
  "industry", "subindustry",
];
const founderAttrs = [
  "url_slug", "first_name", "last_name", "avatar_thumb", "current_company", "company_slug",
  "current_title", "batches", "current_region", "yc_titles", "yc_parent_industries", "top_company",
];

const root = process.cwd();
const dataDir = path.join(root, "src", "data");
fs.mkdirSync(dataDir, { recursive: true });

console.log("Fetching YC companies…");
const companyOpts = await getOpts("https://www.ycombinator.com/companies");
const companiesRaw = await fetchAllByFacet(companyOpts, "YCCompany_production", "batch", companyAttrs);

const companies = companiesRaw
  .filter((c) => c.name && c.slug)
  .map((c) => ({
    id: c.slug,
    name: c.name,
    oneLiner: c.one_liner || "",
    batch: c.batch || "",
    batchShort: toBatchShort(c.batch),
    location: c.all_locations || "",
    industry: c.industries && c.industries.length ? c.industries : c.industry ? [c.industry] : [],
    tags: c.tags || [],
    logo: c.small_logo_thumb_url || null,
    website: c.website || "",
    launchedYear: c.launched_at ? new Date(c.launched_at * 1000).getFullYear() : null,
    teamSize: c.team_size || null,
    status: c.status || "",
    top: !!c.top_company,
  }))
  .sort((a, b) => (a.top === b.top ? a.name.localeCompare(b.name) : a.top ? -1 : 1));

console.log(`Saving ${companies.length} companies…`);
fs.writeFileSync(path.join(dataDir, "companies.json"), JSON.stringify(companies));

console.log("Fetching YC founders…");
const founderOpts = await getOpts("https://www.ycombinator.com/founders");
const foundersRaw = await fetchAllByFacet(founderOpts, "YCUsers_production", "batches", founderAttrs);

const founders = foundersRaw
  .filter((f) => f.first_name || f.last_name)
  .map((f) => ({
    id: f.url_slug || `f-${f.objectID ?? Math.random().toString(36).slice(2)}`,
    name: [f.first_name, f.last_name].filter(Boolean).join(" "),
    image: f.avatar_thumb || null,
    company: f.current_company || "",
    companySlug: f.company_slug || null,
    role: f.current_title || (f.yc_titles && f.yc_titles[0]) || "Founder",
    batch: toBatchShort(f.batches && f.batches[0]),
    location: f.current_region || "",
    industry: f.yc_parent_industries || [],
    top: !!f.top_company,
  }))
  .sort((a, b) => (a.top === b.top ? a.name.localeCompare(b.name) : a.top ? -1 : 1));

console.log(`Saving ${founders.length} founders…`);
fs.writeFileSync(path.join(dataDir, "founders.json"), JSON.stringify(founders));

console.log("Done.");

function toBatchShort(batch) {
  if (!batch) return "";
  const m = batch.match(/^(Summer|Winter|Fall|Spring)\s+(\d{4})$/i);
  if (m) {
    const w = m[1].toLowerCase();
    const letter = w.startsWith("summer") ? "S" : w.startsWith("winter") ? "W" : w.startsWith("fall") ? "F" : "P";
    return letter + m[2].slice(2);
  }
  return batch;
}
