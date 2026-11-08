import fs from "node:fs";
import path from "node:path";

export type Company = {
  id: string;
  name: string;
  oneLiner: string;
  batch: string;
  batchShort: string;
  location: string;
  industry: string[];
  tags: string[];
  logo: string | null;
  website: string;
  launchedYear: number | null;
  teamSize: number | null;
  status: string;
  top: boolean;
  description?: string;
  primaryPartner?: string;
  groupPartner?: string;
};

export type Founder = {
  id: string;
  name: string;
  image: string | null;
  company: string;
  companySlug: string | null;
  role: string;
  batch: string;
  location: string;
  industry: string[];
  top: boolean;
  bio?: string;
  groupPartner?: string;
};

const BLACKBIRD_FOUNDERS: Founder[] = [
  {
    id: "mahesh-bal",
    name: "Mahesh Bal",
    image: null,
    company: "Blackbird Finance",
    companySlug: "blackbird",
    role: "Founder & CFO",
    batch: "W27",
    location: "Hyderabad, India",
    industry: ["Fintech", "B2B", "SaaS"],
    top: true,
    bio: "Mahesh is a student founder building at the intersection of finance and AI. As Blackbird Finance's founder and CFO, he leads the company's finances and works on product and regulatory workflows—especially the documentation behind cross-border service payments, GST and export compliance. He writes about GST on exports, the Export Declaration Form (EDF), FIRCs and income tax for Indian freelancers.",
  },
  {
    id: "saharsh-keerthi",
    name: "Saharsh Keerthi",
    image: null,
    company: "Blackbird Finance",
    companySlug: "blackbird",
    role: "Co-founder & CEO",
    batch: "W27",
    location: "Hyderabad, India",
    industry: ["Fintech", "B2B", "SaaS"],
    top: true,
    bio: "Saharsh leads Blackbird Finance as CEO, focusing the company on freelancers, developers and agencies in India that bill clients abroad. He shapes the company's customer direction and product priorities.",
  },
  {
    id: "arhaan-rahil-mohammed",
    name: "Arhaan Rahil Mohammed",
    image: null,
    company: "Blackbird Finance",
    companySlug: "blackbird",
    role: "Co-founder & CTO",
    batch: "W27",
    location: "Hyderabad, India",
    industry: ["Fintech", "B2B", "SaaS"],
    top: true,
    bio: "Arhaan leads Blackbird Finance's technology and security, including the app, customer-data protections and the files the product prepares, such as GSTR-1 and the Export Declaration Form (EDF).",
  },
  {
    id: "satwik-reddy",
    name: "Satwik Reddy",
    image: null,
    company: "Blackbird Finance",
    companySlug: "blackbird",
    role: "Co-founder & COO",
    batch: "W27",
    location: "Hyderabad, India",
    industry: ["Fintech", "B2B", "SaaS"],
    top: true,
    bio: "Satwik runs Blackbird Finance's operations, including the compliance calendar and the GST, EDF and income-tax deadlines that customers need to keep track of.",
  },
];

const BLACKBIRD_COMPANY: Company = {
  id: "blackbird",
  name: "Blackbird Finance",
  oneLiner: "A financial OS for Indian freelancers, developers and agencies billing clients abroad.",
  batch: "Winter 2027",
  batchShort: "W27",
  location: "Hyderabad, Telangana, India",
  industry: ["Fintech", "B2B", "SaaS"],
  tags: ["GST", "Export compliance", "Invoicing", "AI"],
  logo: "/blackbird.png",
  website: "https://www.blackbirdfinance.net",
  launchedYear: 2026,
  teamSize: 4,
  status: "Active",
  top: true,
  groupPartner: "Jared Friedman",
  primaryPartner: "Jared Friedman",
  description:
    "Blackbird Finance is a financial OS for freelancers, developers and agencies in India who bill clients abroad. It brings export invoicing, payment matching, GST preparation, monthly Export Declaration Form (EDF) preparation and income-tax estimates into one workflow. Blackbird prepares the records customers and their CAs need; customers remain in control of filing and their existing payment providers.",
};

let companyCache: Company[] | null = null;
let founderCache: Founder[] | null = null;

function readJson<T>(file: string): T {
  const p = path.join(process.cwd(), "src", "data", file);
  return JSON.parse(fs.readFileSync(p, "utf8")) as T;
}

