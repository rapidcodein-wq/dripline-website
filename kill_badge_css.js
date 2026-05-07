const fs = require('fs');
const path = require('path');

let updated = 0;

// The Framer Commerce badge is dynamically injected by Framer's JS runtime.
// It uses these known selectors:
//   - class: __framer-badge
//   - class: framer-6jWyo (the badge component wrapper)
//   - it sits inside a container: #__badge-container / #__badge-container-disabled
//   - data attribute: data-framer-name="Light" (the badge variant)
// We need aggressive CSS to permanently hide any dynamically-created badge.

const cssBlock = `<style id="dripline-kill-badge">
/* Kill Framer Commerce badge - covers all known dynamic injection patterns */
.__framer-badge,
[class*="__framer-badge"],
a.__framer-badge,
#__badge-container,
#__badge-container-disabled,
.framer-6jWyo,
.framer-n0ccwk,
a[data-framer-name="Light"],
a[data-framer-appear-id="n0ccwk"],
a[href*="framer.com"],
a[href*="framercommerce"],
[data-framer-name="Light"][data-nosnippet="true"] {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
  width: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}
</style>`;

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Only add if not already present
    if (content.includes('dripline-kill-badge')) return;
    
    // Insert before </head>
    const headClose = '</head>';
    if (!content.includes(headClose)) return;
    
    content = content.replace(headClose, cssBlock + '\n' + headClose);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Added badge CSS to: ' + path.basename(filePath));
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
console.log(`\nDone. Added badge-killing CSS to ${updated} file(s).`);
