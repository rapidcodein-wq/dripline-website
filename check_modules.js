const fs = require('fs');

// Check the modulepreload links in categories/all.html
const txt = fs.readFileSync('categories/all.html', 'utf8');

// Find all modulepreload links
const preloads = [...txt.matchAll(/rel="modulepreload"[^>]*href="([^"]*)"/g)];
console.log("=== Modulepreload links in categories/all.html ===");
preloads.forEach((m, i) => {
    console.log(`[${i}] ${m[1]}`);
});

// Check if there are also script type=module src references
const scripts = [...txt.matchAll(/<script[^>]*type="module"[^>]*src="([^"]*)"/g)];
console.log(`\n=== Module script src ===`);
scripts.forEach((m, i) => {
    console.log(`[${i}] ${m[1]}`);
});

// Check if there's a main script tag with the hydration code
const mainScript = txt.indexOf('data-framer-hydrate-v2');
if (mainScript !== -1) {
    console.log(`\n=== Hydration data found at ${mainScript} ===`);
    console.log(txt.substring(mainScript, mainScript + 200));
}

// Also check for the inline script that bootstraps everything
const bootstrapIdx = txt.indexOf('__framer_events');
if (bootstrapIdx !== -1) {
    console.log(`\n=== Bootstrap script found ===`);
    // Find the script tag containing it
    const scriptStart = txt.lastIndexOf('<script', bootstrapIdx);
    const scriptEnd = txt.indexOf('</script>', bootstrapIdx);
    console.log(`Script tag from ${scriptStart} to ${scriptEnd}, length: ${scriptEnd - scriptStart}`);
}

// Check if the framer.com link inside script was replaced
const editorBar = txt.indexOf('__framer_force_showing_editorbar');
if (editorBar !== -1) {
    console.log(`\n=== Editor bar script ===`);
    console.log(txt.substring(editorBar - 50, editorBar + 300));
}
