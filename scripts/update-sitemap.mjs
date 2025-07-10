#!/usr/bin/env node

import fs from "fs";
import path from "path";

const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

// Update the static sitemap.xml
const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
let sitemapContent = fs.readFileSync(sitemapPath, "utf8");

// Replace all lastmod dates with today's date
sitemapContent = sitemapContent.replace(
  /<lastmod>.*?<\/lastmod>/g,
  `<lastmod>${today}</lastmod>`
);

fs.writeFileSync(sitemapPath, sitemapContent);

console.log(`✅ Updated sitemap.xml with today's date: ${today}`);
console.log("📝 Current domain: https://sunbrix.netlify.app");
