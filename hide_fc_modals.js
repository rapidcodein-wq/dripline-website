const fs = require('fs');
const path = require('path');

let updated = 0;

// CSS to hide the Framer Commerce modal whitespace boxes.
// These are injected at runtime as:
//   - <div data-framercommerce-type="country">
//   - <div data-framercommerce-type="newsletter">
// They also appear as portal divs with IDs like __fc_country_modal, __fc_newsletter_modal
// and as bottom-level children of <body> with specific preview placeholder styling.
// The "Preview disabled for Desktop Modal" text is shown inside a container that has
// a background-color and is positioned at the bottom of the DOM.
// We hide ALL of the above patterns.
const cssBlock = `<style id="dripline-hide-fc-modals">
/* Hide Framer Commerce modal whitespace boxes */
[data-framercommerce-type],
[id^="__fc_"],
[id*="fc-modal"],
[id*="fc_modal"],
.__framer-commerce-modal,
[data-framer-name*="Modal"],
[data-fc-portal],
.framer-commerce-portal,
/* Broad fallback: any direct children of body that are empty/placeholder divs at the bottom */
body > div:not(#main):not(#__badge-container-disabled):not([id]):not([class]):empty {
  display: none !important;
}
</style>`;

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Only add if not already present
    if (content.includes('dripline-hide-fc-modals')) return;
    
    // Insert before </head>
    const headClose = '</head>';
    if (!content.includes(headClose)) return;
    
    content = content.replace(headClose, cssBlock + '\n' + headClose);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Added CSS to: ' + path.basename(filePath));
    updated++;
}

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file === '.git' || file === 'node_modules') continue;
            processDir(fullPath);
        } else if (file.endsWith('.html')) {
            processFile(fullPath);
        }
    }
}

processDir('.');
console.log(`\nDone. Added CSS to ${updated} file(s).`);
