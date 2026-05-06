const fs = require('fs');

// Check categories/sale.html for static product HTML
const txt = fs.readFileSync('categories/sale.html', 'utf8');

// Check if products are pre-rendered or dynamic
const productNames = [...txt.matchAll(/>([A-Z][A-Z\s\-]+(?:SHIRT|HOODIE|JEANS|JACKET|SHOES|BAG|CARDIGAN|SOCK|NECK))<\//g)];
console.log("Static product names in sale.html:", productNames.length);
productNames.forEach(m => console.log("  ", m[1]));

// Check if there's inline product data
const priceMatch = [...txt.matchAll(/\$\d+\.\d+/g)];
console.log(`\nPrice entries: ${priceMatch.length}`);

// Check if the page has the main content div with products
const catalogDisplay = txt.indexOf('Catalog display');
const catalogContainer = txt.indexOf('CatalogDisplay');
console.log(`\nCatalog display section: ${catalogDisplay !== -1 ? 'FOUND' : 'NOT FOUND'}`);
console.log(`CatalogDisplay component: ${catalogContainer !== -1 ? 'FOUND' : 'NOT FOUND'}`);

if (catalogDisplay !== -1) {
    console.log("\nContext around Catalog display:");
    console.log(txt.substring(catalogDisplay - 100, catalogDisplay + 500));
}

// Check for product images
const productImages = [...txt.matchAll(/src="(data:image[^"]{50,100})/g)];
console.log(`\nInline product images: ${productImages.length}`);

// Check for Framer Commerce product fetching
const commerceIdx = txt.indexOf('framercommerce');
if (commerceIdx !== -1) {
    console.log("\nFramer Commerce found at:", commerceIdx);
}

// Check what the noscript section shows (if products are SSR'd)
const noscriptIdx = txt.indexOf('<noscript');
if (noscriptIdx !== -1) {
    console.log("\nnoscript found");
}