export function getCompanies(): Company[] {
  if (!companyCache) {
    const raw = readJson<Company[]>("companies.json");
    companyCache = [
      BLACKBIRD_COMPANY,
      ...raw.map((company) => {
        const source = company as Company & {
          primaryPartner?: string;
          groupPartner?: string;
          partner?: string;
        };
        const groupPartner =
          source.groupPartner?.trim() ||
          source.primaryPartner?.trim() ||
          source.partner?.trim() ||
          undefined;
        return { ...company, groupPartner };
      }),
    ];
  }
  return companyCache;
}

export function getFounders(): Founder[] {
  if (!founderCache) {
    const raw = readJson<Founder[]>("founders.json");
    const partnerByCompany = new Map(
      getCompanies().map((company) => [company.id, company.groupPartner] as const)
    );
    founderCache = [...BLACKBIRD_FOUNDERS, ...raw].map((founder) => ({
      ...founder,
      groupPartner: founder.companySlug ? partnerByCompany.get(founder.companySlug) : undefined,
    }));
  }
  return founderCache;
}

export function getCompany(id: string): Company | undefined {
  return getCompanies().find((c) => c.id === id);
}

export function getFounder(id: string): Founder | undefined {
  return getFounders().find((f) => f.id === id);
}

export function getFoundersByCompany(companySlug: string): Founder[] {
  const company = getCompany(companySlug);
  return getFounders().filter(
    (f) =>
      f.companySlug === companySlug ||
      (company && f.company.toLowerCase() === company.name.toLowerCase())
  );
}

export { batchLabel, initials, formatCount } from "./format";

function batchRank(short: string): number {
  const m = short.match(/^([WSFP])(\d{2})$/i);
  if (!m) return -1;
  return 2000 + parseInt(m[2], 10);
}

export function getBatches(): string[] {
  const set = new Set<string>();
  for (const c of getCompanies()) if (c.batchShort) set.add(c.batchShort);
  return [...set].sort((a, b) => batchRank(b) - batchRank(a));
}

export function getIndustries(): string[] {
  const set = new Set<string>();
  for (const c of getCompanies()) {
    const primary = c.industry[0];
    if (primary) set.add(primary);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function getFounderIndustries(): string[] {
  const set = new Set<string>();
  for (const f of getFounders()) {
    const primary = f.industry[0];
    if (primary) set.add(primary);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function getRoles(): string[] {
  const set = new Set<string>();
  for (const f of getFounders()) if (f.role) set.add(f.role);
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function getStats() {
  const companies = getCompanies();
  const founders = getFounders();
  return {
    companies: companies.length,
    founders: founders.length,
    batches: getBatches().length,
    topCompanies: companies.filter((c) => c.top).length,
  };
}

export type CompanyQuery = {
  q?: string;
  batch?: string;
  industry?: string;
  page?: number;
  perPage?: number;
};

export function searchCompanies({ q = "", batch = "", industry = "", page = 1, perPage = 30 }: CompanyQuery) {
  const needle = q.trim().toLowerCase();
  const all = getCompanies().filter((c) => {
    if (batch && c.batchShort !== batch) return false;
    if (industry && !c.industry.some((i) => i.toLowerCase() === industry.toLowerCase())) return false;
    if (!needle) return true;
    return (
      c.name.toLowerCase().includes(needle) ||
      c.oneLiner.toLowerCase().includes(needle) ||
      c.tags.some((t) => t.toLowerCase().includes(needle)) ||
      c.location.toLowerCase().includes(needle)
    );
  });
  const total = all.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), pages);
  const items = all.slice((safePage - 1) * perPage, safePage * perPage);
  return { items, total, page: safePage, pages };
}

export type FounderQuery = {
  q?: string;
  batch?: string;
  industry?: string;
  role?: string;
  page?: number;
  perPage?: number;
};

export function searchFounders({ q = "", batch = "", industry = "", role = "", page = 1, perPage = 24 }: FounderQuery) {
  const needle = q.trim().toLowerCase();
  const all = getFounders().filter((f) => {
    if (batch && f.batch !== batch) return false;
    if (industry && !f.industry.some((i) => i.toLowerCase() === industry.toLowerCase())) return false;
    if (role && f.role.toLowerCase() !== role.toLowerCase()) return false;
    if (!needle) return true;
    return (
      f.name.toLowerCase().includes(needle) ||
      f.company.toLowerCase().includes(needle) ||
      f.role.toLowerCase().includes(needle) ||
      f.location.toLowerCase().includes(needle)
    );
  });
  const total = all.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), pages);
  const items = all.slice((safePage - 1) * perPage, safePage * perPage);
  return { items, total, page: safePage, pages };
}
