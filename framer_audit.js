const fs = require('fs');
const path = require('path');

// Categorize all "framer" references in HTML files
const categories = {
    // SAFE to remove/replace
    visibleText: [],        // Text like "Built in Framer"
    metaTags: [],           // <meta> og tags, descriptions mentioning Framer
    htmlComments: [],       // <!-- Framer ... -->
    titleTags: [],          // <title> with Framer
    editorBarScript: [],    // __framer_force_showing_editorbar script
    commerceWidget: [],     // framercommerce widget/badge
    badgeContainer: [],     // #__framer-badge-container
    
    // UNSAFE - must NOT touch
    cssClasses: 0,          // class="framer-xxxxx"
    dataAttributes: 0,      // data-framer-name, data-framer-component-type
    jsRuntime: 0,           // framer.DKaaXHda.mjs, import from framer
    cdnUrls: 0,             // framerusercontent.com
    cssSelectors: 0,        // .framer-xxxxx in style blocks
};

function auditFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const basename = path.basename(filePath);
    
    // Count UNSAFE references
    categories.cssClasses += (content.match(/class="[^"]*framer-/g) || []).length;
    categories.dataAttributes += (content.match(/data-framer-/g) || []).length;
    categories.jsRuntime += (content.match(/from"\.\/[^"]*framer[^"]*\.mjs"/g) || []).length;
    categories.cdnUrls += (content.match(/framerusercontent\.com/g) || []).length;
    categories.cssSelectors += (content.match(/\.framer-[a-z0-9]/g) || []).length;
    
    // Find SAFE references
    // 1. Meta tags
    const metaMatches = [...content.matchAll(/<meta[^>]*(?:content|name|property)="[^"]*[Ff]ramer[^"]*"[^>]*>/g)];
    metaMatches.forEach(m => {
        if (!m[0].includes('framer-hydrate') && !m[0].includes('framer-bundle')) {
            categories.metaTags.push({ file: basename, match: m[0].substring(0, 200) });
        }
    });
    
    // 2. HTML comments mentioning Framer
    const commentMatches = [...content.matchAll(/<!--[^>]*[Ff]ramer[^>]*-->/g)];
    commentMatches.forEach(m => {
        categories.htmlComments.push({ file: basename, match: m[0].substring(0, 200) });
    });
    
    // 3. Visible text "Framer" (in paragraph, heading, span, etc.)
    const textMatches = [...content.matchAll(/>([^<]*\bFramer\b[^<]*)</g)];
    textMatches.forEach(m => {
        const text = m[1].trim();
        if (text && !text.includes('framer-') && !text.includes('.mjs') && text.length < 200) {
            categories.visibleText.push({ file: basename, text: text.substring(0, 100) });
        }
    });
    
    // 4. Editor bar script
    if (content.includes('__framer_force_showing_editorbar')) {
        categories.editorBarScript.push(basename);
    }
    
    // 5. Commerce widget
    if (content.includes('framercommerce')) {
        categories.commerceWidget.push(basename);
    }
    
    // 6. Badge container
    if (content.includes('__framer-badge-container')) {
        categories.badgeContainer.push(basename);
    }
    
    // 7. Check for Framer in <title>
    const titleMatch = content.match(/<title>[^<]*[Ff]ramer[^<]*<\/title>/);
    if (titleMatch) {
        categories.titleTags.push({ file: basename, title: titleMatch[0] });
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (file.startsWith('.') || file === 'node_modules') continue;
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            auditFile(fullPath);
        }
    }
}

walkDir('.');

console.log("============================================");
console.log("   FRAMER REFERENCE AUDIT REPORT");
console.log("============================================\n");

console.log("=== SAFE TO REMOVE/REPLACE ===\n");

console.log(`Visible text mentioning "Framer": ${categories.visibleText.length}`);
categories.visibleText.slice(0, 10).forEach(v => console.log(`  [${v.file}] "${v.text}"`));

console.log(`\nMeta tags mentioning Framer: ${categories.metaTags.length}`);
categories.metaTags.slice(0, 5).forEach(v => console.log(`  [${v.file}] ${v.match}`));

console.log(`\nHTML comments with Framer: ${categories.htmlComments.length}`);
categories.htmlComments.slice(0, 5).forEach(v => console.log(`  [${v.file}] ${v.match}`));

console.log(`\nTitle tags with Framer: ${categories.titleTags.length}`);
categories.titleTags.forEach(v => console.log(`  [${v.file}] ${v.title}`));

console.log(`\nEditor bar scripts: ${categories.editorBarScript.length} files`);
console.log(`Commerce widget refs: ${categories.commerceWidget.length} files`);
console.log(`Badge container refs: ${categories.badgeContainer.length} files`);

console.log("\n=== UNSAFE - MUST NOT TOUCH ===\n");
console.log(`CSS classes (framer-xxxxx): ${categories.cssClasses}`);
console.log(`Data attributes (data-framer-*): ${categories.dataAttributes}`);
console.log(`JS module imports (.mjs): ${categories.jsRuntime}`);
console.log(`CDN URLs (framerusercontent.com): ${categories.cdnUrls}`);
console.log(`CSS selectors (.framer-*): ${categories.cssSelectors}`);
