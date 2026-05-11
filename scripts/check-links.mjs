import { links } from "../src/lib/links.ts";

const urls = [
  links.uberEats,
  links.whatsapp,
  links.instagram,
  links.tiktok,
  links.googleMaps,
  links.googleReviews,
];

let failures = 0;

for (const url of urls) {
  try {
    let res = await fetch(url, { method: "HEAD", redirect: "follow" });
    // Some platforms (Instagram, TikTok) reject HEAD from bots; fall back to GET
    if (res.status === 405) {
      res = await fetch(url, { method: "GET", redirect: "follow" });
    }
    if (res.ok || res.status === 302 || res.status === 301) {
      console.log(`✓ ${res.status} ${url}`);
    } else {
      console.log(`✗ ${res.status} ${url}`);
      failures++;
    }
  } catch (err) {
    console.log(`✗ ERROR ${url} — ${err.message}`);
    failures++;
  }
}

if (failures > 0) {
  console.error(`\n${failures} link(s) failed.`);
  process.exit(1);
}
console.log("\nAll links OK.");
