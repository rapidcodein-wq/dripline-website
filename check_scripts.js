const fs = require('fs');
const txt = fs.readFileSync('categories/sale.html', 'utf8');

// Find all script tags with type=module 
const moduleScripts = [...txt.matchAll(/<script[^>]*type="module"[^>]*>([\s\S]*?)<\/script>/g)];
console.log(`Module script tags: ${moduleScripts.length}`);
for (const m of moduleScripts) {
    const content = m[1].substring(0, 200);
    console.log(`\nScript content (first 200 chars):\n${content}`);
    
    // Check for import statements with relative paths
    const imports = [...m[1].matchAll(/import\s*\(["`']([^"`']*)["`']\)/g)];
    if (imports.length > 0) {
        console.log("Imports found:");
        imports.slice(0, 10).forEach(i => console.log("  ", i[1]));
    }
}

// Also check for inline script that sets up the Framer routing
const routeSetup = txt.indexOf('path:`/categories/');
if (routeSetup !== -1) {
    console.log("\n\n=== Route setup ===");
    console.log(txt.substring(routeSetup - 100, routeSetup + 200));
}

// Check the script type=module with the main entry point
const mainEntry = txt.indexOf('type="module"');
if (mainEntry !== -1) {
    const scriptTag = txt.substring(mainEntry - 50, mainEntry + 500);
    console.log("\n=== First module script tag ===");
    console.log(scriptTag.substring(0, 500));
}
