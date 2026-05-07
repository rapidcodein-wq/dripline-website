const fs = require('fs');
const path = require('path');

let renamedFiles = 0;
let whiteboxFiles = 0;

// ── 1. Patterns to fix Rawline → Dripline (case-aware) ──────────────────────
// We'll do multiple targeted replacements
const replacements = [
    // Exact display text variants
    [/RAW CLOTHING STORE/g,       'DRIPLINE CLOTHING STORE'],
    [/Raw Clothing Store/g,        'DripLine Clothing Store'],
    [/raw clothing store/g,        'dripline clothing store'],
    [/RAWLINE/g,                   'DRIPLINE'],
    [/Rawline/g,                   'DripLine'],
    [/rawline/g,                   'dripline'],
    // Title/meta tags
    [/RAW/g,                       'DRIP'],
];

// ── 2. Remove the grey whitespace modal containers ───────────────────────────
// These are Framer Commerce modals rendered server-side as empty placeholder divs
// They look like: <div data-framercommerce-type="country">...</div>
//                  <div data-framercommerce-type="newsletter">...</div>
// OR they may be sections with specific IDs / class patterns

// Let's also look for and remove the two modal portal divs that create the
// white/grey boxes. The screenshot shows two boxes below the footer:
// "Preview disabled for Desktop Modal (country)" and "(newsletter)"
// These are rendered by Framer Commerce JS into div portals.
// We need to remove the portal container divs from the HTML.

// Common patterns for Framer Commerce modal portals in static export:
const modalPatterns = [
    // Pattern 1: data-framercommerce attribute
    /<div[^>]*data-framercommerce[^>]*>[\s\S]*?<\/div>/g,
    // Pattern 2: fc-modal containers
    /<div[^>]*fc-modal[^>]*>[\s\S]*?<\/div>/g,
    // Pattern 3: Framer Commerce portal divs (id pattern)
    /<div[^>]*id="fc-[^"]*"[^>]*>[\s\S]*?<\/div>/g,
];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    let changed = false;

    // Apply Rawline → Dripline replacements
    for (const [pattern, replacement] of replacements) {
        const before = content;
        content = content.replace(pattern, replacement);
        if (content !== before) changed = true;
    }

    if (changed) {
        renamedFiles++;
    }

    // Try to remove modal portal divs
    for (const pattern of modalPatterns) {
        const before = content;
        content = content.replace(pattern, '');
        if (content !== before) {
            whiteboxFiles++;
            break;
        }
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated: ' + path.basename(filePath));
    }
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
console.log(`\nDone.`);
console.log(`  Rawline→Dripline renames: ${renamedFiles} file(s)`);
console.log(`  Modal whitebox removals:  ${whiteboxFiles} file(s)`);
