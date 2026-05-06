const fs = require('fs');
const txt = fs.readFileSync('categories/all.html', 'utf8');

// Find all rapidcode.in references and their full context
let pos = 0;
let count = 0;
while ((pos = txt.indexOf('rapidcode.in', pos)) !== -1) {
    count++;
    const context = txt.substring(Math.max(0, pos - 200), Math.min(txt.length, pos + 50));
    
    // Check if this is in a modulepreload, script src, or similar critical tag
    if (context.includes('modulepreload') || context.includes('<script') || context.includes('import(')) {
        console.log(`[CRITICAL ${count}] at index ${pos}:`);
        console.log(context);
        console.log('---');
    }
    pos += 10;
}
console.log(`\nTotal rapidcode.in references: ${count}`);

// Also check if framer.com was used for anything that shouldn't have been replaced
// Check the inline JS code for any broken framer.com references
const brokenRef = txt.indexOf('"https://rapidcode.in/"');
if (brokenRef !== -1) {
    // Check if it's inside a script tag
    const beforeRef = txt.substring(Math.max(0, brokenRef - 500), brokenRef);
    if (beforeRef.includes('<script') && !beforeRef.includes('</script')) {
        console.log('\nWARNING: rapidcode.in found inside script tag!');
    }
}
