import type { NextConfig } from "next";

const companyData = ["./src/data/companies.json"];
const founderData = ["./src/data/companies.json", "./src/data/founders.json"];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  // Keep the multi-megabyte directories out of routes that never use them.
  // They are included only in the server functions that read the corresponding data.
  outputFileTracingIncludes: {
    "/": founderData,
    "/companies": companyData,
    "/companies/[id]": founderData,
    "/founders": founderData,
    "/founders/[id]": founderData,
    "/search": founderData,
    "/profile": founderData,
    "/api/founders": founderData,
  },
};

export default nextConfig;
