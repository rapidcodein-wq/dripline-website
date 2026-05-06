const fs = require('fs');
const txt = fs.readFileSync('index.html', 'utf8');

// Find the header nav links and their hrefs
// Shop
const shopTextIdx = 588281;
const shopContext = txt.substring(Math.max(0, shopTextIdx - 500), shopTextIdx + 200);
const shopHrefs = shopContext.match(/href="([^"]*)"/g);
console.log("=== SHOP nav ===");
console.log("hrefs:", shopHrefs);
console.log(shopContext.substring(shopContext.length - 300));

// Drops
console.log("\n=== DROPS nav ===");
const dropsContext = txt.substring(589431 - 500, 589431 + 200);
const dropsHrefs = dropsContext.match(/href="([^"]*)"/g);
console.log("hrefs:", dropsHrefs);

// Sale
console.log("\n=== SALE nav ===");
const saleContext = txt.substring(590675 - 500, 590675 + 200);
const saleHrefs = saleContext.match(/href="([^"]*)"/g);
console.log("hrefs:", saleHrefs);

// New
console.log("\n=== NEW nav ===");
const newContext = txt.substring(591413 - 500, 591413 + 200);
const newHrefs = newContext.match(/href="([^"]*)"/g);
console.log("hrefs:", newHrefs);

// Check category pages exist
const catPath = './categories';
const catFiles = require('fs').readdirSync(catPath);
console.log("\n=== Category pages ===");
console.log(catFiles);
