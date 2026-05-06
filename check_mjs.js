const fs = require('fs');

// Check if index.html contains inline script references to .mjs
const content = fs.readFileSync('index.html', 'utf8');

// Search for .mjs references
const mjsMatches = [...content.matchAll(/\.mjs/g)];
console.log(`Total .mjs occurrences in index.html: ${mjsMatches.length}`);

// Show context of first few
for (let i = 0; i < Math.min(5, mjsMatches.length); i++) {
    const idx = mjsMatches[i].index;
    console.log(`\n[${i}] at index ${idx}:`);
    console.log(content.substring(Math.max(0, idx - 80), idx + 30));
}

// Check categories/all.html for .mjs
const catContent = fs.readFileSync('categories/all.html', 'utf8');
const catMjs = [...catContent.matchAll(/\.mjs/g)];
console.log(`\nTotal .mjs occurrences in categories/all.html: ${catMjs.length}`);

for (let i = 0; i < Math.min(5, catMjs.length); i++) {
    const idx = catMjs[i].index;
    console.log(`\n[${i}] at index ${idx}:`);
    console.log(catContent.substring(Math.max(0, idx - 80), idx + 30));
}

// Check file size
console.log(`\nindex.html size: ${(content.length / 1024 / 1024).toFixed(2)} MB`);
console.log(`categories/all.html size: ${(catContent.length / 1024 / 1024).toFixed(2)} MB`);

// Check if the category page has product data inline or loads it dynamically
const productDataIdx = catContent.indexOf('CatalogDisplay');
console.log(`\nCatalogDisplay in categories/all.html: ${productDataIdx !== -1 ? 'FOUND at ' + productDataIdx : 'NOT FOUND'}`);

const productDataIdx2 = catContent.indexOf('product');
console.log(`product in categories/all.html: ${productDataIdx2 !== -1 ? 'FOUND' : 'NOT FOUND'}`);

// Check if products are in inline scripts
const inlineScript = catContent.indexOf('import(');
console.log(`import( in categories/all.html: ${inlineScript !== -1 ? 'FOUND' : 'NOT FOUND'}`);
if (inlineScript !== -1) {
    console.log("Context:", catContent.substring(inlineScript, inlineScript + 200));
}
