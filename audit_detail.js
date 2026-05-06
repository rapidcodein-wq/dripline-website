const fs = require('fs');
const txt = fs.readFileSync('index.html', 'utf8');

// Find all href links containing social media or framer
const hrefMatches = [...txt.matchAll(/href="([^"]*(?:facebook|instagram|x\.com|twitter|framer)[^"]*)"/g)];
console.log("=== Social & Framer links ===");
const uniqueLinks = new Set();
for (const m of hrefMatches) {
    uniqueLinks.add(m[1]);
}
for (const link of uniqueLinks) {
    console.log(link);
}

// Find visible text instances of Rawline/RAWLINE
console.log("\n=== Brand name patterns ===");
const brandMatches = [...txt.matchAll(/>([^<]*(?:rawline|RAWLINE|Rawline|RAW CLOTHING|Raw Clothing)[^<]*)</gi)];
const uniqueBrand = new Set();
for (const m of brandMatches) {
    uniqueBrand.add(m[1].trim());
}
for (const b of uniqueBrand) {
    console.log(`"${b}"`);
}

// Find title tag
const titleMatch = txt.match(/<title>([^<]*)<\/title>/);
if (titleMatch) console.log("\nPage title:", titleMatch[1]);

// Find meta og:site_name or similar
const ogMatch = txt.match(/property="og:site_name"[^>]*content="([^"]*)"/);
if (ogMatch) console.log("OG site name:", ogMatch[1]);
