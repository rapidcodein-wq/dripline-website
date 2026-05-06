const fs = require('fs');
const txt = fs.readFileSync('index.html', 'utf8');

// Find the parent div of the Features section
const featuresIdx = txt.indexOf('data-framer-name="Features"');
// Go backwards to find the opening tag
let tagStart = txt.lastIndexOf('<div', featuresIdx);
const classMatch = txt.substring(tagStart, featuresIdx + 50).match(/class="([^"]*)"/);
console.log("Features element class:", classMatch ? classMatch[1] : 'N/A');

// Now find the parent - go back before the <div that starts the Features section
// and find the previous closing tag, then find the class before that
const beforeFeatures = txt.substring(featuresIdx - 500, featuresIdx);
console.log("\n--- 500 chars before Features ---");
console.log(beforeFeatures);

// Also look for any mouse/scroll indicator
const scrollIdx = txt.indexOf('mouse');
if (scrollIdx !== -1) {
    console.log("\n--- mouse context ---");
    console.log(txt.substring(scrollIdx - 100, scrollIdx + 200));
}

// Check for scroll indicator SVG or icon  
const scrollIcon = txt.indexOf('scroll-indicator');
if (scrollIcon !== -1) {
    console.log("\n--- scroll-indicator context ---");
    console.log(txt.substring(scrollIcon - 100, scrollIcon + 200));
}

// Look for the specific class framer-15jom4l in CSS or inline styles
const cssMatch = txt.indexOf('.framer-15jom4l');
if (cssMatch !== -1) {
    console.log("\n--- CSS for framer-15jom4l ---");
    console.log(txt.substring(cssMatch, cssMatch + 500));
}
